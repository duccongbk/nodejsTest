import { fetchActions } from './allActions.js';

class BaseTable {
    constructor() {
        this._headers = [];
    }
    set headers(newHeaders) {
        this._headers = newHeaders;
    }

    // Getter cho thuộc tính headers
    get headers() {
        return this._headers;
    }
    async createDataRow(entry, index) {
        const row = document.createElement('tr');
        row.classList.add('data-row'); // Thêm lớp cho hàng dữ liệu

        Object.values(entry).forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            cell.classList.add('data-cell'); // Thêm lớp cho ô dữ liệu
            row.appendChild(cell);
        });

        return row;
    }

    async display(data, currentPage, resultsPerPage, headers) {
        // console.log(data.length);
        const slproducts = document.getElementById('slproducts');
        slproducts.textContent = "Có : " + data.length + " Results";
        const tableContainer = document.getElementById('userTable');
        tableContainer.style.display = 'table';
        tableContainer.innerHTML = '';

        const table = document.createElement('table');
        table.classList.add('custom-table');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.classList.add('header-row');
        if (headers) {
            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                th.classList.add('header-cell');
                headerRow.appendChild(th);
            });
        }

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        const startIndex = (currentPage - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        const paginatedData = data.slice(startIndex, endIndex);
        for (let i = 0; i < paginatedData.length; i++) {
            const row = await this.createDataRow(paginatedData[i], i + startIndex, data, currentPage, resultsPerPage);
            tbody.appendChild(row);
        }
        table.appendChild(tbody);
        tableContainer.appendChild(table);

        const contentContainer = document.getElementById('content-all');
        let paginationContainer = contentContainer.querySelector('.pagination');

        if (paginationContainer) {
            paginationContainer.innerHTML = '';
        } else {
            paginationContainer = document.createElement('div');
            paginationContainer.classList.add('pagination');
            contentContainer.appendChild(paginationContainer);
        }

        const totalPages = Math.ceil(data.length / resultsPerPage);

        if (totalPages > 1) {
            const firstButton = document.createElement('button');
            firstButton.textContent = 'First';
            firstButton.classList.add('pagination-button');
            firstButton.addEventListener('click', () => {
                this.display(data, 1, resultsPerPage, headers);
            });
            paginationContainer.appendChild(firstButton);

            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.classList.add('pagination-button');
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    this.display(data, currentPage - 1, resultsPerPage, headers);
                }
            });
            paginationContainer.appendChild(prevButton);

            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i;
                pageButton.classList.add('pagination-button');
                if (i === currentPage) {
                    pageButton.classList.add('current-page');
                }
                pageButton.addEventListener('click', () => {
                    this.display(data, i, resultsPerPage, headers);
                });
                paginationContainer.appendChild(pageButton);
            }

            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.classList.add('pagination-button');
            nextButton.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    this.display(data, currentPage + 1, resultsPerPage, headers);
                }
            });
            paginationContainer.appendChild(nextButton);

            const lastButton = document.createElement('button');
            lastButton.textContent = 'Last';
            lastButton.classList.add('pagination-button');
            lastButton.addEventListener('click', () => {
                this.display(data, totalPages, resultsPerPage, headers);
            });
            paginationContainer.appendChild(lastButton);
        }
    }


    async search(data, typename, currentPage, resultsPerPage) {
        try {
            // Kiểm tra xem data có được định nghĩa không
            if (!data || !data.length) {
                console.error('Data is undefined or empty.');
                return;
            }

            // Ghi đè trong các lớp con
            const searchData = this.filterData(data, typename);


            await this.display(searchData, currentPage, resultsPerPage, this.headers);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Phương thức lọc dữ liệu, sẽ được ghi đè trong các lớp con
    filterData(data, typename) {
        return data.filter(item => {
            // Mặc định, không thực hiện bất kỳ lọc nào, để ghi đè trong các lớp con
            return true;
        });
    }

    async fetchData(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            throw error;
        }
    }
}

export class UserTable extends BaseTable {
    constructor() {
        super();
        this.headers = ['STT', 'Tên', 'Số điện thoại', 'Địa chỉ', 'Ngày đăng ký', 'Tùy Chỉnh'];
    }
    // filterData(data, typename) {
    //     return data.filter(item => {
    //         // Kiểm tra và lọc dữ liệu cho UserTable
    //         return item.arrusers && item.arrusers.ten.toLowerCase().includes(typename.toLowerCase());
    //     });
    // }
    filterData(data, typename) {
        return data.filter(item => {
            // Kiểm tra xem item.arrCars có tồn tại không
            if (item.arrusers) {
                // Duyệt qua tất cả các trường của đối tượng arrCars
                for (const key in item.arrusers) {
                    // Kiểm tra nếu giá trị của trường là một chuỗi và chứa từ khóa tìm kiếm
                    if (typeof item.arrusers[key] === 'string' && item.arrusers[key].toLowerCase().includes(typename.toLowerCase())) {
                        return true; // Trả về true nếu có bất kỳ trường nào thỏa mãn điều kiện
                    }
                }
            }
            return false; // Trả về false nếu không có trường nào thỏa mãn điều kiện
        });
    }
    async createDataRow(entry, index) {
        const row = document.createElement('tr');
        row.classList.add('data-row-user'); // Thêm lớp cho hàng dữ liệu của UserTable
        const dataToDisplay = {
            "STT": index + 1,
            "Tên": entry.arrusers.ten,
            "Số điện thoại": entry.arrusers.sdt,
            "Địa chỉ": entry.arrusers.diachi,
            "Ngày đăng ký": new Date(entry.arrusers.created_at).toLocaleDateString() // Chuyển đổi ngày thành chuỗi định dạng ngày/tháng/năm
        };
        Object.values(dataToDisplay).forEach(value => {

            const cell = document.createElement('td');
            cell.textContent = value;
            cell.classList.add('data-cell-user'); // Thêm lớp cho ô dữ liệu của UserTable
            row.appendChild(cell);
        });
        const button = document.createElement('button');
        button.textContent = 'Action'; // Set the button text
        button.classList.add('action-button'); // Add class for the button

        // Add event listener for the button (if needed)
        button.addEventListener('click', () => {
            console.log(`Button clicked for user: ${entry.arrusers.id_user}`);
            // Add your custom action here
        });

        // Create a cell for the button and append the button to it
        const buttonCell = document.createElement('td');
        buttonCell.appendChild(button);
        row.appendChild(buttonCell);
        return row;
    }

