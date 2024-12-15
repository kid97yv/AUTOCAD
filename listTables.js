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
    user: 'kid97yv',
    host: 'dpg-ctf66u5ds78s73dmv090-a.singapore-postgres.render.com',
    database: 'autocad',
    password: 'zObYyaejEq8Qsa3xFwKAI0DWUedCa50N',
    port: 5432,
    ssl: { rejectUnauthorized: false }
});
function listTables() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema='public';
        `);
            console.log('Tables in the database:');
            res.rows.forEach(row => {
                console.log(row.table_name);
            });
        }
        catch (err) {
            console.error('Error fetching tables:', err.message);
        }
    });
}
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield pool.query('SELECT * FROM "Users"');
            console.log('Thông tin người dùng:', res.rows);
        }
        catch (err) {
            console.error('Lỗi:', err);
        }
    });
}
function fetchFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield pool.query('SELECT * FROM "Files"');
            console.log('Thông tin file:', res.rows);
        }
        catch (err) {
            console.error('Lỗi:', err);
        }
    });
}
function fetchAutosavelogs() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield pool.query('SELECT * FROM "Autosavelogs"');
            console.log('Thông tin Autosave:', res.rows);
        }
        catch (err) {
            console.error('Lỗi:', err);
        }
    });
}
listTables();
fetchUsers();
fetchFiles();
fetchAutosavelogs();
process.on('exit', () => {
    pool.end();
});
