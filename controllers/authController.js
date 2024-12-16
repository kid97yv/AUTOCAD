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
exports.handleLogout = exports.handleLogin = exports.handleRegister = void 0;
const pg_1 = require("pg");
// import bcrypt from 'bcrypt';
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const pool = new pg_1.Pool({
    user: 'kid97yv',
    host: 'dpg-ctf66u5ds78s73dmv090-a.singapore-postgres.render.com',
    database: 'autocad',
    password: 'zObYyaejEq8Qsa3xFwKAI0DWUedCa50N',
    port: 5432,
    ssl: { rejectUnauthorized: false }
});
const handleRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password, role } = req.body;
    try {
        const existingUser = yield pool.query('SELECT * FROM "Users" WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại!' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        yield pool.query('INSERT INTO "Users" (email, username, password, role, created_at) VALUES ($1, $2, $3, $4, NOW())', [email, username, hashedPassword, role]);
        return res.status(201).json({ message: 'Đăng ký thành công!' });
    }
    catch (err) {
        console.error('Lỗi:', err);
        return res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình đăng ký.' });
    }
});
exports.handleRegister = handleRegister;
const handleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const userResult = yield pool.query('SELECT * FROM "Users" WHERE username = $1', [username]);
        const user = userResult.rows[0];
        if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
            res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
        }
        req.session.userId = user.id;
        res.status(200).json({ message: 'Đăng nhập thành công!' });
    }
    catch (err) {
        console.error('Lỗi:', err);
        res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình đăng nhập.' });
    }
});
exports.handleLogin = handleLogin;
const handleLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out.');
        }
        res.redirect('/'); // Redirect về trang chủ hoặc trang đăng nhập
    });
};
exports.handleLogout = handleLogout;
