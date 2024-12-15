import { Session } from 'express-session';

interface CustomSession extends Session {
  userId: number;
  filePath?: string;
}

const userId = (req.session as CustomSession).userId;
declare module 'express-session' {
  interface SessionData {
      userId: string; // Thêm thuộc tính userId vào SessionData
  }
}