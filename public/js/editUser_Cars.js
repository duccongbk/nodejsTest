document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idUser = urlParams.get('id_user');
    const choosen = urlParams.get('choosen'); // Lấy tham số choosen từ URL

    const saveButton = document.getElementById('savebutton');

    getUser(idUser);

    saveButton.addEventListener('click', function () {
        event.preventDefault();
        editUser(idUser);
    });
});

async function getUser(idUser) {
    try {
        const response = await fetch('/getUserByid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                id_user: idUser
            })
        });

        if (response.ok) {
            const userData = await response.json();
            document.getElementById('name').value = userData.ten;
            document.getElementById('phone').value = userData.sdt;
            document.getElementById('address').value = userData.diachi;
            document.getElementById('registrationDate').value = convertTime(userData.created_at);
        } else {
            const errorMessage = await response.text();
            alert(errorMessage);
        }
    } catch (error) {
        console.error('Error:', error);
    }
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

function editUser(idUser) {
    const ten = document.getElementById('name').value;
    const sdt = document.getElementById('phone').value;


    fetch('/updateUser', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            id_user: idUser,
            ten: ten,
            sdt: sdt
        })
    })
        .then(response => {
            if (response.ok) {
                alert('User data updated successfully');
            } else {
                alert('Failed to update user data:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error updating user data:', error);
        });
}
