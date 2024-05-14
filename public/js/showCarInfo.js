// const momentZone = require('moment-timezone');

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idCar = urlParams.get('id_car');
    getCarsInfo(idCar);
});

async function getCarsInfo(idCar) {
    try {
        const response = await fetch('/getCarByid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                id_car: idCar,
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const carData = await response.json();
        displayCars(carData);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Function to display car information on the client side
function displayCars(carData) {
    const carListContainer = document.getElementById('car-list');
    carListContainer.innerHTML = ''; // Clear previous content

    const carInfo = carData;

    const carElement = document.createElement('div');
    carElement.classList.add('car-card');

    carElement.innerHTML = `
        <h2 class="car-name">${carInfo.carname}</h2>
        <p class="car-details car-automaker"><strong>Hãng Xe:</strong> ${carInfo.automaker}</p>
        <p class="car-details car-price"><strong>Giá Xe:</strong> ${carInfo.price}</p>
        <p class="car-description">${carInfo.description}</p>
        <div class="car-owner">
            <h3 class="owner-title">Liên Hệ</h3>
            <p class="owner-details owner-name"><strong>Tên Người Đăng:</strong> ${carInfo.user_ten}</p>
           <p class="owner-details owner-phone"><strong>Số Điện Thoại:</strong> ${carInfo.user_sdt}</p>
            <p class="owner-details owner-address"><strong>Địa Chỉ:</strong> ${carInfo.user_diachi}</p>
        </div>
        <p class="car-details"><strong>Thời Gian Đăng:</strong> ${getTimeDifference(carInfo.car_created_at)}</p>
        <div class="like-dislike-container">
    <button class="like-btn">
        <span class="like-icon">&#x1F44D;</span>
        <p class="like-count">1000 Likes</p>
    </button>
    <button class="dislike-btn">
        <span class="dislike-icon">&#x1F44E;</span>
        <p class="dislike-count">100 Dislikes</p>
    </button>
</div>

    `;

    // Add images
    const carImagesContainer = document.createElement('div');
    carImagesContainer.classList.add('car-images');
    for (let i = 1; i <= 7; i++) {
        const imageSrc = carInfo[`image${i}`];
        if (imageSrc) {
            const imageElement = document.createElement('img');
            imageElement.src = imageSrc;
            imageElement.alt = `Car Image ${i}`;
            imageElement.classList.add('car-image');
            imageElement.addEventListener('click', () => {
                enlargeImage(imageSrc);
            });
            carImagesContainer.appendChild(imageElement);
        }
    }
    carElement.appendChild(carImagesContainer);

    carListContainer.appendChild(carElement);
}

// Function to enlarge image
function enlargeImage(imageSrc) {
    const enlargedImageContainer = document.createElement('div');
    enlargedImageContainer.classList.add('enlarged-image-container');

    const enlargedImage = document.createElement('img');
    enlargedImage.src = imageSrc;
    enlargedImage.alt = 'Enlarged Car Image';
    enlargedImage.classList.add('enlarged-image');

    enlargedImageContainer.appendChild(enlargedImage);

    // Append the enlarged image container to the body
    document.body.appendChild(enlargedImageContainer);

    // Add event listener to remove enlarged image when clicked outside
    // document.addEventListener('click', closeEnlargedImage.bind(null, enlargedImageContainer));
}

function closeEnlargedImage(enlargedImageContainer, event) {
    if (!enlargedImageContainer.contains(event.target)) {
        document.body.removeChild(enlargedImageContainer);
        document.removeEventListener('click', closeEnlargedImage);
    }
}
function getTimeDifference(pastTime) {
    const currentTimeVietnam = moment().tz('Asia/Ho_Chi_Minh');
    const past = moment.tz(pastTime, 'Asia/Ho_Chi_Minh');
    const diffInSeconds = currentTimeVietnam.diff(past, 'seconds');

    const secondsInAMinute = 60;
    const secondsInAnHour = 60 * secondsInAMinute;
    const secondsInADay = 24 * secondsInAnHour;
    const secondsInAWeek = 7 * secondsInADay;

    if (diffInSeconds < secondsInAMinute) {
        return `${diffInSeconds} giây trước`;
    } else if (diffInSeconds < secondsInAnHour) {
        return `${Math.floor(diffInSeconds / secondsInAMinute)} phút trước`;
    } else if (diffInSeconds < secondsInADay) {
        return `${Math.floor(diffInSeconds / secondsInAnHour)} giờ trước`;
    } else if (diffInSeconds < secondsInAWeek) {
        return `${Math.floor(diffInSeconds / secondsInADay)} ngày trước`;
    } else {
        return past.format('YYYY-MM-DD');
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