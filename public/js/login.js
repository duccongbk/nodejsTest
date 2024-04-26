document.addEventListener("DOMContentLoaded", function () {
    const registerBtn = document.getElementById('registerBtn');
    registerBtn.addEventListener('click', function () {
        // Redirect to register page or perform other actions
        window.location.href = '/addCars';
        console.log('Redirecting to register page...');
    });

    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function (event) {
        window.location.href = '/home';
        event.preventDefault(); // Prevent form submission


        // // Get username and password from the form
        // const username = document.getElementById('username').value;
        // const password = document.getElementById('password').value;

        // // Perform login authentication (you can replace this with your authentication logic)
        // if (username === 'admin' && password === 'admin') {
        //     alert('Login successful!');
        //     // Redirect to dashboard or perform other actions
        //     console.log('Redirecting to dashboard...');
        // } else {
        //     alert('Invalid username or password. Please try again.');
        // }
    });
});
