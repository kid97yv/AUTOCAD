import { Request, Response } from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import flash from 'express-flash';
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Autocad',
    password: 'kid97yv',
    port: 5432,
});

export const handleRegister = async (req: Request, res: Response): Promise<Response> => {
    const { email, username, password, role } = req.body;

    try {
        const existingUser = await pool.query('SELECT * FROM "Users" WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            return res.status(400).send('Tên đăng nhập đã tồn tại!');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO "Users" (email, username, password, role, created_at) VALUES ($1, $2, $3, $4, NOW())',
            [email, username, hashedPassword, role]
        );

        return res.status(201).send('Đăng ký thành công!'); 
    } catch (err) {
        console.error('Lỗi:', err);
        return res.status(500).send('Đã xảy ra lỗi trong quá trình đăng ký.');
    }
};

export const handleLogin = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM "Users" WHERE username = $1', [username]);
        const user = userResult.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            req.flash('errorMessage', 'Tên đăng nhập hoặc mật khẩu không đúng!');
            return res.redirect('/auth/login'); 
        }
        (req.session as any).userId = user.id;
        return res.redirect('/upload');
    } catch (err) {
        console.error('Lỗi:', err);
        req.flash('errorMessage', 'Đã xảy ra lỗi trong quá trình đăng nhập.');
        return res.redirect('/auth/login'); 
    }
};
export const handleLogout = (req: Request, res: Response): void => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out.');
        }
        res.redirect('/'); // Redirect về trang chủ hoặc trang đăng nhập
    });};