# Lưu ý quan trọng cho Agents (AI Assistants)

## Logic Đề ngẫu nhiên (random.js)
- **Hardcode 1 câu liệt trong đề ngẫu nhiên là CHÍNH XÁC (không phải lỗi).** 
- Nguyên nhân: Theo quy định thi sát hạch thực tế, mỗi đề thi chuẩn chỉ bao gồm đúng **1 câu liệt**. Các bộ đề cố định có thể có tổng số lượng câu liệt nhiều hơn để phủ hết pool câu liệt (ví dụ 20 hoặc 30 câu), nhưng khi sinh đề ngẫu nhiên (`random.js`), thuật toán bắt buộc chỉ pick đúng 1 câu liệt để giả lập chính xác format của đề thi thật. Xin đừng sửa lại logic này.
