document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idCar = urlParams.get('id_car');

    await getCarsInfo(idCar);
    await getCommentByidCar(idCar);

    document.getElementById("form_user_comment").addEventListener('submit', (event) => {
        event.preventDefault();
        addComment(idCar);
    });

});

document.getElementById('uploadImageButton').addEventListener('click', () => {
    document.getElementById('imageUpload').click();
});

document.getElementById('imageUpload').addEventListener('change', handleFileSelect);

let selectedFiles = [];

function handleFileSelect(event) {
    const files = event.target.files;
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = ''; // Clear any existing previews

    Array.from(files).forEach((file) => {
        selectedFiles.push(file); // Add to the selectedFiles array

        const reader = new FileReader();
        reader.onload = function (e) {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('img-container');

            const img = document.createElement('img');
            img.src = e.target.result;
            img.classList.add('preview-image');

            const removeButton = document.createElement('button');
            removeButton.innerHTML = 'X';
            removeButton.classList.add('remove-button');
            removeButton.addEventListener('click', () => {
                imgContainer.remove();
                updateFileList(file); // Update file list on removal
            });

            imgContainer.appendChild(img);
            imgContainer.appendChild(removeButton);
            previewContainer.appendChild(imgContainer);
        }
        reader.readAsDataURL(file);
    });
}

function updateFileList(fileToRemove) {
    selectedFiles = selectedFiles.filter(file => file !== fileToRemove);
}

async function addComment(id_car) {
    const formData = new FormData();
    const noidung = document.getElementById('comment').value;
    const userId = 'user_id_placeholder'; // Thay thế với ID người dùng thực tế
    const currentTime = new Date().toISOString();

    formData.append('id_car', id_car);
    formData.append('noidung', noidung);
    formData.append('like_status', false);
    formData.append('created_at', currentTime);

    selectedFiles.forEach((file) => {
        formData.append('images', file);
    });

    try {
        const response = await fetch('/addComments', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        if (!response.ok) {
            document.getElementById('comment').value = '';
            const confirmResult = confirm("Bạn cần đăng nhập để tiếp tục. Bạn có muốn chuyển đến trang đăng nhập không?");
            if (confirmResult === true) {
                window.open('/login', '_blank');
            }
        } else {
            const data = await response.json();
            console.log('Comment added successfully:', data);
            document.getElementById('form_user_comment').reset();
            document.getElementById('previewContainer').innerHTML = '';
            selectedFiles = [];
            getCommentByidCar(id_car); // Refresh comments
        }
    } catch (error) {
        console.error('Error adding comment:', error);
    }
}

async function getCommentByidCar(id_car) {
    // const commentList = document.getElementById("comment_User").querySelector("ul");
    // commentList.innerHTML = ''; // Clear previous comments

    try {
        const response = await fetch('/getCommentByidCar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                id_car: id_car,
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const commentData = await response.json();
        commentData.sort((a, b) => {
            return new Date(a.comment_created_at) - new Date(b.comment_created_at);
        });

        displayComments(commentData);
        const commentContainer = document.getElementById('comment_User');
        commentContainer.lastElementChild.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

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

function displayCars(carData) {
    const carListContainer = document.getElementById('car-list');
    carListContainer.innerHTML = '';

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

function displayComments(commentdata) {
    const commentList = document.getElementById("comment_User").querySelector("ul");
    commentList.innerHTML = ''; // Clear previous comments

    commentdata.forEach(comment => {
        const li = document.createElement("li");
        li.innerHTML = `
            <p><strong>${comment.user_ten}</strong>: ${comment.noidung}</p>
            <p class="time"> at: ${getTimeDifference(comment.comment_created_at)}</p>
        `;

        if (comment.images) {
            const images = JSON.parse(comment.images);
            images.forEach(image => {
                const img = document.createElement('img');
                img.src = image.path; // Use the path from the comment data
                img.classList.add('comment-image');
                img.addEventListener('click', () => {  // Gắn sự kiện click vào ảnh
                    enlargeImage(img.src); // Sử dụng đường dẫn của ảnh khi click
                });
                li.appendChild(img);
            });
        }

        commentList.appendChild(li);
    });
}

// function toggleEnlargeImage(imageSrc) {
//     const modal = document.getElementById('modal');
//     const modalContent = document.getElementById('modal-content');
//     const modalImage = document.getElementById('modal-image');

//     if (modal.classList.contains('show')) {
//         // Nếu modal đang hiển thị, ẩn nó đi
//         modal.classList.remove('show');
//     } else {
//         // Nếu modal đang ẩn, hiển thị nó và đặt src cho hình ảnh
//         modal.classList.add('show');
//         modalImage.src = imageSrc;
//     }
// }
function getTimeDifference(timestamp) {
    const commentTime = new Date(timestamp);
    const currentTime = new Date();
    const timeDiff = currentTime - commentTime;

    const minutes = Math.floor(timeDiff / 1000 / 60);
    if (minutes < 60) {
        return `${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours} hours ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
        return `${days} days ago`;
    }

    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
        return `${weeks} weeks ago`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
        return `${months} months ago`;
    }

    const years = Math.floor(months / 12);
    return `${years} years ago`;
}

function enlargeImage(imageSrc) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;'; // Biểu tượng "X"
    closeButton.classList.add('close');
    closeButton.addEventListener('click', () => {
        modal.remove();
    });

    const img = document.createElement('img');
    img.src = imageSrc;
    img.classList.add('modal-image');

    modalContent.appendChild(closeButton);
    modalContent.appendChild(img);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Đặt chiều cao của hình ảnh là 90% của chiều cao của màn hình
    const maxHeight = window.innerHeight * 0.9;
    img.style.maxHeight = `${maxHeight}px`;

    // Canh giữa hình ảnh
    modalContent.style.display = 'flex';
    modalContent.style.justifyContent = 'center';
    modalContent.style.alignItems = 'center';
    modalContent.style.height = '100%';

    // Canh giữa modal
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';

    // Bắt sự kiện khi click vào modal để đóng modal
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.remove();
        }
    });
}

