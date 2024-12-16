import express, { Request, Response, NextFunction } from 'express';
import { handleLogin, handleRegister } from '../controllers/authController';
import uploadMiddleware from './upload'; 

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to my app!');
});

// router.get('/register', (req: Request, res: Response) => {
//     const errorMessages = req.flash('error') || [];
//     res.render('register', { errorMessages });
// });

router.post('/register', async (req: Request, res: Response) => {
    try {
        await handleRegister(req, res); // Xử lý đăng ký
    } catch (err) {
        res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình đăng ký.' });
    }
});


// router.get('/login', (req: Request, res: Response) => {
//     res.render('login'); 
// });

router.post('/login', (req, res, next) => {
    handleLogin(req, res).catch((err) => next(err));
});

router.post('/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Đã xảy ra lỗi khi đăng xuất.' });
        }

        // Trả về phản hồi JSON khi logout thành công
        return res.status(200).json({ message: 'Đăng xuất thành công!' });
    });
});



router.use('/upload', uploadMiddleware);

export default router;