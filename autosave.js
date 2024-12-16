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
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAutosave = startAutosave;
const pg_1 = require("pg"); // Hoặc bất kỳ thư viện nào bạn đang sử dụng
const autosaveInterval = 10000; // 10 giây
const pool = new pg_1.Pool({
    user: 'kid97yv',
    host: 'dpg-ctf66u5ds78s73dmv090-a.singapore-postgres.render.com',
    database: 'autocad',
    password: 'zObYyaejEq8Qsa3xFwKAI0DWUedCa50N',
    port: 5432,
    ssl: { rejectUnauthorized: false }
});
function startAutosave(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { blueprintId, content } = req.body;
        if (!blueprintId || !content) {
            console.error('Missing blueprintId or content');
            return res.status(400).send({ error: 'Missing blueprintId or content' });
        }
        try {
            // Thực hiện lưu trữ tự động vào cơ sở dữ liệu
            const query = 'INSERT INTO "Autosave" (blueprint_id, content, saved_at) VALUES ($1, $2, NOW())';
            yield pool.query(query, [blueprintId, content]);
            console.log(`Autosave successful for blueprintId: ${blueprintId}`);
            return res.status(200).send({ message: 'Autosave initiated.' });
        }
        catch (error) {
            console.error('Error saving autosave:', error);
            return res.status(500).send({ error: 'Error saving autosave' });
        }
    });
}
