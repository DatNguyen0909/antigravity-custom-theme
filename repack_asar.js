process.noAsar = true;
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const asarBinding = process._linkedBinding('electron_common_asar');

const rootDir = __dirname;
const os = require('os');
const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
const resourcesDir = path.join(localAppData, 'Programs', 'antigravity', 'resources');
const asarBakPath = path.join(resourcesDir, 'app.asar.bak');
const liveAsarPath = path.join(resourcesDir, 'app.asar');
const tempAsarPath = path.join(rootDir, 'temp_build.asar');
const cleanBundlePath = path.join(rootDir, 'clean_bundle.js');

function isAsarClean(asarPath) {
    try {
        if (!fs.existsSync(asarPath)) return false;
        const testFd = fs.openSync(asarPath, 'r');
        const b16 = Buffer.alloc(16);
        fs.readSync(testFd, b16, 0, 16, 0);
        const testBaseOffset = 8 + b16.readUInt32LE(4);
        const jLen = b16.readUInt32LE(12);
        const jBuf = Buffer.alloc(jLen);
        fs.readSync(testFd, jBuf, 0, jLen, 16);
        const hdr = JSON.parse(jBuf.toString('utf8'));
        const pEntry = hdr.files.dist.files['preload.js'];
        const pBuf = Buffer.alloc(pEntry.size);
        fs.readSync(testFd, pBuf, 0, pEntry.size, testBaseOffset + parseInt(pEntry.offset));
        fs.closeSync(testFd);
        return !pBuf.toString('utf8').includes('ANTIGRAVITY CUSTOM THEME ENGINE');
    } catch (e) {
        return false;
    }
}

// If app.asar.bak is missing OR live app.asar was freshly updated (clean/unpatched), refresh app.asar.bak from live app.asar
if (!fs.existsSync(asarBakPath) || isAsarClean(liveAsarPath)) {
    console.log('Detected clean/updated app.asar -> Backing up to app.asar.bak...');
    fs.copyFileSync(liveAsarPath, asarBakPath);
}

const fd = fs.openSync(asarBakPath, 'r');
const buf16 = Buffer.alloc(16);
fs.readSync(fd, buf16, 0, 16, 0);
const baseOffset = 8 + buf16.readUInt32LE(4);
const jsonLen = buf16.readUInt32LE(12);
const jsonBuf = Buffer.alloc(jsonLen);
fs.readSync(fd, jsonBuf, 0, jsonLen, 16);
const header = JSON.parse(jsonBuf.toString('utf8'));

const origPreloadEntry = header.files.dist.files['preload.js'];
const origPreloadBuf = Buffer.alloc(origPreloadEntry.size);
fs.readSync(fd, origPreloadBuf, 0, origPreloadEntry.size, baseOffset + parseInt(origPreloadEntry.offset));

const cleanBundle = fs.readFileSync(cleanBundlePath, 'utf8');
const newPreloadBuf = Buffer.from(origPreloadBuf.toString('utf8') + '\n\n' + cleanBundle, 'utf8');

const fileEntries = [];
function walk(node, currentPath) {
    if (node.files) {
        for (const name of Object.keys(node.files)) {
            walk(node.files[name], currentPath ? currentPath + '/' + name : name);
        }
    } else if (!node.unpacked) {
        fileEntries.push({
            path: currentPath,
            node: node,
            origOffset: parseInt(node.offset),
            origSize: node.size
        });
    }
}
walk(header, '');
fileEntries.sort((a, b) => a.origOffset - b.origOffset);

origPreloadEntry.size = newPreloadBuf.length;
if (origPreloadEntry.integrity) {
    const blockSize = origPreloadEntry.integrity.blockSize || 4194304;
    const blocks = [];
    for (let i = 0; i < newPreloadBuf.length; i += blockSize) {
        blocks.push(crypto.createHash('sha256').update(newPreloadBuf.subarray(i, i + blockSize)).digest('hex'));
    }
    origPreloadEntry.integrity = {
        algorithm: 'SHA256',
        hash: crypto.createHash('sha256').update(newPreloadBuf).digest('hex'),
        blockSize: blockSize,
        blocks: blocks
    };
}

let curOffset = 0;
for (const entry of fileEntries) {
    entry.node.offset = curOffset.toString();
    const size = (entry.path === 'dist/preload.js') ? newPreloadBuf.length : entry.origSize;
    curOffset += size;
}

const newJsonStr = JSON.stringify(header);
const rawJsonBuf = Buffer.from(newJsonStr, 'utf8');
const unpaddedLen = rawJsonBuf.length;
const padding = (4 - (unpaddedLen % 4)) % 4;
const paddedBuf = padding > 0 ? Buffer.concat([rawJsonBuf, Buffer.alloc(padding)]) : rawJsonBuf;

const headerBuf = Buffer.alloc(16);
headerBuf.writeUInt32LE(4, 0);
headerBuf.writeUInt32LE(paddedBuf.length + 8, 4);
headerBuf.writeUInt32LE(paddedBuf.length + 4, 8);
headerBuf.writeUInt32LE(unpaddedLen, 12);

const outFd = fs.openSync(liveAsarPath, 'w');
fs.writeSync(outFd, headerBuf);
fs.writeSync(outFd, paddedBuf);

for (const entry of fileEntries) {
    if (entry.path === 'dist/preload.js') {
        fs.writeSync(outFd, newPreloadBuf);
    } else {
        const fileBuf = Buffer.alloc(entry.origSize);
        fs.readSync(fd, fileBuf, 0, entry.origSize, baseOffset + entry.origOffset);
        fs.writeSync(outFd, fileBuf);
    }
}

fs.closeSync(fd);
fs.closeSync(outFd);

if (fs.existsSync(tempAsarPath)) {
    try { fs.unlinkSync(tempAsarPath); } catch (e) {}
}

const archive = new asarBinding.Archive(liveAsarPath);
const stat = archive.stat('dist/preload.js');
console.log('Verified archive dist/preload.js:', stat);

// Verify package.json in the newly written app.asar is 100% valid JSON
const vFd = fs.openSync(liveAsarPath, 'r');
const vB16 = Buffer.alloc(16);
fs.readSync(vFd, vB16, 0, 16, 0);
const vBase = 8 + vB16.readUInt32LE(4);
const vJLen = vB16.readUInt32LE(12);
const vJBuf = Buffer.alloc(vJLen);
fs.readSync(vFd, vJBuf, 0, vJLen, 16);
const vHdr = JSON.parse(vJBuf.toString('utf8'));
const vPkg = vHdr.files['package.json'];
const vPkgBuf = Buffer.alloc(vPkg.size);
fs.readSync(vFd, vPkgBuf, 0, vPkg.size, vBase + parseInt(vPkg.offset));
fs.closeSync(vFd);
const parsedPkg = JSON.parse(vPkgBuf.toString('utf8'));
console.log('Verified package.json in app.asar:', parsedPkg.name, parsedPkg.version);
console.log('Deployed successfully to:', liveAsarPath);
