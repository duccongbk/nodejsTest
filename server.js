const express = require('express');
const app = express();
const http = require('http').createServer(app);
const socketIo = require('socket.io');
const io = socketIo(http);
const path = require('path')
const uuid = require('uuid');
const con = require('./public/js/database')
const multer = require('multer');
const moment = require('moment');
const momentZone = require('moment-timezone');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const adminRouter = express.Router();
const connect = require('connect');
const crypto = require('crypto');
require('dotenv').config();

const createdAt = new Date(); // Giả sử bạn có giá trị createdAt từ cơ sở dữ liệu
app.use(cookieParser());

const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
const currentTimeVietnam = momentZone().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
const secretKey = process.env.secretKey;
const secretKeyUser = process.env.SECRET_KEY;
const algorithm = 'aes-256-cbc'; // Thuật toán mã hóa
const iv = crypto.randomBytes(16); // Vector khởi tạo
var bodyParser = require('body-parser')
var cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use('/public', express.static(path.join(__dirname, 'public')))
adminRouter.use('/public', express.static(path.join(__dirname, 'public')))
adminRouter.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// app.use((req, res, next) => {
//     console.log('Cookies received:', req.headers.cookie);
//     next();
// });
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use((req, res, next) => {
    if (req.hostname === 'admin.localhost') {
        adminRouter(req, res, next);
    } else {
        next();
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/'); // Thư mục lưu trữ ảnh
    },
    filename: function (req, file, cb) {
        cb(null, uuid.v4() + '-' + file.originalname); // Tên file duy nhất
    }
});
const storageImageComment = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/imagesComments/'); // Thư mục lưu trữ ảnh
    },
    filename: function (req, file, cb) {
        cb(null, uuid.v4() + '-' + file.originalname); // Tên file duy nhất
    }
});

