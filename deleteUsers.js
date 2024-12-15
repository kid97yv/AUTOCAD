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
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Autocad',
    password: 'kid97yv',
    port: 5432,
});
function deleteAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield pool.query('DELETE FROM "Files"');
            console.log(`Đã xóa ${res.rowCount} bản ghi từ bảng Users.`);
        }
        catch (err) {
            console.error('Lỗi:', err);
        }
    });
}
deleteAllUsers();
process.on('exit', () => {
    pool.end();
});
