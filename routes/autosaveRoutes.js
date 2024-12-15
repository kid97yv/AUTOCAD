"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'kid97yv',
    host: 'dpg-ctf66u5ds78s73dmv090-a.singapore-postgres.render.com',
    database: 'autocad',
    password: 'zObYyaejEq8Qsa3xFwKAI0DWUedCa50N',
    port: 5432,
    ssl: { rejectUnauthorized: false }
});
const router = express_1.default.Router();
router.post('/autosave', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    const userId = req.session.userId; // Lấy thông tin người dùng từ session
    if (!content) {
        res.status(400).send('No content provided.');
        return;
    }
    try {
        // Lưu nội dung vào cơ sở dữ liệu
        yield pool.query(`INSERT INTO "Autosavelogs" (blueprint_Id, content, saved_at) 
             VALUES ($1, $2, CURRENT_TIMESTAMP) 
             ON CONFLICT (id) 
             DO UPDATE SET content = EXCLUDED.content, saved_at = CURRENT_TIMESTAMP`, [userId, content]);
        res.status(200).send('Autosave successful.');
    }
    catch (err) {
        console.error('Error saving autosave:', err);
        res.status(500).send('Error saving autosave.');
    }
}));
exports.default = router;
