document.addEventListener("DOMContentLoaded", function () {
    const carCollection = document.getElementById('carCollection');
    const pagination = document.getElementById('pagination');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const carsPerPage = 6 * 8; // 10 xe hàng ngang * 20 xe hàng dọc
    let totalCars = 0; // Tổng số lượng xe
    let currentPage = 1;
    let cars = []; // Mảng chứa thông tin của các xe
    // <img src="${car.image2}" alt="${car.carname}">
    // <h1>${car.id_car}</h1>
    // <img src="${car.image1}" alt="${car.carname}" class="image-size"></img>
    // 
    getCars();
    function getRandomNumber() {
        // Sinh số ngẫu nhiên từ 1 đến 7
        return Math.floor(Math.random() * 7) + 1;
    }
    // Function để hiển thị các xe trên trang
    function displayCars(page) {
        carCollection.innerHTML = '';
        const startIndex = (page - 1) * carsPerPage;
        const endIndex = Math.min(startIndex + carsPerPage, totalCars);
        for (let i = startIndex; i < endIndex; i++) {
            a = getRandomNumber();
            const car = cars[i];
            const carElement = document.createElement('div');
            carElement.classList.add('car');
            carElement.innerHTML = `
                
                <h3>${car.carname}</h3>
                <p>Giá: ${car.price}</p>
                <p2>Hãng: ${car.automaker}</p2>
                <img src="${car['image' + a]}" alt="${car.carname}" class="image-size"></img>
                <!-- Thêm các hình ảnh khác tại đây -->
                <button class="add-to-cart-btn">Thêm vào giỏ hàng</button>
            `;
            carCollection.appendChild(carElement);
        }
    }
    // Function để tạo nút phân trang
    function createPaginationButtons() {
        pagination.innerHTML = ''; // Xóa nút phân trang cũ trước khi tạo mới
        const totalPages = Math.ceil(totalCars / carsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.addEventListener('click', () => {
                currentPage = i;
                displayCars(currentPage);

                // Xóa lớp active-page khỏi tất cả các nút
                const allButtons = document.querySelectorAll('.pagination button');
                allButtons.forEach(btn => btn.classList.remove('active-page'));

                // Thêm lớp active-page vào nút trang hiện tại
                button.classList.add('active-page');
            });
            pagination.appendChild(button);
        }
    }

    // Function để thêm sản phẩm vào giỏ hàng
    function addToCart(productName) {
        alert(`Đã thêm ${productName} vào giỏ hàng!`);
        // Thêm các xử lý khác tại đây (ví dụ: cập nhật giỏ hàng, lưu vào cơ sở dữ liệu, v.v.)
    }
    function viewCar(productName) {
        alert(`Đã xem ${productName} `);
        // Thêm các xử lý khác tại đây (ví dụ: cập nhật giỏ hàng, lưu vào cơ sở dữ liệu, v.v.)
    }
    // Sự kiện cho nút "Previous"
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayCars(currentPage);
        }
    });

    // Sự kiện cho nút "Next"
    nextButton.addEventListener('click', () => {
        const totalPages = Math.ceil(totalCars / carsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayCars(currentPage);
        }
    });

    // Sự kiện cho container chứa tất cả các sản phẩm
    carCollection.addEventListener('click', function (event) {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productName = event.target.parentNode.querySelector('h3').textContent;
            addToCart(productName);
        } else {
            const productName = event.target.parentNode.querySelector('h1').textContent;
            viewCar(productName);

        }
    });

    function getCars() {
        fetch('/getCars', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.length > 0) {
                    totalCars = data.length;
                    cars = data.map(item => item.arrCars); // Lấy thông tin của các xe từ dữ liệu trả về
                    displayCars(currentPage); // Hiển thị các xe trên trang
                    createPaginationButtons(); // Tạo nút phân trang
                }
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
    }
});
