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
export class fetchActions {
    constructor() {
        // Constructor của lớp A
    }
    async editUserCar(id_car, option) {
        fetch('/updateCar', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                id_car: id_car,
                active: option,
            })
        })
            .then(response => {
                if (response.ok) {
                    alert('Car data updated successfully');
                    // ShowCars();
                } else {
                    alert('Failed to update user data:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error updating user data:', error);
            });
    }

    async deleteCar(id_car) {
        // Hiển thị hộp thoại xác nhận
        const isConfirmed = confirm("Bạn có chắc chắn muốn xóa người dùng này?");
        // Kiểm tra xem người dùng đã xác nhận hoặc không
        if (isConfirmed) {
            // Tạo đối tượng chứa dữ liệu cần gửi
            // Gửi yêu cầu DELETE đến endpoint '/deleteUser' trên máy chủ
            fetch('/deleteCar', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    id_car: id_car,
                })
            })
                .then(response => {
                    if (response.ok) {
                        alert('User data deleted successfully');
                    } else {
                        alert('Failed to delete user data:', response.statusText);
                        // Xử lý khi có lỗi xảy ra
                    }
                })
                .catch(error => {
                    console.error('Error deleting user data:', error);
                    // Xử lý khi có lỗi xảy ra
                });
        } else {
            // Hủy thực hiện xóa
            // alert("Người dùng đã hủy xóa");
        }
    }
}



