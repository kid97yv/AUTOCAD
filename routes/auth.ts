import express, { Request, Response, NextFunction } from 'express';
import { handleLogin, handleRegister } from '../controllers/authController';
import uploadMiddleware from './upload'; 

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to my app!');
});

router.get('/register', (req: Request, res: Response) => {
    const errorMessages = req.flash('error') || [];
    res.render('register', { errorMessages });
});

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await handleRegister(req, res);
    } catch (err) {
        next(err);
    }
});

router.get('/login', (req: Request, res: Response) => {
    res.render('login'); 
});

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    handleLogin(req, res)
      .catch((err) => next(err));
});

router.post('/logout', (req: Request, res: Response) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out.');
        }
        res.redirect('/auth/login'); 
    });
});

router.use('/upload', uploadMiddleware);

export default router;