    async fetchDataAndDisplay(data, currentPage, resultsPerPage) {
        try {
            // const headers = ['STT', 'Tên', 'Số điện thoại', 'Địa chỉ', 'Ngày đăng ký', 'Tùy Chỉnh'];
            await super.display(data, currentPage, resultsPerPage, this.headers);
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

export class CarTable extends BaseTable {
    constructor() {
        super();
        this.headers = ['STT', 'Tên', 'Số điện thoại', 'Địa chỉ', 'Tên Xe', 'Hãng Xe', 'Giá Xe', 'Ngày Đăng', 'Trạng Thái'];
    }
    filterData(data, typename) {
        return data.filter(item => {
            // Kiểm tra xem item.arrCars có tồn tại không
            if (item.arrCars) {
                // Duyệt qua tất cả các trường của đối tượng arrCars
                for (const key in item.arrCars) {
                    // Kiểm tra nếu giá trị của trường là một chuỗi và chứa từ khóa tìm kiếm
                    if (typeof item.arrCars[key] === 'string' && item.arrCars[key].toLowerCase().includes(typename.toLowerCase())) {
                        return true; // Trả về true nếu có bất kỳ trường nào thỏa mãn điều kiện
                    }
                }
            }
            return false; // Trả về false nếu không có trường nào thỏa mãn điều kiện
        });
    }

    async createDataRow(entry, index, data, currentPage, resultsPerPage) {
        const row = document.createElement('tr');
        row.classList.add('data-row-car'); // Thêm lớp cho hàng dữ liệu của CarTable
        row.addEventListener('click', () => {
            // Bỏ lớp highlighted từ tất cả các hàng
            document.querySelectorAll('.highlighted').forEach(row => {
                row.classList.remove('highlighted');
            });

            // Thêm lớp highlighted vào hàng được click
            row.classList.add('highlighted');
        });
        const dataToDisplay = {
            "STT": index + 1,
            "Tên": entry.arrCars.user_ten,
            "Sđt": entry.arrCars.user_sdt,
            "Địa Chỉ": entry.arrCars.user_diachi,
            "Tên Xe": entry.arrCars.carname,
            "Hãng Xe": entry.arrCars.automaker,
            "GIá Xe": entry.arrCars.price,
            "Ngày Đăng": new Date(entry.arrCars.car_created_at).toLocaleDateString()
        };

        Object.entries(dataToDisplay).forEach(([key, value]) => {
            const cell = document.createElement('td');
            cell.textContent = value;
            cell.classList.add('data-cell-car'); // Thêm lớp cho ô dữ liệu của CarTable
            cell.addEventListener('click', () => {
                window.open(`/showCarInfo?id_car=${entry.arrCars.id_car.toString()}`, '_blank');
                // Hoặc thực hiện hành động khác bạn muốn tại đây
            });

            row.appendChild(cell);
        });

        // Create the <select> element
        const select = document.createElement('select');
        select.id = 'activeDropdown';
        select.classList.add('activeDropdown');
        select.addEventListener('change', () => {
            new fetchActions().editUserCar(entry.arrCars.id_car.toString(), select.value);
        });

        // Add options to the <select>
        const options = [
            { value: 'active', text: 'Active', color: 'green', selected: entry.arrCars.active === 'active' },
            { value: 'inactive', text: 'Inactive', color: 'red', selected: entry.arrCars.active === 'inactive' },
            { value: 'null', text: 'Null', color: 'red', selected: entry.arrCars.active === 'null' },
            { value: 'block', text: 'Block', color: 'red', selected: entry.arrCars.active === 'block' }
        ];

        options.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.value;
            option.textContent = optionData.text;
            option.style.color = optionData.color;
            if (optionData.selected) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        // Append the <select> to the row
        const selectCell = document.createElement('td');
        selectCell.appendChild(select);
        row.appendChild(selectCell);
        const button = document.createElement('button');
        button.textContent = 'Delete'; // Set the button text
        button.classList.add('action-button'); // Add class for the button

        // Add event listener for the button (if needed)
        button.addEventListener('click', () => {
            new fetchActions().deleteCar(entry.arrCars.id_car.toString());
            const updatedData = data.filter(item => item.arrCars.id_car !== entry.arrCars.id_car);
            // Update the display
            this.display(updatedData, currentPage, resultsPerPage, this.headers);
            // Add your custom action here
        });

        // Create a cell for the button and append the button to it
        const buttonCell = document.createElement('td');
        buttonCell.appendChild(button);
        row.appendChild(buttonCell);
        return row;
    }


    async fetchDataAndDisplay(data, currentPage, resultsPerPage) {
        try {
            // const headers = ['STT', 'Tên', 'Số điện thoại', 'Địa chỉ', 'Tên Xe', 'Hãng Xe', 'Giá Xe', 'Ngày Đăng', 'Trạng Thái'];
            await super.display(data, currentPage, resultsPerPage, this.headers);

        } catch (error) {
            console.error('Error:', error);
        }
    }
}
