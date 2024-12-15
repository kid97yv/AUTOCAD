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
let autosaveTimeout;
const pool = new pg_1.Pool({
    user: 'kid97yv',
    host: 'dpg-ctf66u5ds78s73dmv090-a.singapore-postgres.render.com',
    database: 'autocad',
    password: 'zObYyaejEq8Qsa3xFwKAI0DWUedCa50N',
    port: 5432,
});
function startAutosave(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const { blueprintId, content } = req.body;
        if (!blueprintId || !content) {
            console.error('Missing blueprintId or content');
            return;
        }
        try {
            yield fetch('/autosave', {
                method: 'POST',
                body: JSON.stringify({ blueprintId, content }),
                headers: { 'Content-Type': 'application/json' },
            });
        }
        catch (error) {
            console.error('Error saving autosave:', error);
        }
    });
}
