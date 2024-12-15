const { Client } = require('pg');

const client = new Client({
    user: 'kid97yv',
    host: 'dpg-ctf66u5ds78s73dmv090-a.singapore-postgres.render.com',
    database: 'autocad',
    password: 'zObYyaejEq8Qsa3xFwKAI0DWUedCa50N',
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