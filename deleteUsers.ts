import { Pool } from 'pg';

const pool = new Pool({
    user: 'kid97yv',
    host: 'dpg-ctf66u5ds78s73dmv090-a.singapore-postgres.render.com',
    database: 'autocad',
    password: 'zObYyaejEq8Qsa3xFwKAI0DWUedCa50N',
    port: 5432,
    ssl: { rejectUnauthorized: false }

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