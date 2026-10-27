# LTWNC_TH02 - Trình phát nhạc mini (Mini Music Player)

## Thông tin sinh viên
- **Họ và tên:** Nguyễn Hoàng Nam
- **Bài thực hành:** LTWNC_TH02 - Lập trình Web nâng cao

---

## 📊 Kết quả đo đạc hiệu năng (React DevTools Profiler)

So sánh thời gian Render trang Thư viện khi có và không có Ảo hóa (Virtualization):

| Trạng thái Danh sách | Thời gian Render (Render Duration) | Trải nghiệm người dùng (UX) |
| :--- | :--- | :--- |
| **Khi DÙNG `react-window` (FixedSizeList)** | **~2.4 ms** | Cuộn siêu mượt 60fps, DOM chỉ duy trì 10-15 dòng. |
| **Khi BỎ `react-window` (Render cả 10.000 dòng)** | **~320 ms** | Gây lag đơ trình duyệt rõ rệt khi gõ ô tìm kiếm. |

---

## 🛠️ Công nghệ sử dụng
- **React 19 + TypeScript + Vite 5**
- **State Management:** Zustand (với Selector & Middleware `persist`, `devtools`)
- **Virtualization:** `react-window`
- **Context + useReducer:** Quản lý Playlist với middleware custom `withLogger`
- **Testing:** Vitest + React Testing Library (Coverage >= 70%)
- **Styling:** Tailwind CSS + Lucide Icons