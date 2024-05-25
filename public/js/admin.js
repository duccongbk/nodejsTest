// document.addEventListener('DOMContentLoaded', function () {

const userProfile = document.getElementById('user-profile');
const dropdownMenu = document.getElementById('dropdown-menu');
const dropdownMenuUser = document.getElementById('dropdown-menu-Users');
const dropdownMenuProducts = document.getElementById('dropdown-menu-Products');
let dataArr = [];
let choosen = null;
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
    choosen = 'Users';
    const userTable = document.getElementById('userTable');
    userTable.style.display = 'table';
    ShowUsers();
});
document.getElementById('Show-btn-Products').addEventListener('click', function () {
    choosen = 'Cars';
    const userTable = document.getElementById('userTable');
    userTable.style.display = 'table';
    ShowCars();

});
document.getElementById('btn-reload').addEventListener('click', function () {
    event.preventDefault();
    reloadData();
});
// document.getElementById('btn-delete-car').addEventListener('click', function () {
//     event.preventDefault();
//     deleteCar();
// });
document.getElementById('searchInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Ngăn chặn hành động mặc định của phím Enter
        const username = document.getElementById('searchInput').value;
        searchInfo(username, dataArr);
    }
});

document.getElementById('btn-search').addEventListener('click', function () {
    const username = document.getElementById('searchInput').value;
    searchInfo(username, dataArr);
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
            dataArr = data.slice();
            createPagination(data, 10, choosen);
            displayPage(data, 1, 10, choosen);
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
            dataArr = data.slice();
            createPagination(data, 10, choosen);
            displayPage(data, 1, 10, choosen);
        })
        .catch(error => {
            console.error('Đã xảy ra lỗi:', error);
        });
}

function reloadData() {
    switch (choosen) {
        case 'Cars':
            ShowCars();
            break;
        case 'Users':
            ShowUsers();
            break;
        default:
            console.log('I have no preference.');
    }
}
function searchInfo(keyword, data) {
    document.getElementById('searchInput').value = '';
    switch (choosen) {
        case 'Cars':
            const searchData = data.filter(item => {
                // Lọc các người dùng có tên chứa từ khóa tìm kiếm
                return item.arrCars.user_ten.toLowerCase().includes(keyword.toLowerCase());
            });

            createPagination(searchData, 10, choosen);
            displayPage(searchData, 1, 10, choosen);
            break;
        case 'Users':
            const searchData2 = data.filter(item => {
                // Lọc các người dùng có tên chứa từ khóa tìm kiếm
                return item.arrusers.ten.toLowerCase().includes(keyword.toLowerCase());
            });

            createPagination(searchData2, 10, choosen);
            displayPage(searchData2, 1, 10, choosen);
            break;
        default:
            console.log('I have no preference.');
    }

    const searchData = data.filter(item => {
        // Lọc các người dùng có tên chứa từ khóa tìm kiếm
        return item.arrCars.user_ten.toLowerCase().includes(keyword.toLowerCase());
    });

    createPagination(searchData, 10, "Cars");
    displayPage(searchData, 1, 10, "Cars");
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
                            <button class="btn" onclick="editUser('${item.arrusers.id_user.toString()}')"><img src="edit_icon.png" alt="Sửa"></button>
                        </td>
                        <td> 
                            <button class="btn-click" onclick="deleteUser('${item.arrusers.id_user.toString()}')"><img src="delete_icon.png" alt="Xóa"></button>
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
                      <select id="activeDropdown" class="activeDropdown" onchange="editUserCar('${item.arrCars.id_car.toString()}', this.value)">
                      <option value="active" ${item.arrCars.active === 'active' ? 'selected' : ''} style="color: green;">Active</option>
                      <option value="inactive" ${item.arrCars.active === 'inactive' ? 'selected' : ''} style="color: red;">Inactive</option>
                      <option value="null" ${item.arrCars.active === 'null' ? 'selected' : ''} style="color: red;">Null</option>
                      <option value="block" ${item.arrCars.active === 'block' ? 'selected' : ''} style="color: red;">Block</option>
                      </select>
                        </td>
                        <td>
                            <button class="btn" id="btn-edit-car" onclick="editUserCar('${item.arrCars.id_car.toString()}', this.value)"><img src="edit_icon.png" alt="Sửa"></button>
                        </td>
                        <td> 
                            <button class="btn-click" id="btn-delete-car" onclick="deleteCar('${item.arrCars.id_car.toString()}')"><img src="delete_icon.png" alt="Xóa"></button>
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

// });
function deleteCar(id_car) {
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
                    ShowCars();
                    // refeshCar();
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
function refeshCar(choosen) {
    choosen = "Cars"
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
            dataArr = data.slice();
            createPagination(data, 10, choosen);
            displayPage(data, 1, 10, choosen);
        })
        .catch(error => {
            console.error('Đã xảy ra lỗi:', error);
        });
}

function editUser(id_user) {
    window.open(`/editUser_Car?id_user=${id_user}`, '_blank');
    console.error('Invalid option provided');
}

function editUserCar(id_car, option) {
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
                ShowCars();
            } else {
                alert('Failed to update user data:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error updating user data:', error);
        });
}


function deleteUser(id_user) {
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