const upload = multer({ storage: storage });
const uploadImagesComment = multer({ storage: storageImageComment });
app.get('/home', (req, res, next) => {
    res.sendFile(path.join(__dirname, './public/html/home.html'))
})
app.get('/login', (req, res, next) => {
    res.sendFile(path.join(__dirname, './public/html/login.html'))
})
app.get('/showCar', (req, res, next) => {
    res.sendFile(path.join(__dirname, './public/html/showCar.html'))
})
app.get('/register', (req, res, next) => {
    res.sendFile(path.join(__dirname, './public/html/register.html'))
})
app.get('/addCars', (req, res, next) => {
    res.sendFile(path.join(__dirname, './public/html/addCar.html'))
})
app.get('/test', (req, res, next) => {
    res.sendFile(path.join(__dirname, './public/html/test.html'))
})
app.get('/index', (req, res, next) => {
    res.sendFile(path.join(__dirname, './public/html/index.html'))
})
app.get('/editUser_Car', (req, res, next) => {
    res.sendFile(path.join(__dirname, './public/html/editUser_Car.html'))
})
app.get('/showCarInfo', (req, res, next) => {
    res.sendFile(path.join(__dirname, './public/html/showCarInfo.html'))
})
app.post('/uploadImage', upload.array('images', 10), (req, res) => {
    res.send('Hình ảnh đã được tải lên thành công.');
});
app.get('/api', (req, res) => {
    // Xử lý yêu cầu và gửi phản hồi
    res.json({ message: 'Data received successfully!' });
});
adminRouter.get('/v1', (req, res) => {
    res.sendFile(path.join(__dirname, './public/html/admin.html'))
});
app.put('/updateUser', (req, res, next) => {
    const { id_user, ten, sdt } = req.body;

    // Thực hiện câu lệnh update trong cơ sở dữ liệu
    con.query(
        `UPDATE users SET ten = ?, sdt = ? WHERE id_user = ?`,
        [ten, sdt, id_user],
        (err, result) => {
            if (err) {
                console.error('Error updating user data in MySQL:', err);
                res.status(500).send('Internal server error');
            } else {
                console.log('User data updated successfully in MySQL');
                res.status(200).send('true');
            }
        }
    );
});
app.put('/updateCar', (req, res, next) => {
    const { id_car, active } = req.body;

    // Thực hiện câu lệnh update trong cơ sở dữ liệu
    con.query(
        `UPDATE car SET active = ? WHERE id_car = ?`,
        [active, id_car],
        (err, result) => {
            if (err) {
                console.error('Error updating user data in MySQL:', err);
                res.status(500).send('Internal server error');
            } else {
                console.log('User data updated successfully in MySQL');
                res.status(200).send('true');
            }
        }
    );
});
app.delete('/deleteUser', (req, res, next) => {
    const id_user = req.body.id_user;

    // Thực hiện câu lệnh xóa trong cơ sở dữ liệu
    con.query(
        `DELETE FROM users WHERE id_user = ?`,
        [id_user],
        (err, result) => {
            if (err) {
                console.error('Error deleting user data in MySQL:', err);
                res.status(500).send('Internal server error');
            } else {
                console.log('User data deleted successfully in MySQL');
                res.status(200).send('true');
            }
        }
    );
});
app.delete('/deleteCar', (req, res, next) => {
    const id_car = req.body.id_car;

    // Thực hiện câu lệnh xóa trong cơ sở dữ liệu
    con.query(
        `DELETE FROM car WHERE id_car = ?`,
        [id_car],
        (err, result) => {
            if (err) {
                console.error('Error deleting user data in MySQL:', err);
                res.status(500).send('Internal server error');
            } else {
                console.log('User data deleted successfully in MySQL');
                res.status(200).send('true');
            }
        }
    );
});
app.post('/addUsers', (req, res, next) => {
    const { ten, sdt, pass, diachi } = req.body;

    // Kiểm tra nếu số điện thoại đã tồn tại trong cơ sở dữ liệu
    con.query(
        `SELECT * FROM users WHERE sdt = ?`,
        [sdt],
        (err, result) => {
            if (err) {
                console.error('Error checking phone number in MySQL:', err);
                res.status(500).send('Internal server error');
                return;
            }

            if (result.length > 0) {
                // Nếu số điện thoại đã tồn tại, gửi thông báo về client
                res.status(200).send('phonetrue');
            } else {
                // Nếu số điện thoại không tồn tại, thêm người dùng vào cơ sở dữ liệu
                const currentTimeVietnam = momentZone().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');

                const sql = `INSERT INTO users (id_user, ten, sdt, pass, diachi, created_at)  
                             VALUES (UUID(), ?, ?, ?, ?, ?)`;

                const values = [ten, sdt, pass, diachi, currentTimeVietnam];

                con.query(sql, values, (err, result) => {
                    if (err) {
                        console.error('Error inserting data into MySQL:', err);
                        res.status(500).send('Internal server error');
                    } else {
                        console.log('Data inserted successfully into MySQL');
                        res.status(200).send('true');
                    }
                });
            }
        }
    );
});
app.post('/Login', (req, res, next) => {
    const { sdt, pass } = req.body;

    // Kiểm tra nếu số điện thoại và mật khẩu đúng
    con.query(
        `SELECT * FROM users WHERE sdt = ? AND pass = ?`,
        [sdt, pass],
        (err, result) => {
            if (err) {
                console.error('Error checking phone number and password in MySQL:', err);
                res.status(500).send('Internal server error');
                return;
            }
            if (result.length > 0) {
                // Nếu tìm thấy người dùng với số điện thoại và mật khẩu khớp, gửi thông tin người dùng về client
                const user = result[0];
                const expiresIn = 1000;
                const token = jwt.sign({ id: user.id_user }, secretKey, { expiresIn: expiresIn });
                const expirationDate = new Date(Date.now() + expiresIn * 1000);
                res.cookie('jwt', token, { httpOnly: true, expires: expirationDate });
                res.status(200).json({ token: token }); // 
            } else {
                // Nếu không tìm thấy người dùng với số điện thoại và mật khẩu tương ứng, trả về thông báo lỗi
                res.status(401).send('Số điện thoại hoặc mật khẩu không chính xác');
            }
        }
    );
});

// Middleware để xác thực token
function encryptData(data, secretKeyUser, iv) {
    // Tạo một đối tượng Cipher với thuật toán AES-256-CBC và secret key
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKeyUser), iv);

    // Mã hóa dữ liệu
    let encryptedData = cipher.update(data, 'utf-8', 'hex');
    encryptedData += cipher.final('hex');

    return encryptedData;
}


