"use strict";
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
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express")); // import swagger-ui-express
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc")); // import swagger-jsdoc
const autosaveRoutes_1 = __importDefault(require("./routes/autosaveRoutes"));
const app = (0, express_1.default)();
const PORT = 3030;
const cors = require('cors');
app.use(cors());
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
app.use(cors({
    origin: 'http://localhost:3030', // Swagger UI domain
    credentials: true // Cho phép gửi cookies
}));
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
// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
