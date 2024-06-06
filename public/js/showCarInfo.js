

// Load pre-trained model

// Run the example
// runExample();

document.addEventListener("DOMContentLoaded", async () => {
    var images = [];
    const urlParams = new URLSearchParams(window.location.search);
    const idCar = urlParams.get('id_car');
    const id_comment = null;
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
            if (data) {
                console.log('Comment added successfully:', data);
                document.getElementById('form_user_comment').reset();
                document.getElementById('previewContainer').innerHTML = '';
                selectedFiles = [];
                getCommentByidCar(id_car); // Refresh comments
            } else { }

        }
    } catch (error) {
        console.error('Error adding comment:', error);
    }
}

async function getCommentByidCar(id_car) {
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
        setTimeout(() => {
            const commentContainer = document.getElementById('comment_User');
            commentContainer.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100); // Thời gian chờ có thể điều chỉnh tùy ý
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
        return carData;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
function displayCars(carData) {
    const carListContainer = document.getElementById('car-list');
    carListContainer.innerHTML = '';

    const carInfo = carData;
    const imagesarr = [];

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
        imagesarr.push(imageSrc);
        if (imageSrc) {
            const imageElement = document.createElement('img');
            imageElement.src = imageSrc;
            imageElement.alt = `Car Image ${i}`;
            imageElement.classList.add('car-image');
            imageElement.addEventListener('click', () => {
                console.log(i);
                console.log(carInfo[`image${i}`]);
                enlargeImage(imageSrc, imagesarr, i);
            });
            carImagesContainer.appendChild(imageElement);
        }
    }
    carElement.appendChild(carImagesContainer);

    carListContainer.appendChild(carElement);
}
async function insertReplycomment(id_comment, likecomment, noidung) {
    try {
        const response = await fetch('/insertReplycomment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                id_comment: id_comment,
                likecomment: likecomment,
                noidung: noidung
            })
        });

        if (!response.ok) {
            const confirmResult = confirm("Bạn cần đăng nhập để tiếp tục. Bạn có muốn chuyển đến trang đăng nhập không?");
            if (confirmResult === true) {
                window.open('/login', '_blank');
            }
            throw new Error('Network response was not ok');
        } else {
            const data = await response.json();
            if (data) {
                window.location.reload();
                // alert("Reply comment inserted successfully");
                // getCommentByidCar(id_car).then(() => {
                //     const commentContainer = document.getElementById('comment_User');
                //     commentContainer.lastElementChild.scrollIntoView({ behavior: 'smooth' });
                // });
                // const inputElement = document.querySelector(`.reply-text[data-id="${id_comment}"]`);
                // if (inputElement) {
                //     inputElement.value = '';
                // }
            } else {
                // Xử lý trường hợp khi không có dữ liệu hoặc có lỗi xảy ra
            }


        }
        // Handle success response as needed
    } catch (error) {
        console.error('Error inserting reply comment:', error);
        // Handle error as needed
    }
}
function displayComments(commentdata) {

    const commentList = document.getElementById("comment_User").querySelector("ul");
    commentList.innerHTML = ''; // Clear previous comments
    commentdata.forEach(comment => {
        const li = document.createElement("li");
        li.innerHTML = `
            <p><strong>${comment.user_ten}</strong>: ${comment.comment_content}</p>
            <p class="time"> at: ${getTimeDifference(comment.comment_created_at)}</p>
            <div class="comment-buttons">
                <button class="like-btn">Like</button>
                <button class="dislike-btn">Dislike</button>
            </div>
            <div class="reply-input" style="display: none;">
                <input type="text" class="reply-text" name="replyText-${comment.id_comment}" placeholder="Enter your reply..."  data-id="${comment.id_comment}">
                <button class="reply-submit-btn" onclick="handleReplySubmit('${comment.id_comment.toString()}')">Reply</button>
            </div>
        `;
        // Thêm danh sách phản hồi vào bình luận hiện tại
        if (comment.comment_images) {
            const images = JSON.parse(comment.comment_images);
            const imagearr = [];
            // console.log(images);
            images.forEach((image, index) => {
                const img = document.createElement('img');
                img.src = image.path; // Use the path from the comment data
                imagearr.push(img.src);
                img.classList.add('comment-image');
                img.addEventListener('click', () => {  // Gắn sự kiện click vào ảnh
                    console.log(index);
                    enlargeImage(img.src, imagearr, index); // Sử dụng đường dẫn của ảnh khi click
                });
                li.appendChild(img);
            });
        }
        const replyList = document.createElement("ul");
        replyList.classList.add("reply-list");
        comment.reply_comments.forEach(reply => {
            if (reply.id_reply) {
                const replyLi = document.createElement("li");
                replyLi.innerHTML = `
                <p><strong>${reply.reply_user_ten}</strong>: ${reply.reply_content}</p>
                <p class="time"> at: ${getTimeDifference(reply.reply_created_at)}</p>
                <div class="reply-buttons">
                    <button class="like-btn">Like</button>
                    <button class="dislike-btn">Dislike</button>
                </div>`;
                replyList.appendChild(replyLi);
            }

        });
        li.appendChild(replyList);
        li.addEventListener('click', (event) => {
            event.preventDefault();
            const replyInput = li.querySelector('.reply-input');
            if (replyInput) {
                if (replyInput.style.display === 'block') {
                    // replyInput.style.display = 'none';
                } else {
                    replyInput.style.display = 'block';
                }
            }
        });
        commentList.appendChild(li);
    });
}
function handleReplySubmit(commentId) {
    const replyInput = document.querySelector(`.reply-text[data-id="${commentId}"]`);
    if (replyInput.value.trim() !== '') { // Kiểm tra xem input có rỗng hay không
        const replyText = replyInput.value;
        insertReplycomment(commentId, null, replyText);
        // Sau khi phản hồi đã được gửi đi và comment mới đã được thêm vào, cuộn sẽ di chuyển xuống dưới cùng của phần tử chứa các comment
        const commentContainer = document.getElementById('comment_User');
        commentContainer.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else {
        alert("Không được để trống");
    }
}

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

function enlargeImage(imageSrc, images, currentIndex) {
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

    const zoomButton = document.createElement('span');
    zoomButton.innerHTML = '+'; // Biểu tượng "+"
    zoomButton.classList.add('zoom'); 0
    let currentScale = 1; // Giá trị ban đầu của scale

    zoomButton.addEventListener('click', () => {
        currentScale += 0.25; // Tăng giá trị scale lên 0.5 mỗi lần click
        img.style.transform = `scale(${currentScale})`;
    });

    const prevButton = document.createElement('span');
    prevButton.innerHTML = '&#9664;'; // Biểu tượng mũi tên trái
    prevButton.classList.add('prev');
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            img.src = images[currentIndex];
            currentScale = 1; // Đặt lại scale khi chuyển hình
            img.style.transform = `scale(${currentScale})`;
        }
    });

    const nextButton = document.createElement('span');
    nextButton.innerHTML = '&#9654;'; // Biểu tượng mũi tên phải
    nextButton.classList.add('next');
    nextButton.addEventListener('click', () => {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            img.src = images[currentIndex];
            currentScale = 1; // Đặt lại scale khi chuyển hình
            img.style.transform = `scale(${currentScale})`;
        }
    });
    const img = document.createElement('img');
    img.src = imageSrc;
    img.classList.add('modal-image');

    modalContent.appendChild(closeButton);
    modalContent.appendChild(zoomButton);
    modalContent.appendChild(prevButton);
    modalContent.appendChild(nextButton);
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

