
import { TableFactory } from './tableFactory.js';
const userProfile = document.getElementById('user-profile');
const dropdownMenu = document.getElementById('dropdown-menu');
const dropdownMenuUser = document.getElementById('dropdown-menu-Users');
const dropdownMenuProducts = document.getElementById('dropdown-menu-Products');
const searchcontainer = document.getElementById('searchContainer');

let currentPage = 1;
let currentTable = null;
let currentType = '';

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    document.cookie = `jwt=${token}; path=/;`;
    getUser();
});
async function getUser() {
    fetch('/getUserByid', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(response => {
            if (!response.ok) {
                const confirmResult = confirm("Bạn cần đăng nhập để tiếp tục. Bạn có muốn chuyển đến trang đăng nhập không?");
                if (confirmResult === true) {
                    window.open('/login', '_blank');
                }
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                showUserInfo(data);
            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}

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

document.getElementById('Show-btn1').addEventListener('click', async () => {
    userTable.style.display = 'table';
    searchcontainer.style.display = "block";
    currentType = 'users';
    currentTable = TableFactory.createTable(currentType);
    await currentTable.fetchDataAndDisplay(await currentTable.fetchData('/getUsers'), 1, 10);
});
document.getElementById('Show-btn-Products').addEventListener('click', async () => {
    userTable.style.display = 'table';
    searchcontainer.style.display = "block";
    currentPage = 1;
    currentType = 'cars';
    currentTable = TableFactory.createTable(currentType);
    await currentTable.fetchDataAndDisplay(await currentTable.fetchData('/getCarsInfo'), 1, 10);
});
// document.getElementById('btn-reload').addEventListener('click', function () {
//     event.preventDefault();

// });

document.getElementById('searchInput').addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Ngăn chặn hành động mặc định của phím Enter
        const typesearch = document.getElementById('searchInput').value;

        switch (currentType) {
            case 'users':
                await currentTable.search(await currentTable.fetchData('/getUsers'), typesearch, 1, 8);
                break;
            case 'cars':
                await currentTable.search(await currentTable.fetchData('/getCarsInfo'), typesearch, 1, 10);
                break;
            default:
                console.log('Unknown type');
                // Xử lý cho trường hợp loại không xác định
                break;
        }

        document.getElementById('searchInput').value = ''; // Xóa giá trị của trường tìm kiếm sau khi thực hiện tìm kiếm
    }
});

document.getElementById('searchButton').addEventListener('click', async () => {

    var typesearch = document.getElementById('searchInput').value;
    switch (currentType) {
        case 'users':
            await currentTable.search(await currentTable.fetchData('/getUsers'), typesearch, 1, 8);
            break;
        case 'cars':
            await currentTable.search(await currentTable.fetchData('/getCarsInfo'), typesearch, 1, 10);
            break;
        default:
            console.log('Unknown type');
            // Xử lý cho trường hợp loại không xác định
            break;
    }
    document.getElementById('searchInput').value = '';
});


function showUserInfo(data) {
    const imgElement = document.getElementById("imageUser");
    const spanElement = document.getElementById("spanUser");
    imgElement.src = "C:\project\BanOto\public\images\0a0d3cbc-0068-4ec5-b663-e2b56db497d0-images (1).jfif";
    imgElement.alt = "User Avatar";
    // Lấy thẻ span chứa tên người dùng và thiết lập nội dung
    spanElement.textContent = data.ten;
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

    createPagination(searchData, 10, "Cars", 1);
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



// });
function deleteCar(id_car, currentPage) {
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
                    reloadData(currentPage);
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
                // ShowCars();
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