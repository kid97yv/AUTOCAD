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
const bcrypt_1 = __importDefault(require("bcrypt"));
const pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Autocad',
    password: 'kid97yv',
    port: 5432,
});
const handleRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password, role } = req.body;
    try {
        const existingUser = yield pool.query('SELECT * FROM "Users" WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            return res.status(400).send('Tên đăng nhập đã tồn tại!');
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield pool.query('INSERT INTO "Users" (email, username, password, role, created_at) VALUES ($1, $2, $3, $4, NOW())', [email, username, hashedPassword, role]);
        return res.status(201).send('Đăng ký thành công!');
    }
    catch (err) {
        console.error('Lỗi:', err);
        return res.status(500).send('Đã xảy ra lỗi trong quá trình đăng ký.');
    }
});
exports.handleRegister = handleRegister;
const handleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const userResult = yield pool.query('SELECT * FROM "Users" WHERE username = $1', [username]);
        const user = userResult.rows[0];
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            req.flash('errorMessage', 'Tên đăng nhập hoặc mật khẩu không đúng!');
            return res.redirect('/auth/login');
        }
        req.session.userId = user.id;
        return res.redirect('/upload');
    }
    catch (err) {
        console.error('Lỗi:', err);
        req.flash('errorMessage', 'Đã xảy ra lỗi trong quá trình đăng nhập.');
        return res.redirect('/auth/login');
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