// Hàm giải mã dữ liệu
// function decryptData(encryptedData) {
//     const decipher = crypto.createDecipher('aes-256-cbc', secretKeyUser);
//     let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
//     decryptedData += decipher.final('utf8');
//     return decryptedData;
// }
function authenticateToken(req, res, next) {
    const token = req.cookies.jwt; // Lấy token từ cookie, đảm bảo tên của cookie là 'jwt'
    console.log(token);
    // Nếu không có token, trả về lỗi 401 Unauthorized
    if (token == null) {
        return res.status(401).send('Unauthorized: No token provided');
    }

    // Xác thực token
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).send('Forbidden: Invalid token')
                .set('Location', '/login') // Đặt tiêu đề Location cho chuyển hướng
                .send('Forbidden: Invalid token');
        }
        req.user = user; // Lưu thông tin user vào đối tượng req để sử dụng sau này
        next(); // Tiếp tục xử lý yêu cầu nếu token hợp lệ
    });
}

function decryptData(encryptedData, secretKey, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), Buffer.from(iv));
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
}
app.post('/searchUsers', (req, res) => {
    const username = req.body.username; // Lấy từ khóa tìm kiếm từ yêu cầu POST

    // Thực hiện truy vấn SQL để tìm kiếm người dùng với tên chứa từ khóa tìm kiếm
    const sqlQuery = `SELECT * FROM users WHERE ten LIKE '%${username}%'`;

    // Thực hiện truy vấn SQL và gửi kết quả về cho máy khách
    con.query(sqlQuery, (error, results) => {
        if (error) {
            res.status(500).send('Lỗi khi truy vấn cơ sở dữ liệu');
        } else {
            if (results.length > 0) {
                let fullResult = [];
                for (let i = 0; i < results.length; i++) {
                    fullResult.push({ message: 'thành công', arrusers: results[i] });
                }
                const dataToEncrypt = JSON.stringify(fullResult);
                const encryptedData = encryptData(dataToEncrypt, secretKeyUser, iv);
                const decryptedData = decryptData(encryptedData, secretKeyUser, iv);

                // Gửi phản hồi với mảng đầy đủ của kết quả
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(JSON.parse(decryptedData)));
            } else {
                // Nếu không có kết quả, trả về một phản hồi trống hoặc một thông báo lỗi
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Không có kết quả lay du lieu mess cua user' }));
            }
        }
    });
});
app.post('/getUserByid', (req, res, next) => {
    const userId = req.body.id_user; // Lấy ID của người dùng từ token
    console.log(userId);
    // Thực hiện truy vấn để lấy thông tin người dùng từ cơ sở dữ liệu
    con.query(
        `SELECT * FROM users WHERE id_user = '${userId}'`,
        [userId],
        (err, result) => {
            if (err) {
                console.error('Error fetching user data from database:', err);
                res.status(500).send('Internal server error');
                return;
            }

            // Kiểm tra xem có dữ liệu người dùng hay không
            if (result.length > 0) {
                // Nếu có dữ liệu, gửi thông tin người dùng về client dưới dạng JSON
                const userData = result[0];
                res.json(userData);
            } else {
                // Nếu không tìm thấy người dùng, gửi thông báo lỗi về client
                console.log("khong tim thay user");
                res.status(404).send('User not found');
            }
        }
    );
});
// Route cần xác thực token
app.get('/protected', authenticateToken, (req, res) => {
    const userId = req.user.id; // Lấy ID của người dùng từ token
    console.log(userId);
    // Thực hiện truy vấn để lấy thông tin người dùng từ cơ sở dữ liệu
    con.query(
        `SELECT * FROM users WHERE id_user = ?`,
        [userId],
        (err, result) => {
            if (err) {
                console.error('Error fetching user data from database:', err);
                res.status(500).send('Internal server error');
                return;
            }

            // Kiểm tra xem có dữ liệu người dùng hay không
            if (result.length > 0) {
                // Nếu có dữ liệu, gửi thông tin người dùng về client dưới dạng JSON
                const userData = result[0];
                res.json(userData);
            } else {
                // Nếu không tìm thấy người dùng, gửi thông báo lỗi về client
                console.log("khogn tim thay user");
                res.status(404).send('User not found');
            }
        }
    );
});
app.get('/getUsers', (req, res, next) => {
    try {
        con.query(

            `SELECT * FROM users;
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
                        fullResult.push({ message: 'thành công', arrusers: result[i] });
                    }
                    const dataToEncrypt = JSON.stringify(fullResult);
                    const encryptedData = encryptData(dataToEncrypt, secretKeyUser, iv);
                    const decryptedData = decryptData(encryptedData, secretKeyUser, iv);

                    // Gửi phản hồi với mảng đầy đủ của kết quả
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(JSON.parse(decryptedData)));
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
app.get('/getCars', (req, res, next) => {
    try {
        con.query(

            `SELECT * FROM car where active = 'active';
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
app.post('/getCommentByidCar', (req, res, next) => {
    const carId = req.body.id_car; // Lấy ID của xe từ yêu cầu

    // Thực hiện truy vấn để lấy thông tin bình luận từ cơ sở dữ liệu
    con.query(
        `SELECT
            comment.id_comment,
            users.ten AS user_ten,
            comment.noidung AS comment_content,
            comment.like_status AS comment_like_status,
            comment.created_at AS comment_created_at,
            comment.images AS comment_images,
            GROUP_CONCAT(
                JSON_OBJECT(
                    'id_reply', replycomment.id_reply,
                    'reply_user_ten', users_reply.ten,
                    'reply_content', replycomment.noidung,
                    'reply_like_status', replycomment.likecomment,
                    'reply_created_at', replycomment.created_at
                )
            ) AS reply_comments
        FROM
            comment
        LEFT JOIN
            users ON users.id_user = comment.id_user
        LEFT JOIN
            replycomment ON replycomment.id_comment = comment.id_comment
        LEFT JOIN
            users AS users_reply ON users_reply.id_user = replycomment.id_user
        WHERE
            comment.id_car = '${carId}'
        GROUP BY
            comment.id_comment;`,

        (err, result) => {
            if (err) {
                console.error('Error fetching comment data from database:', err);
                res.status(500).send('Internal server error');
                return;
            }

            let fullResults = []; // Khởi tạo mảng để lưu trữ tất cả các kết quả

            // Kiểm tra xem có dữ liệu bình luận hay không
            if (result.length > 0) {
                // Lặp qua từng dòng kết quả và chuyển đổi chuỗi JSON thành đối tượng JavaScript
                result.forEach(row => {
                    row.reply_comments = JSON.parse(`[${row.reply_comments}]`);
                    fullResults.push(row);
                });

                // Gửi phản hồi với dữ liệu bình luận và hình ảnh nếu có
                res.status(200).json(fullResults);
            } else {
                // Nếu không có kết quả, trả về một phản hồi trống hoặc một thông báo lỗi
                res.status(404).json({ message: 'Không có dữ liệu bình luận cho xe này' });
            }
        }
    );
});


app.post('/insertReplycomment', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { id_comment, likecomment, noidung } = req.body;
    const currentTimeVietnam = momentZone().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
    // Query SQL để chèn dữ liệu vào bảng replycomment
    const query = `INSERT INTO replycomment (id_reply,id_comment, id_user, likecomment, noidung,created_at) VALUES (UUID(),?, ?, ?, ?,?)`;
    const values = [id_comment, userId, likecomment, noidung, currentTimeVietnam];

    // Thực thi truy vấn SQL
    con.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting reply comment:', err);
            res.status(500).json({ error: 'Error inserting reply comment' });
            return;
        }

        console.log('Reply comment inserted successfully');

        res.status(200).json({ success: true, message: 'Reply comment inserted successfully' });
    });
});
// app.post('/getCommentByidCar', (req, res, next) => {
//     const carId = req.body.id_car; // Lấy ID của người dùng từ token
//     // Thực hiện truy vấn để lấy thông tin người dùng từ cơ sở dữ liệu
//     con.query(
//         `SELECT
//         comment.id_comment,
//         users.ten AS user_ten,
//         comment.noidung,
//         comment.like_status,
//         comment.created_at AS comment_created_at
//     FROM
//         comment
//     LEFT JOIN
//         users ON users.id_user = comment.id_user
//     LEFT JOIN
//         car ON car.id_car = comment.id_car
//     WHERE
//         comment.id_car = '${carId}';`,

