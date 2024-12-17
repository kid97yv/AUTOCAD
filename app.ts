import express from 'express';
import path from 'path';
import uploadRoutes from './routes/upload';
import authRoutes from './routes/auth';
import session from 'express-session';
import { Pool } from 'pg';
import flash from 'express-flash';
import fs from 'fs';
import swaggerJSDoc from 'swagger-jsdoc'; 
import swaggerUi from 'swagger-ui-express'; 
import cors from 'cors'; 

// Khởi tạo express app và port
const app = express();
const PORT = 3030;
const connectPgSimple = require('connect-pg-simple');

const pool = new Pool({
    user: 'kid97yv',
    host: 'dpg-ctf66u5ds78s73dmv090-a.singapore-postgres.render.com',
    database: 'autocad',
    password: 'zObYyaejEq8Qsa3xFwKAI0DWUedCa50N',
    port: 5432,
    ssl: { rejectUnauthorized: false },
});
const PGSession = connectPgSimple(session);

app.use(session({
    store: new PGSession({
        pool: pool,  // Sử dụng pool kết nối của bạn
        tableName: 'session',  // Tên bảng lưu trữ session trong PostgreSQL
    }),
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },  // Đặt `secure: true` khi chạy trên môi trường HTTPS
}));
app.use(cors({
    origin: '*',  // Chấp nhận tất cả các domain
    credentials: true,  // Cho phép gửi cookie (nếu cần)
}));

// app.use(cors());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Tài liệu API với Swagger',
        },
    },
    apis: ['./routes/*.ts'],
};
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8'));

app.use('/swagger', express.static(path.join(__dirname, 'swagger-ui')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(flash());  // Middleware cho flash messages

app.use(session({
    secret: 'your_secret_key',  
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, maxAge: 3600000 }  
}));



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', uploadRoutes);  

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Trang chủ
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