async function loadModel() {
    const model = tf.sequential();
    return model;
}
// Perform Super-Resolution
async function tangChatluonganh(imagePath, model) {
    // Read input image
    const inputImage = await fetch(imagePath);
    const blob = await inputImage.blob();
    const file = new File([blob], "filename");

    // Preprocess input image (convert to tensor, normalize, etc.)
    const inputTensor = tf.node.decodeImage(await file.arrayBuffer());

    // Perform super-resolution inference
    const outputTensor = model.predict(inputTensor);

    // Convert output tensor to image buffer
    const outputImageBuffer = await tf.node.encodeJpeg(outputTensor);

    return outputImageBuffer;
}

// Example usage
async function runExample(inputImagePath) {
    // Load pre-trained model
    const model = await loadModel();

    // Define function to increase image quality
    tangChatluonganh = async (imagePath) => {
        const outputImageBuffer = await superResolution(imagePath, model);
        return outputImageBuffer;
    };

    // Use the function to increase quality of an image
    // const inputImagePath = 'path/to/input/image.jpg';
    const newImageBuffer = await tangChatluonganh(inputImagePath);

    // Save the new image
    // fs.writeFileSync('path/to/output/newimage.jpg', newImageBuffer);

    // console.log('Image quality enhancement completed.');
    return newImageBuffer;
}

