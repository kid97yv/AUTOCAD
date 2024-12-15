import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const pool = new Pool({
    user: 'kid97yv',
    host: 'dpg-ctf66u5ds78s73dmv090-a.singapore-postgres.render.com',
    database: 'autocad',
    password: 'zObYyaejEq8Qsa3xFwKAI0DWUedCa50N',
    port: 5432,
});

const router = express.Router();

router.post('/autosave', async (req: Request, res: Response): Promise<void> => {
    const { content } = req.body;
    const userId = (req.session as any).userId; // Lấy thông tin người dùng từ session

    if (!content) {
        res.status(400).send('No content provided.');
        return;
    }

    try {
        // Lưu nội dung vào cơ sở dữ liệu
        await pool.query(
            `INSERT INTO "Autosavelogs" (blueprint_Id, content, saved_at) 
             VALUES ($1, $2, CURRENT_TIMESTAMP) 
             ON CONFLICT (id) 
             DO UPDATE SET content = EXCLUDED.content, saved_at = CURRENT_TIMESTAMP`,
            [userId, content]
        );
        res.status(200).send('Autosave successful.');
    } catch (err) {
        console.error('Error saving autosave:', err);
        res.status(500).send('Error saving autosave.');
    }
});

export default router;