//         (err, result) => {
//             if (err) {
//                 console.error('Error fetching user data from database:', err);
//                 res.status(500).send('Internal server error');
//                 return;
//             }

//             // Kiểm tra xem có dữ liệu người dùng hay không
//             if (result.length > 0) {
//                 let fullResult = [];
//                 for (let i = 0; i < result.length; i++) {
//                     fullResult.push({ message: 'thành công', arrComments: result[i] });
//                 }
//                 // Gửi phản hồi với mảng đầy đủ của kết quả
//                 res.writeHead(200, { 'Content-Type': 'application/json' });
//                 res.end(JSON.stringify(fullResult));
//             } else {
//                 // Nếu không có kết quả, trả về một phản hồi trống hoặc một thông báo lỗi
//                 res.writeHead(404, { 'Content-Type': 'application/json' });
//                 res.end(JSON.stringify({ message: 'Không có kết quả lay du lieu mess cua user' }));
//             }
//         }
//     );
// });
app.get('/getCarsInfo', (req, res, next) => {
    try {
        con.query(
            `SELECT car.id_car, users.ten AS user_ten, users.sdt AS user_sdt, users.diachi AS user_diachi, carname, automaker, price, description, active, car.created_at AS car_created_at
            FROM car
            LEFT JOIN users ON car.id_user = users.id_user;`,
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
app.post('/getCarByid', (req, res, next) => {
    const carId = req.body.id_car; // Lấy ID của người dùng từ token
    // Thực hiện truy vấn để lấy thông tin người dùng từ cơ sở dữ liệu
    con.query(
        `SELECT car.id_car, users.ten AS user_ten, users.sdt AS user_sdt, users.diachi AS user_diachi, carname, automaker, price, description,image1,image2,image3,image4,image5,image6,image7, active, car.created_at AS car_created_at
        FROM car
        LEFT JOIN users ON car.id_user = users.id_user
        WHERE car.id_car = '${carId}';`,

        (err, result) => {
            if (err) {
                console.error('Error fetching user data from database:', err);
                res.status(500).send('Internal server error');
                return;
            }

            // Kiểm tra xem có dữ liệu người dùng hay không
            if (result.length > 0) {
                // Nếu có dữ liệu, gửi thông tin người dùng về client dưới dạng JSON
                const carData = result[0];
                res.json(carData);
            } else {
                // Nếu không tìm thấy người dùng, gửi thông báo lỗi về client
                console.log("khong tim thay car");
                res.status(404).send('car not found');
            }
        }
    );
});

app.post('/addCars', authenticateToken, upload.array('images', 7), (req, res) => {
    const userId = req.user.id;
    const { carname, automaker, price, description, active } = req.body;

    // Lấy danh sách các tệp đã tải lên
    const images = req.files;
    const currentTimeVietnam = momentZone().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
    // Tạo câu lệnh INSERT
    const sql = `INSERT INTO car (id_car, id_user, carname, automaker, price, description,active,created_at, image1, image2, image3, image4, image5, image6, image7) 
                 VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`;

    // Thêm các tệp đã tải lên vào câu lệnh SQL
    const values = [userId, carname, automaker, price, description, active, currentTimeVietnam];
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
// app.post('/addComments', authenticateToken, async (req, res) => {
//     const userId = req.user.id;
//     const { id_car, noidung, like_status } = req.body;
//     const currentTimeVietnam = momentZone().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');

//     // Tạo câu lệnh INSERT
//     const sql = `INSERT INTO comment (id_comment,id_car, id_user, noidung, like_status, created_at) 
//              VALUES (UUID(), ?,?, ?, ?, ?)`;

//     const values = [id_car, userId, noidung, like_status, currentTimeVietnam];

//     // Thực thi câu lệnh INSERT
//     try {
//         const result = await con.query(sql, values);
//         console.log('Data inserted successfully into PostgreSQL');
//         res.status(200).send('true');
//     } catch (err) {
//         console.error('Error inserting data into PostgreSQL:', err);
//         res.status(500).send('Internal server error');
//     }
// });
app.post('/addComments', authenticateToken, uploadImagesComment.array('images'), async (req, res) => {
    const { id_car, noidung, like_status } = req.body;
    const userId = req.user.id;
    const images = req.files;
    const currentTimeVietnam = momentZone().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
    const imageFiles = images.map(image => ({
        filename: image.filename,
        path: image.path
    }));
    const imagesJson = JSON.stringify(imageFiles);
    const sql = `INSERT INTO comment (id_comment, id_car, id_user, noidung, like_status, created_at, images)
                            VALUES (UUID(), ?, ?, ?, ?, ?, ?)`;
    const values = [id_car, userId, noidung, like_status, currentTimeVietnam, imagesJson];
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
    console.log('listening on *:' + port);
});
