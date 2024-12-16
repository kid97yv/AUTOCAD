import { Request, Response } from 'express';
import { Pool } from 'pg';
// import bcrypt from 'bcrypt';
import bcryptjs from 'bcryptjs';
import flash from 'express-flash';
const pool = new Pool({
    user: 'kid97yv',
    host: 'dpg-ctf66u5ds78s73dmv090-a.singapore-postgres.render.com',
    database: 'autocad',
    password: 'zObYyaejEq8Qsa3xFwKAI0DWUedCa50N',
    port: 5432,
    ssl: { rejectUnauthorized: false }

});


export const handleRegister = async (req: Request, res: Response): Promise<Response> => {
    const { email, username, password, role } = req.body;

    try {
        const existingUser = await pool.query('SELECT * FROM "Users" WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại!' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        await pool.query(
            'INSERT INTO "Users" (email, username, password, role, created_at) VALUES ($1, $2, $3, $4, NOW())',
            [email, username, hashedPassword, role]
        );

        return res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (err) {
        console.error('Lỗi:', err);
        return res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình đăng ký.' });
    }
};


export const handleLogin = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM "Users" WHERE username = $1', [username]);
        const user = userResult.rows[0];

        if (!user || !(await bcryptjs.compare(password, user.password))) {
             res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
        }

        (req.session as any).userId = user.id;
         res.status(200).json({ message: 'Đăng nhập thành công!' });
    } catch (err) {
        console.error('Lỗi:', err);
         res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình đăng nhập.' });
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