import express, { Request, Response, NextFunction } from 'express';
import { handleLogin, handleRegister } from '../controllers/authController';
import uploadMiddleware from './upload'; 
import session from 'express-session';
const router = express.Router();


const app = express();
app.use(session({
    secret: 'your_secret_key',  // Thay thế bằng secret thực của bạn
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, maxAge: 3600000 }  // Cookie có thời gian sống
  }));

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: "* Đăng ký người dùng mới"
 *     description: "* Đăng ký người dùng mới với thông tin cần thiết."
 *     parameters:
 *       - in: body
 *         name: user
 *         description: "* Thông tin người dùng cần đăng ký."
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: "* Tên người dùng."
 *               example: "johndoe"
 *             password:
 *               type: string
 *               description: "* Mật khẩu người dùng."
 *               example: "password123"
 *             email:
 *               type: string
 *               description: "* Địa chỉ email người dùng."
 *               example: "johndoe@example.com"
 *     responses:
 *       200:
 *         description: "* Đăng ký thành công."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đăng ký thành công."
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: "johndoe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *       400:
 *         description: "* Dữ liệu không hợp lệ hoặc thiếu thông tin."
 *       500:
 *         description: "* Đã xảy ra lỗi trong quá trình đăng ký."
 */

router.post('/register', async (req: Request, res: Response) => {
    
    try {
        await handleRegister(req, res); // Xử lý đăng ký
    } catch (err) {
        res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình đăng ký.' });
    }
});


// // // router.get('/login', (req: Request, res: Response) => {
// // //     res.render('login'); 
// // // });

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: "* Đăng nhập người dùng"
 *     description: "* Đăng nhập người dùng với tên người dùng và mật khẩu."
 *     parameters:
 *       - in: body
 *         name: credentials
 *         description: "* Thông tin đăng nhập của người dùng (tên người dùng và mật khẩu)."
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: "* Tên người dùng đăng nhập."
 *               example: "johndoe"
 *             password:
 *               type: string
 *               description: "* Mật khẩu của người dùng."
 *               example: "password123"
 *       - in: cookie
 *         name: user_session
 *         description: "* Cookie chứa thông tin phiên làm việc."
 *         required: true
 *         schema:
 *           type: string
 *           example: "your_session_value"
 *     responses:
 *       200:
 *         description: "* Đăng nhập thành công và trả về thông tin người dùng."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đăng nhập thành công."
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: "johndoe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *       400:
 *         description: "* Dữ liệu không hợp lệ hoặc thiếu thông tin đăng nhập."
 *       401:
 *         description: "* Tên người dùng hoặc mật khẩu không đúng."
 *       500:
 *         description: "* Đã xảy ra lỗi trong quá trình đăng nhập."
 */

router.post('/login', (req, res, next) => {
    res.cookie('user_session', 'your_session_value', {
        httpOnly: true,  // Đảm bảo cookie không thể bị truy cập qua JavaScript
        secure: false,   // Chỉ sử dụng true nếu bạn đang chạy qua HTTPS
        maxAge: 3600000  // Cookie hết hạn sau 1 giờ
      });
    handleLogin(req, res).catch((err) => next(err));
});


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: "* Đăng xuất người dùng"
 *     description: "* Đăng xuất người dùng khỏi hệ thống bằng cách hủy phiên làm việc."
 *     responses:
 *       200:
 *         description: "* Đăng xuất thành công."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đăng xuất thành công!"
 *       500:
 *         description: "* Đã xảy ra lỗi khi hủy phiên làm việc."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Đã xảy ra lỗi khi đăng xuất."
 */
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Không thể đăng xuất' });
      }
      res.clearCookie('connect.sid');  // Xóa cookie liên quan đến session
      res.status(200).json({ message: 'Đăng xuất thành công' });
    });
  });

router.use('/upload', uploadMiddleware);

export default router;