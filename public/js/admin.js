document.addEventListener('DOMContentLoaded', function () {

    const userProfile = document.getElementById('user-profile');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const dropdownMenuUser = document.getElementById('dropdown-menu-Users');
    const dropdownMenuProducts = document.getElementById('dropdown-menu-Products');
    userProfile.addEventListener('click', function () {
        dropdownMenu.style.display = (dropdownMenu.style.display === 'block') ? 'none' : 'block';
    });

    document.getElementById("Users").addEventListener("click", function () {
        if (dropdownMenuUser.style.display === "none") {
            dropdownMenuUser.style.display = "block";
        } else {
            dropdownMenuUser.style.display = "none";
        }
    });
    document.getElementById("Products").addEventListener("click", function () {
        if (dropdownMenuProducts.style.display === "none") {
            dropdownMenuProducts.style.display = "block";
        } else {
            dropdownMenuProducts.style.display = "none";
        }
    });

    document.getElementById('Show-btn1').addEventListener('click', function () {
        const userTable = document.getElementById('userTable');
        userTable.style.display = 'table';
        ShowUsers();
    });
    document.getElementById('Show-btn-Products').addEventListener('click', function () {
        const userTable = document.getElementById('userTable');
        userTable.style.display = 'table';
        ShowCars();

    });
    document.getElementById('btn-reload').addEventListener('click', function () {
        event.preventDefault();
        ShowUsers();
    });
    document.getElementById('searchInput').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Ngăn chặn hành động mặc định của phím Enter
            const username = document.getElementById('searchInput').value;
            searchUser(username);
        }
    });

    document.getElementById('btn-search').addEventListener('click', function () {
        const username = document.getElementById('searchInput').value;
        searchUser(username);
    });

});

function ShowUsers() {
    // const userTableBody = document.getElementById('userTableBody');
    // userTableBody.innerHTML = '';

    fetch('/getUsers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Đăng nhập không thành công');
            }
        })
        .then(data => {

            // showUserOnTable(data);
            // showUserOnTable(data);
            createPagination(data, 10, "Users");
            displayPage(data, 1, 10, "Users");
        })
        .catch(error => {
            console.error('Đã xảy ra lỗi:', error);
        });
}
function ShowCars() {
    fetch('/getCarsInfo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Đăng nhập không thành công');
            }
        })
        .then(data => {
            createPagination(data, 10, "Cars");
            displayPage(data, 1, 10, "Cars");
        })
        .catch(error => {
            console.error('Đã xảy ra lỗi:', error);
        });
}

function editUserOrCar(id_user_car, choosen) {
    if (choosen === 'User') {
        window.open(`/editUser_Car?id_user=${id_user_car}&choosen=${choosen}`, '_blank');
    } else if (choosen === 'Car') {
        window.open(`/editUser_Car?id_car=${id_user_car}&choosen=${choosen}`, '_blank');
    } else {
        // Xử lý trường hợp khác nếu cần
        console.error('Invalid option provided');
    }
}


function deleteUserOrCar(id_user) {
    // Hiển thị hộp thoại xác nhận
    const isConfirmed = confirm("Bạn có chắc chắn muốn xóa người dùng này?");

    // Kiểm tra xem người dùng đã xác nhận hoặc không
    if (isConfirmed) {
        // Tạo đối tượng chứa dữ liệu cần gửi


        // Gửi yêu cầu DELETE đến endpoint '/deleteUser' trên máy chủ
        fetch('/deleteUser', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                id_user: id_user,
            })
        })
            .then(response => {
                if (response.ok) {
                    alert('User data deleted successfully');
                    ShowUsers();

                    // Thực hiện các hành động cần thiết khi xóa thành công (nếu có)
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

function searchUser(username) {
    document.getElementById('searchInput').value = '';
    fetch('/searchUsers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },

        body: new URLSearchParams({
            username: username,
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to search users');
            }
            return response.json();
        })
        .then(data => {
            createPagination(data, 10, "Users");
            displayPage(data, 1, 10, "Users");
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
}
function convertTime(timezone) {
    const originalTime = new Date(timezone);
    originalTime.setHours(originalTime.getHours() + 7);
    const day = originalTime.getDate();
    const month = originalTime.getMonth() + 1;
    const year = originalTime.getFullYear();
    const hours = originalTime.getHours();
    const minutes = originalTime.getMinutes();
    const seconds = originalTime.getSeconds();
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    const formattedTime = `${formattedDay}-${formattedMonth}-${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    return formattedTime;
}
function createPagination(data, itemsPerPage, choosen) {

    const totalPages = Math.min(Math.ceil(data.length / itemsPerPage), 50); // Giới hạn số trang tối đa là 50
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => {
            displayPage(data, i, itemsPerPage, choosen);
            const paginationButtons = document.querySelectorAll('#pagination button');
            paginationButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
        paginationContainer.appendChild(button);
    }
    // Tạo nút "First Preview"

    // Tạo nút "Previous"
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.addEventListener('click', () => {
        const selectedButton = document.querySelector('#pagination button.selected');
        let currentPage = parseInt(selectedButton.textContent);
        if (currentPage > 1) {
            displayPage(data, currentPage - 1, itemsPerPage, choosen);
            selectedButton.classList.remove('selected');
            currentPage -= 1;
            const prevPageButton = document.querySelector(`#pagination button:nth-child(${currentPage})`);
            prevPageButton.classList.add('selected');
        }
    });
    paginationContainer.appendChild(prevButton);

    // Tạo các nút trang


    // Tạo nút "Next"
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
        const selectedButton = document.querySelector('#pagination button.selected');
        let currentPage = parseInt(selectedButton.textContent);
        if (currentPage < totalPages) {
            displayPage(data, currentPage + 1, itemsPerPage, choosen);
            selectedButton.classList.remove('selected');
            currentPage += 1;
            const nextPageButton = document.querySelector(`#pagination button:nth-child(${currentPage})`);
            nextPageButton.classList.add('selected');
        }
    });
    paginationContainer.appendChild(nextButton);
    const firstPreviewButton = document.createElement('button');
    firstPreviewButton.textContent = 'First Preview';
    firstPreviewButton.addEventListener('click', () => {
        displayPage(data, 1, itemsPerPage, choosen);
        const paginationButtons = document.querySelectorAll('#pagination button');
        paginationButtons.forEach(btn => btn.classList.remove('selected'));
        firstPreviewButton.classList.add('selected');
    });
    paginationContainer.appendChild(firstPreviewButton);

    // Tạo nút "Last Preview"
    const lastPreviewButton = document.createElement('button');
    lastPreviewButton.textContent = 'Last Preview';
    lastPreviewButton.addEventListener('click', () => {
        displayPage(data, totalPages, itemsPerPage, choosen);
        const paginationButtons = document.querySelectorAll('#pagination button');
        paginationButtons.forEach(btn => btn.classList.remove('selected'));
        lastPreviewButton.classList.add('selected');
    });
    paginationContainer.appendChild(lastPreviewButton);

    // Hiển thị trang đầu tiên ban đầu
    const firstPageButton = document.querySelector('#pagination button:first-child');
    firstPageButton.classList.add('selected');
    displayPage(data, 1, itemsPerPage, choosen);
}


