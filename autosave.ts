// autosave.ts
import { Request } from 'express';
import { Pool } from 'pg'; // Hoặc bất kỳ thư viện nào bạn đang sử dụng

const autosaveInterval = 10000; // 10 giây
let autosaveTimeout: NodeJS.Timeout;

const pool = new Pool(); // Khởi tạo kết nối với cơ sở dữ liệu

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
  
