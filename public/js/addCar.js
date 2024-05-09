const imageCount = document.getElementById('image-count');
const imageInput = document.getElementById('image');
const imageContainer = document.getElementById('imagePreview');
const carForm = document.getElementById('carForm');

let selectedImages = [];

imageInput.addEventListener('change', function (event) {
    const files = event.target.files;
    selectedImages = selectedImages.concat(Array.from(files));

    renderImages();
});

carForm.addEventListener('reset', function () {
    // Xóa toàn bộ nội dung trong imageContainer
    imageContainer.innerHTML = '';

    // Cập nhật nội dung của imageCount
    imageCount.textContent = '0 images selected';
    selectedImages = [];
});

function renderImages() {
    imageContainer.innerHTML = '';
    selectedImages.forEach((file, index) => {
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('selected-image');

        const image = document.createElement('img');
        image.src = URL.createObjectURL(file);
        image.alt = 'Selected Image';

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerText = 'x';
        deleteBtn.addEventListener('click', function () {
            selectedImages.splice(index, 1);
            renderImages();
        });

        imageWrapper.appendChild(image);
        imageWrapper.appendChild(deleteBtn);
        imageContainer.appendChild(imageWrapper);
    });

    imageCount.textContent = `${selectedImages.length} images selected`;
}

function submitForm() {
    const carnameInput = document.getElementById('carname').value.trim();
    const automakerInput = document.getElementById('automaker').value.trim();
    const priceInput = document.getElementById('price').value.trim();
    const descriptionInput = document.getElementById('description').value.trim();

    // Kiểm tra xem các trường có đều được điền đầy đủ hay không
    if (!carnameInput || !automakerInput || !priceInput || !descriptionInput || selectedImages.length === 0) {
        showAlert('Please fill in all fields and select at least one image.')
        return;
    }

    // Kiểm tra số lượng ảnh đã chọn
    if (selectedImages.length !== 7) {
        showAlert('Bạn phải tải lên đúng 7 ảnh.')
        return;
    }

    // Tạo FormData và thêm các trường dữ liệu
    const formData = new FormData();
    formData.append('id_user', '5323175a-0dd7-11ef-be51-b42e997fc79f');
    formData.append('carname', carnameInput);
    formData.append('automaker', automakerInput);
    formData.append('price', priceInput);
    formData.append('description', descriptionInput);

    // Thêm từng tệp ảnh vào FormData
    selectedImages.forEach((file, index) => {
        formData.append('images', file); // Sử dụng tên trường 'images'
    });
    formData.append('active', false);

    // Gửi yêu cầu POST đến server
    fetch('/addCars', {
        method: 'POST',
        body: formData // FormData tự động thiết lập headers
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            if (data.trim() === 'true') { // Kiểm tra nội dung của phản hồi

            } else {
                throw new Error('Unexpected response from server');
            }

            // Xử lý phản hồi thành công
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            // Xử lý lỗi
        });
    showAlert('Xe của bạn đã được hiển thị');
    resetForm();
}
function resetForm() {
    // Reset các trường input và textarea
    document.getElementById('carname').value = '';
    document.getElementById('automaker').value = '';
    document.getElementById('price').value = '';
    document.getElementById('description').value = '';

    // Xóa hình ảnh được chọn và cập nhật imageCount
    selectedImages = [];
    imageContainer.innerHTML = '';
    imageCount.textContent = '0 images selected';
}
function showAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert');
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(function () {
        document.body.removeChild(alertDiv);
    }, 2000);
}
