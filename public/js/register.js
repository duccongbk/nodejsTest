document.getElementById('register-form').addEventListener('submit', function (event) {
    grecaptcha.enterprise.ready(async () => {
        const token = await grecaptcha.enterprise.execute('6LfPYscpAAAAANFAF80-m0TiK0dLW-hjM2ybUJy7', { action: 'LOGIN' });
    });
    event.preventDefault();

    var phone = document.getElementById('phone').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Mật khẩu và xác nhận mật khẩu không khớp!');
        return;
    }

    // Gửi dữ liệu đăng ký đi ở đây
    // Ví dụ: sử dụng Ajax hoặc fetch để gửi dữ liệu đăng ký đến server
});
