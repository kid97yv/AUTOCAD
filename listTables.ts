import { Pool } from 'pg';

const pool = new Pool({
    user: 'kid97yv',
    host: 'dpg-ctf66u5ds78s73dmv090-a.singapore-postgres.render.com',
    database: 'autocad',
    password: 'zObYyaejEq8Qsa3xFwKAI0DWUedCa50N',
    port: 5432,
    ssl: { rejectUnauthorized: false }

});


async function listTables(): Promise<void> {
    try {
        const res = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema='public';
        `);

        console.log('Tables in the database:');
        res.rows.forEach(row => {
            console.log(row.table_name);
        });
    } catch (err) {
        console.error('Error fetching tables:', (err as Error).message);
    }
}

async function fetchUsers(): Promise<void> {
    try {
        const res = await pool.query('SELECT * FROM "Users"'); 
        console.log('Thông tin người dùng:', res.rows);
    } catch (err) {
        console.error('Lỗi:', err);
    }
}
async function fetchFiles(): Promise<void> {
    try {
        const res = await pool.query('SELECT * FROM "Files"WHERE user_id = 10 ORDER BY uploaded_at DESC');
        console.log('Thông tin file:', res.rows);
    } catch (err) {
        console.error('Lỗi:', err);
    }
}
async function fetchAutosavelogs(): Promise<void> {
    try {
        const res = await pool.query('SELECT * FROM "Autosavelogs"');
        console.log('Thông tin Autosave:', res.rows);
    } catch (err) {
        console.error('Lỗi:', err);
    }
}
listTables();
fetchUsers();
fetchFiles();
fetchAutosavelogs()
process.on('exit', () => {
    pool.end();
});