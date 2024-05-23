const imageCount = document.getElementById('image-count');
const imageInput = document.getElementById('image');
const imageContainer = document.getElementById('imagePreview');
const carForm = document.getElementById('carForm');

let selectedImages = [];
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('automaker').addEventListener('change', updateAutomakerOptions);
    document.getElementById('price').addEventListener('input', () => formatPrice(document.getElementById('price')));
});
const namsanxuatSelect = document.getElementById('namsanxuat');

// Lấy năm hiện tại
const currentYear = new Date().getFullYear();

// Xác định phạm vi năm bạn muốn cung cấp
const startYear = currentYear - 50; // Ví dụ: từ năm 50 năm trước đến năm nay

// Tạo danh sách các năm và thêm chúng vào select element
for (let year = currentYear; year >= startYear; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.text = year;
    namsanxuatSelect.appendChild(option);
}
// Lấy thẻ select box có id là "hopso"
const hopsoSelect = document.getElementById('hopso');

// Mảng chứa các loại hộp số
const hopsoOptions = [
    'Hộp số sàn ',
    'Hộp số tự động ',
    'Hộp số kép ',
    'Hộp số vô cấp ',
    'Hộp số bán tự động ',
    'Hộp số cộng hưởng '
];

// Điền các loại hộp số vào select box
hopsoOptions.forEach(option => {
    const newOption = document.createElement('option');
    newOption.value = option;
    newOption.text = option;
    hopsoSelect.appendChild(newOption);
});
function formatPrice(input) {
    let value = input.value;

    // Remove all non-digit characters
    value = value.replace(/\D/g, '');

    // Reformat value with commas as thousand separators
    input.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Update the formatted price display
    const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // document.getElementById('formattedPrice').textContent = formattedValue ? `${formattedValue} đồngxxx` : '';

    // Update the price in words
    document.getElementById('priceInWords').textContent = value ? convertNumberToWords(value) + `  đồng` : '';
}

function convertNumberToWords(number) {
    const units = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
    const teens = ["mười", "mười một", "mười hai", "mười ba", "mười bốn", "mười lăm", "mười sáu", "mười bảy", "mười tám", "mười chín"];
    const tens = ["", "", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];
    const scales = ["", "nghìn", "triệu", "tỷ"];

    number = parseInt(number);
    if (number === 0) return "không";

    let words = [];
    let scaleIndex = 0;

    while (number > 0) {
        let chunk = number % 1000;
        if (chunk) {
            let chunkWords = [];
            let hundreds = Math.floor(chunk / 100);
            if (hundreds) {
                chunkWords.push(units[hundreds]);
                chunkWords.push("trăm");
            }

            let remainder = chunk % 100;
            if (remainder) {
                if (remainder < 20) {
                    chunkWords.push(teens[remainder - 10] || units[remainder]);
                } else {
                    let tensUnit = Math.floor(remainder / 10);
                    chunkWords.push(tens[tensUnit]);
                    let unit = remainder % 10;
                    if (unit) chunkWords.push(units[unit]);
                }
            }

            words = chunkWords.concat(scales[scaleIndex], words);
        }

        number = Math.floor(number / 1000);
        scaleIndex++;
    }

    return words.join(" ");
}
function updateAutomakerOptions() {
    const carname = document.getElementById('carname');
    const automakerSelect = document.getElementById('automaker').value;

    // Clear current options
    carname.innerHTML = '<option value="">Chọn Tên Xe</option>';

    // Define automaker options based on carname selection
    let options = [];
    if (automakerSelect === 'Honda') {
        options = ['Honda CR-V', 'Honda City', 'Honda Jazz', 'Honda Civic', 'Honda Accord', 'Honda HR-V', 'Honda Fit', 'Honda Pilot', 'Honda Odyssey', 'Honda Ridgeline', 'Khác'];
    } else if (automakerSelect === 'Toyota') {
        options = ['Toyota Corolla', 'Toyota Camry', 'Toyota RAV4', 'Toyota Highlander', 'Toyota Tacoma', 'Toyota Prius', 'Toyota Sienna', 'Toyota Tundra', 'Toyota 4Runner', 'Toyota Avalon', 'Khác'];
    } else if (automakerSelect === 'Ford') {
        options = ['Ford F-150', 'Ford Mustang', 'Ford Explorer', 'Ford Escape', 'Ford Ranger', 'Ford Fusion', 'Ford Edge', 'Ford Expedition', 'Ford Focus', 'Ford Bronco', 'Khác'];
    }


    // Add new options to automaker select element
    options.forEach(option => {
        const newOption = document.createElement('option');
        newOption.value = option;
        newOption.text = option;
        carname.appendChild(newOption);
    });
}

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
    const priceWithoutComma = priceInput.replace(/,/g, '');

    // Chuyển đổi thành số
    const priceNumber = parseFloat(priceWithoutComma);

    // Làm tròn đến hai chữ số sau dấu thập phân và chuyển thành chuỗi
    const formattedPrice = priceNumber.toFixed(2);
    // Kiểm tra số lượng ảnh đã chọn
    if (selectedImages.length !== 7) {
        showAlert('Bạn phải tải lên đúng 7 ảnh.')
        return;
    }

    // Tạo FormData và thêm các trường dữ liệu
    const formData = new FormData();
    // formData.append('id_user', 'a5a9c3b7-1747-11ef-85ae-b42e997fc79f');
    formData.append('carname', carnameInput);
    formData.append('automaker', automakerInput);
    formData.append('price', formattedPrice);
    formData.append('description', descriptionInput);

    // Thêm từng tệp ảnh vào FormData
    selectedImages.forEach((file, index) => {
        formData.append('images', file); // Sử dụng tên trường 'images'
    });
    formData.append('active', false);

    // Gửi yêu cầu POST đến server
    fetch('/addCars', {
        method: 'POST',
        body: formData,
        credentials: 'include'// FormData tự động thiết lập headers
    })
        .then(response => {
            if (!response.ok) {
                const confirmResult = confirm("Bạn cần đăng nhập để tiếp tục. Bạn có muốn chuyển đến trang đăng nhập không?");
                if (confirmResult === true) {
                    // Nếu người dùng chọn Yes, chuyển đến trang đăng nhập
                    window.open('/login', '_blank');
                } else {

                }
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            if (data = true) { // Kiểm tra nội dung của phản hồi
                showAlert('Xe của bạn đã được hiển thị');
                // resetForm();
            } else {
                throw new Error('Unexpected response from server');
            }

            // Xử lý phản hồi thành công
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            // Xử lý lỗi
        });

}
function resetForm() {
    // Reset các trường input và textarea
    document.getElementById('carname').value = '';
    document.getElementById('automaker').value = '';
    document.getElementById('price').value = '';
    document.getElementById('description').value = '';
    document.getElementById('priceInWords').value = '';
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
