import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Autocad',
    password: 'kid97yv',
    port: 5432,
});

async function deleteAllUsers(): Promise<void> {
    try {
        const res = await pool.query('DELETE FROM "Files"'); 
        console.log(`Đã xóa ${res.rowCount} bản ghi từ bảng Users.`);
    } catch (err) {
        console.error('Lỗi:', err);
    }
}

deleteAllUsers();

process.on('exit', () => {
    pool.end();
});