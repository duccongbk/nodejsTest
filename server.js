const express = require('express');
const app = express();
const http = require('http').createServer(app);
const socketIo = require('socket.io');
const io = socketIo(http);
const path = require('path')
const uuid = require('uuid');
const con = require('./public/js/database')
const multer = require('multer');

var bodyParser = require('body-parser')
var cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/'); // Thư mục lưu trữ ảnh
    },
    filename: function (req, file, cb) {
        cb(null, uuid.v4() + '-' + file.originalname); // Tên file duy nhất
    }
});
const upload = multer({ storage: storage });
app.get('/home', (req, res, next) => {
    res.sendFile(path.join(__dirname, './public/html/home.html'))
})
app.get('/login', (req, res, next) => {
    res.sendFile(path.join(__dirname, './public/html/login.html'))
})
app.get('/register', (req, res, next) => {
    res.sendFile(path.join(__dirname, './public/html/register.html'))
})
app.get('/addCars', (req, res, next) => {
    res.sendFile(path.join(__dirname, './public/html/addCar.html'))
})
app.get('/index', (req, res, next) => {
    res.sendFile(path.join(__dirname, './public/html/index.html'))
})
app.post('/uploadImage', upload.array('images', 10), (req, res) => {
    res.send('Hình ảnh đã được tải lên thành công.');
});


app.get('/getCars', (req, res, next) => {
    try {
        con.query(
            `SELECT * FROM car;
            `,
            function (err, result, fields) {
                if (err) {
                    console.error('Lỗi truy vấn cơ sở dữ liệu:', err.stack);
                    res.status(500).send('Đã xảy ra lỗi khi xác thực.');
                    return;
                }
                // Kiểm tra kết quả truy vấn


                if (result.length > 0) {
                    let fullResult = [];
                    for (let i = 0; i < result.length; i++) {
                        fullResult.push({ message: 'thành công', arrCars: result[i] });
                    }
                    // Gửi phản hồi với mảng đầy đủ của kết quả
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(fullResult));
                } else {
                    // Nếu không có kết quả, trả về một phản hồi trống hoặc một thông báo lỗi
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Không có kết quả lay du lieu mess cua user' }));
                }


            }
        );
    } catch (error) {
        res.status(500).json('Lỗi server')
    }

})
app.post('/addCars', upload.array('images', 7), (req, res, next) => {
    const { id_user, carname, automaker, price, description } = req.body;

    // Lấy danh sách các tệp đã tải lên
    const images = req.files;

    // Tạo câu lệnh INSERT
    const sql = `INSERT INTO car (id_car, id_user, carname, automaker, price, description, image1, image2, image3, image4, image5, image6, image7) 
                 VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Thêm các tệp đã tải lên vào câu lệnh SQL
    const values = [id_user, carname, automaker, price, description];
    for (let i = 0; i < images.length && i < 7; i++) {
        values.push(images[i].path); // Thêm đường dẫn của tệp vào mảng values
    }

    // Thực thi câu lệnh INSERT
    con.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).send('Internal server error');
        } else {
            console.log('Data inserted successfully into MySQL');
            res.status(200).send('true');
        }
    });
});

// app.post('/addCars', upload.array('images', 10), (req, res, next) => {
//     const { id_user, carname, automaker, price, description, image1, image2, image3, image4, image5, image6, image7 } = req.body;

//     // Tạo câu lệnh INSERT
//     const sql = `INSERT INTO car (id_car, id_user, carname, automaker, price, description, image1, image2, image3, image4, image5, image6, image7) 
//                  VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//     // Thực thi câu lệnh INSERT
//     con.query(sql, [id_user, carname, automaker, price, description, image1, image2, image3, image4, image5, image6, image7], (err, result) => {
//         if (err) {
//             console.error('Error inserting data into MySQL:', err);
//             res.status(500).send('Internal server error');
//         } else {
//             console.log('Data inserted successfully into MySQL');
//             res.status(200).send('Data inserted successfully');
//         }
//     });
// });
const port = 3000; // Thay thế 4000 bằng cổng mong muốn

http.listen(port, () => {
    console.log('listening on *:3000');
});
