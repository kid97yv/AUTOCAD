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


// export const handleRegister = async (req: Request, res: Response): Promise<Response> => {
//     const { email, username, password, role } = req.body;
//     if (!username || !password) {
//         res.status(400).json({ error: 'Username and password are required' });
//    }

//    // Debug: Kiểm tra giá trị password
//    console.log('Password:', password);  // In password ra để kiểm tra
//     try {
//         const existingUser = await pool.query('SELECT * FROM "Users" WHERE username = $1', [username]);
//         if (existingUser.rows.length > 0) {
//             return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại!' });
//         }
//         if (typeof password !== 'string' || password.trim() === '') {
//             return res.status(400).json({ error: 'Password must be a non-empty string' });
//         }

//         const hashedPassword = await bcryptjs.hash(password, 10);
//         await pool.query(
//             'INSERT INTO "Users" (email, username, password, role, created_at) VALUES ($1, $2, $3, $4, NOW())',
//             [email, username, hashedPassword, role]
//         );

//         return res.status(201).json({ message: 'Đăng ký thành công!' });
//     } catch (err) {
//         console.error('Lỗi:', err);
//         return res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình đăng ký.' });
//     }
// };

export const handleRegister = async (req: Request, res: Response): Promise<Response> => {
    const { username, password, email } = req.body; // Lấy thông tin từ request body

    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Email:', email);

    try {
        // Kiểm tra xem người dùng đã tồn tại chưa
        const userResult = await pool.query('SELECT * FROM "Users" WHERE username = $1', [username]);
        const user = userResult.rows[0];

        if (user) {
            // Nếu người dùng đã tồn tại, trả lỗi
            return res.status(409).json({ error: 'Tên đăng nhập đã tồn tại!' });
        }

        // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Thêm người dùng mới vào cơ sở dữ liệu
        const newUserResult = await pool.query(
            'INSERT INTO "Users" (username, password, email) VALUES ($1, $2, $3) RETURNING *',
            [username, hashedPassword, email]
        );

        const newUser = newUserResult.rows[0];

        // Trả về thông báo thành công
        return res.status(201).json({
            message: 'Đăng ký thành công!',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (err) {
        console.error('Lỗi:', err);
        return res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình đăng ký.' });
    }
};



export const handleLogin = async (req: Request, res: Response): Promise<Response> => {
    const { username, password } = req.body;
console.log('Username:', username);
console.log('Password:', password);
    try {
        const userResult = await pool.query('SELECT * FROM "Users" WHERE username = $1', [username]);
        const user = userResult.rows[0];

        if (!user) {
            // Nếu không tìm thấy người dùng, trả về lỗi
            return res.status(404).json({ error: 'Người dùng không tồn tại' });
        }

        if (!(await bcryptjs.compare(password, user.password))) {
            // Nếu mật khẩu không đúng, trả về lỗi
            return res.status(401).json({ error: 'Mật khẩu không đúng' });
        }

        // Nếu người dùng đăng nhập thành công, lưu trữ ID người dùng vào session
        req.session.userId = user.id;
        return res.status(200).json({ message: 'Đăng nhập thành công!' });
    } catch (err) {
        console.error('Lỗi:', err);
        return res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình đăng nhập' });
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