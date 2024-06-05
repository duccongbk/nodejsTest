// Import lớp isCheckLogin từ tệp isCheckLogin.js
import { isCheckLogin } from './ischeckLogin.js';

// Định nghĩa lớp Login và sử dụng phương thức của lớp isCheckLogin
class Login {
    constructor() {
        // Constructor của class Login
    }

    async useFetchData() {
        const checker = new isCheckLogin(); // Khởi tạo một đối tượng của lớp isCheckLogin
        try {
            const hasData = await checker.fetchDataWithCookie(); // Gọi phương thức từ đối tượng isCheckLogin
            if (hasData) {
                // console.log(hasData);
                window.location.href = '/home';
                // alert(hasData);
                return true;
            } else {
                window.location.href = '/login';
                return false;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    async login() {
        const sdt = document.getElementById('phone').value;
        const pass = document.getElementById('password').value;
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    sdt: sdt,
                    pass: pass,
                })
            });
            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                // document.cookie = `jwt=${token};`;
                alert('Login successful');
                // Redirect the user based on the provided URL
                window.location.href = data.redirectUrl + '?token=' + encodeURIComponent(token);


            } else {
                const errorMessage = await response.text();
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

}

// Khởi tạo một đối tượng của lớp Login
const loginInstance = new Login();

// Gọi phương thức useFetchData của đối tượng loginInstance khi trang web được tải
document.addEventListener("DOMContentLoaded", async function () {
    const registerbtn = document.getElementById('registerBtn'); 3
    registerbtn.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission
        window.location.href = '/register';

    });
    try {
        await loginInstance.useFetchData();
    } catch (error) {
        console.error('Error using fetch data:', error);
    }

    const loginForm = document.getElementById('loginForm');
    console.log(loginForm); // Kiểm tra xem form có được lấy đúng không
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission
        console.log('Form submitted!'); // Kiểm tra xem sự kiện submit có được kích hoạt không
        loginInstance.login();
    });

});
