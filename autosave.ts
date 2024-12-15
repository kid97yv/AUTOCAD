// autosave.ts
import { Request } from 'express';
import { Pool } from 'pg'; // Hoặc bất kỳ thư viện nào bạn đang sử dụng

const autosaveInterval = 10000; // 10 giây
let autosaveTimeout: NodeJS.Timeout;

const pool = new Pool({
  user: 'kid97yv',
  host: 'dpg-ctf66u5ds78s73dmv090-a.singapore-postgres.render.com',
  database: 'autocad',
  password: 'zObYyaejEq8Qsa3xFwKAI0DWUedCa50N',
  port: 5432,
  ssl: { rejectUnauthorized: false }

});


export async function startAutosave(req: Request) {
    const { blueprintId, content } = req.body;
  
    if (!blueprintId || !content) {
      console.error('Missing blueprintId or content');
      return;
    }
  
    try {
      await fetch('/autosave', {
        method: 'POST',
        body: JSON.stringify({ blueprintId, content }),
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error saving autosave:', error);
    }
  }
  
