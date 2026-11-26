# Antigravity Custom Theme Engine ✨ (v7 MVVM)

Bộ giao diện tùy biến (Custom UI Theme) dành cho **Google Antigravity Desktop Client** với 15 chủ đề linh vật Chibi, hiệu ứng tự động mỗi 15 giây, tư thế riêng khi gõ phím và hoạt cảnh sân khấu khi rê chuột — được tổ chức theo kiến trúc **MVVM**.

## 📂 Cấu trúc dự án (Kiến trúc MVVM)

```text
antigravity-custom-theme/
├── stickers/                       # 45 file SVG linh vật (tự động quét theo <id>.svg / -action / -typing)
├── src/
│   ├── models/                     # [MODEL] Dữ liệu thuần (Single Source of Truth)
│   │   ├── themes.js               # 15 chủ đề (màu, sparkle, hoverBursts, typingFx)
│   │   ├── backgrounds.js          # Bảng màu nền & Sidebar kính mờ (Dark / Light)
│   │   └── decor.js                # Họa tiết nền SVG & cấu hình hạt bay DECOR
│   ├── services/                   # [SERVICE] Lưu trữ & môi trường
│   │   ├── storageService.js       # Đồng bộ localStorage + Electron storage.json trên ổ đĩa
│   │   └── environmentService.js   # Nhận diện Light/Dark mode, lọc portal/tooltip, reset SVG
│   ├── viewmodels/                 # [VIEWMODEL] State & điều phối logic phản ứng
│   │   └── themeViewModel.js       # Quản lý config, command đổi theme/độ tối, trạng thái gõ phím
│   ├── views/                      # [VIEW] Giao diện DOM & CSS tách biệt
│   │   ├── styles/
│   │   │   ├── base.css            # Nền, overlay, sidebar, editor, bong bóng chat, ô nhập
│   │   │   ├── mascots.css         # Animation idle, hover stage & hiệu ứng gõ của 15 linh vật
│   │   │   └── settings.css        # Giao diện bảng Settings Custom Theme
│   │   ├── backgroundView.js       # Render #ag-custom-bg, #ag-custom-overlay, #ag-custom-decor
│   │   ├── chatView.js             # Render bong bóng chat, ô nhập, sticker, hạt gõ phím
│   │   └── settingsView.js         # Hook tab Custom theme & bảng chọn chủ đề trong Settings
│   └── app.js                      # Điểm khởi chạy (MVVM subscription, MutationObserver, tick)
├── build_bundle.js                 # (~80 dòng) Trình đóng gói tự động src/ + stickers/ -> clean_bundle.js
├── clean_bundle.js                 # Bản bundle đã biên dịch
├── repack_asar.js                  # Đóng gói an toàn vào resources/app.asar (tự backup bản mới)
├── install.bat                     # Chạy 1 click để build & cài đặt theme
├── uninstall.bat                   # Khôi phục app.asar gốc từ app.asar.bak
└── README.md                       # Tài liệu hướng dẫn
```
