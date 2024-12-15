"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const upload_1 = __importDefault(require("./routes/upload"));
const auth_1 = __importDefault(require("./routes/auth"));
const express_session_1 = __importDefault(require("express-session"));
const pg_1 = require("pg");
const express_flash_1 = __importDefault(require("express-flash"));
// import bcrypt from 'bcrypt';
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express")); // import swagger-ui-express
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc")); // import swagger-jsdoc
const autosaveRoutes_1 = __importDefault(require("./routes/autosaveRoutes"));
const app = (0, express_1.default)();
const PORT = 3030;
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'This is a simple API with Swagger documentation',
        },
        servers: [
            {
                url: 'http://localhost:3030',
            },
        ],
    },
    apis: ['./routes/*.js', './routes/*.ts'], // Adjust the paths to match your route files
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Serve Swagger documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
/**
 * @swagger
 * /hello:
 *   get:
 *     description: Returns a hello message
 *     responses:
 *       200:
 *         description: A hello message
 */
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});
const pool = new pg_1.Pool({
    user: 'kid97yv',
    host: 'dpg-ctf66u5ds78s73dmv090-a.singapore-postgres.render.com',
    database: 'autocad',
    password: 'zObYyaejEq8Qsa3xFwKAI0DWUedCa50N',
    port: 5432,
    ssl: { rejectUnauthorized: false }
});
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: 'your secret', // Thay đổi secret
    resave: false,
    saveUninitialized: true,
}));
app.use((0, express_flash_1.default)());
app.use('/auth', auth_1.default);
app.use(autosaveRoutes_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.use('/', upload_1.default);
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// Đăng ký Routes
// app.get('/auth/register', (req, res) => {
//     const errorMessages = req.flash('error') || [];
//     res.render('register', { errorMessages });
// });
/**
 * @swagger
 * /auth/register:
 *   get:
 *     description: Render register page
 *     responses:
 *       200:
 *         description: A registration page
 */
app.get('/auth/register', (req, res) => {
    const errorMessages = req.flash('error') || [];
    res.render('register', { errorMessages });
});
/**
 * @swagger
 * /upload:
 *   post:
 *     description: Upload a file
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         description: The file to upload
 *         required: true
 *         type: file
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Invalid file type
 */
app.post('/upload', (req, res) => {
    res.send('File uploaded successfully!');
});
// app.post('/api/register', async (req, res) => {
//     const { email, username, password, role } = req.body;
//     try {
//         const existingUser = await pool.query('SELECT * FROM "Users" WHERE username = $1', [username]);
//         if (existingUser.rows.length > 0) {
//             req.flash('error', 'Tên đăng nhập đã tồn tại!');
//             return res.redirect('/auth/register');
//         }
//         const hashedPassword = await bcryptjs.hash(password, 10);
//         await pool.query(
//             'INSERT INTO "Users" (email, username, password, role, created_at) VALUES ($1, $2, $3, $4, NOW())',
//             [email, username, hashedPassword, role]
//         );
//         return res.redirect('/auth/login');
//     } catch (err) {
//         console.error('Lỗi:', err);
//         req.flash('error', 'Đã xảy ra lỗi trong quá trình đăng ký.');
//         return res.redirect('/auth/register');
//     }
// });
/**
 * @swagger
 * /api/register:
 *   post:
 *     description: Register a new user
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User registration data
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               example: "user@example.com"
 *             username:
 *               type: string
 *               example: "new_user"
 *             password:
 *               type: string
 *               example: "password123"
 *             role:
 *               type: string
 *               example: "user"
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Invalid user data
 */
app.post('/api/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password, role } = req.body;
    try {
        const existingUser = yield pool.query('SELECT * FROM "Users" WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            req.flash('error', 'Tên đăng nhập đã tồn tại!');
            return res.redirect('/auth/register');
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        yield pool.query('INSERT INTO "Users" (email, username, password, role, created_at) VALUES ($1, $2, $3, $4, NOW())', [email, username, hashedPassword, role]);
        return res.redirect('/auth/login');
    }
    catch (err) {
        console.error('Lỗi:', err);
        req.flash('error', 'Đã xảy ra lỗi trong quá trình đăng ký.');
        return res.redirect('/auth/register');
    }
}));
// Tải lên Routes
// app.get('/', (req, res) => {
//     res.redirect('/auth/login');
// });
/**
 * @swagger
 * /:
 *   get:
 *     description: Redirect to login page
 *     responses:
 *       200:
 *         description: Redirect to login page
 */
app.get('/', (req, res) => {
    res.redirect('/auth/login');
});
function getUserFromDatabase(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        return result.rows[0];
    });
}
// app.post('/auth/login', async (req, res) => {
//     const { username, password } = req.body;
//     // Kiểm tra thông tin đăng nhập
//     const user = await getUserFromDatabase(username, password);
// console.log(user);
//     if (user) {
//         (req.session as any).userId = user.id; 
//         res.send('Login successful!');
//     } else {
//         res.status(401).send('Invalid credentials');
//     }
// })
// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