function displayPage(data, pageNumber, itemsPerPage, choosen) {
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = data.slice(startIndex, endIndex);
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = '';

    if (pageData.length > 0) {
        switch (choosen) {
            case 'Users':
                const columnUsers = ['STT', 'Tên', 'Số điện thoại', 'Địa chỉ', 'Ngày đăng ký', 'Tùy Chỉnh'];

                // Lặp qua mảng columnHeaders để tạo các thẻ <th> và thêm chúng vào <thead>
                columnUsers.forEach(headerText => {
                    const th = document.createElement('th');
                    th.textContent = headerText;
                    userTableBody.appendChild(th);
                });
                pageData.forEach((item, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${startIndex + index + 1}</td>
                        <td>${item.arrusers.ten}</td>
                        <td>${item.arrusers.sdt}</td>
                        <td>${item.arrusers.diachi}</td>
                        <td>${convertTime(item.arrusers.created_at)}</td>
                        <td>
                            <button class="btn" onclick="editUserOrCar('${item.arrusers.id_user.toString()}','User')"><img src="edit_icon.png" alt="Sửa"></button>
                        </td>
                        <td> 
                            <button class="btn-click" onclick="deleteUserOrCar('${item.arrusers.id_user.toString()}','User')"><img src="delete_icon.png" alt="Xóa"></button>
                        </td>
                    `;
                    userTableBody.appendChild(row);
                });
                break;
            case 'Cars':
                const columnCars = ['STT', 'Tên', 'Số điện thoại', 'Địa chỉ', 'Tên Xe', 'Hãng Xe', 'Giá Xe', 'Ngày Đăng', 'Trạng Thái'];
                // Lặp qua mảng columnHeaders để tạo các thẻ <th> và thêm chúng vào <thead>
                columnCars.forEach(headerText => {
                    const th = document.createElement('th');
                    th.textContent = headerText;
                    userTableBody.appendChild(th);
                });
                pageData.forEach((item, index) => {

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${startIndex + index + 1}</td>
                        <td>${item.arrCars.user_ten}</td>
                        <td>${item.arrCars.user_sdt}</td>
                        <td>${item.arrCars.user_diachi}</td>
                        <td>${item.arrCars.carname}</td>
                        <td>${item.arrCars.automaker}</td>
                        <td>${item.arrCars.price}</td>
                        <td>${convertTime(item.arrCars.car_created_at)}</td>   
                        <td>
                      <select id="activeDropdown" class="activeDropdown">
                      <option value="active" ${item.arrCars.active === 'active' ? 'selected' : ''} style="color: green;">Active</option>
                      <option value="inactive" ${item.arrCars.active === 'inactive' ? 'selected' : ''} style="color: red;">Inactive</option>
                      </select>
                        </td>
                        <td>
                            <button class="btn" onclick="editUserOrCar('${item.arrCars.id_car.toString()}','Car')"><img src="edit_icon.png" alt="Sửa"></button>
                        </td>
                        <td> 
                            <button class="btn-click" onclick="deleteUserOrCar('${item.arrCars.id_car.toString()}','Car')"><img src="delete_icon.png" alt="Xóa"></button>
                        </td>
                    `;
                    userTableBody.appendChild(row);
                });
                break;

            default:
                console.log('I have no preference.');
        }



    } else {
        alert("Không có dữ liệu để hiển thị");
    }
}
