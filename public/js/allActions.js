export class allActions {
    constructor() {
        // Constructor của lớp A
    }


    async showAlert(noidung) {
        try {
            const alertDiv = document.createElement('div');
            alertDiv.classList.add('alert');
            alertDiv.textContent = noidung;
            document.body.appendChild(alertDiv);
            setTimeout(function () {
                document.body.removeChild(alertDiv);
            }, 2000);
        } catch (error) {

            throw error; // Ném ra lỗi nếu có vấn đề trong quá trình fetch
        }
    }

}


