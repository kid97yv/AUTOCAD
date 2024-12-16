// autosave.ts
import { Request, Response } from 'express';
import { Pool } from 'pg'; // Hoặc bất kỳ thư viện nào bạn đang sử dụng

const autosaveInterval = 10000; // 10 giây

const pool = new Pool({
  user: 'kid97yv',
  host: 'dpg-ctf66u5ds78s73dmv090-a.singapore-postgres.render.com',
  database: 'autocad',
  password: 'zObYyaejEq8Qsa3xFwKAI0DWUedCa50N',
  port: 5432,
  ssl: { rejectUnauthorized: false }

});
export async function startAutosave(req: Request, res: Response) {
  const { blueprintId, content } = req.body;

  if (!blueprintId || !content) {
    console.error('Missing blueprintId or content');
    return res.status(400).send({ error: 'Missing blueprintId or content' });
  }

  try {
    // Thực hiện lưu trữ tự động vào cơ sở dữ liệu
    const query = 'INSERT INTO "Autosave" (blueprint_id, content, saved_at) VALUES ($1, $2, NOW())';
    await pool.query(query, [blueprintId, content]);

    console.log(`Autosave successful for blueprintId: ${blueprintId}`);
    return res.status(200).send({ message: 'Autosave initiated.' });

  } catch (error) {
    console.error('Error saving autosave:', error);
    return res.status(500).send({ error: 'Error saving autosave' });
  }
}
