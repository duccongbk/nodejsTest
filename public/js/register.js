


document.getElementById('register-form').addEventListener('submit', function (event) {
    // grecaptcha.enterprise.ready(async () => {
    //     const token = await grecaptcha.enterprise.execute('6LfPYscpAAAAANFAF80-m0TiK0dLW-hjM2ybUJy7', { action: 'LOGIN' });
    // });
    event.preventDefault();
    register();

    // Gửi dữ liệu đăng ký đi ở đây
    // Ví dụ: sử dụng Ajax hoặc fetch để gửi dữ liệu đăng ký đến server
});
function register() {
    var _name = document.getElementById('name').value;
    var phone = document.getElementById('phone').value;
    var address = document.getElementById('address').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm-password').value;
    if (_name == '' || phone == '' || address == '' || password == '' || confirmPassword == '') {
        alert("không được để trống")
    } else {
        if (password !== confirmPassword) {
            alert('Mật khẩu và xác nhận mật khẩu không khớp!');
            return;
        } else {
            fetch('/addUsers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    ten: _name,
                    sdt: phone,
                    pass: password,
                    diachi: address,
                })

            })
                .then(response => {
                    // Xử lý phản hồi từ máy chủ

                    if (response.ok) {
                        // Nếu phản hồi thành công, lấy dữ liệu từ phản hồi

                        return response.text(); // Trả về dữ liệu văn bản từ phản hồi
                    } else {
                        throw new Error('Đã xảy ra lỗi khi thêm người dùng');
                    }

                })
                .then(data => {
                    if (data === 'true') {
                        // Nếu phản hồi từ máy chủ là 'true', có nghĩa là người dùng đã được thêm thành công
                        alert('Người dùng đã được thêm thành công!');
                        resetForm();
                        window.location.href = '/login';
                        // Thực hiện các hành động khác (nếu cần)
                    } else if (data === 'phonetrue') {
                        // Nếu phản hồi từ máy chủ là 'Số điện thoại đã được sử dụng', hiển thị thông báo tương ứng
                        alert('Số điện thoại đã được sử dụng. Vui lòng sử dụng số điện thoại khác!');
                    } else {
                        // Trường hợp xử lý phản hồi khác có thể được xử lý ở đây
                    }

                })
                .catch(error => {
                    // Xử lý lỗi nếu có
                    console.error('Đã xảy ra lỗi:', error);
                });
        }

    }
}
function resetForm() {
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';;
    document.getElementById('address').value = '';;
    document.getElementById('password').value = '';;
    document.getElementById('confirm-password').value = '';
}
