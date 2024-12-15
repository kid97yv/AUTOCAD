const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Autocad',
    password: 'kid97yv',
    port: 5432,
});

async function fetchUsers() {
    try {
        await client.connect();
        const res = await client.query('SELECT * FROM Users');
        console.log('Thông tin người dùng:', res.rows);
    } catch (err) {
        console.error('Lỗi:', err);
    } finally {
        await client.end();
    }
}

fetchUsers();