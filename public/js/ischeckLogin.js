export class isCheckLogin {
    constructor() {
        // Constructor của lớp A
    }

    // Phương thức fetchDataWithCookie để kiểm tra xem có dữ liệu từ server hay không
       async fetchDataWithCookie() {
        try {
            const response = await fetch('/protected', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data; // Trả về dữ liệu JSON từ server
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
            throw error; // Ném ra lỗi nếu có vấn đề trong quá trình fetch
        }
    }

}
// Tạo một đối tượng của lớp isCheckLogin

