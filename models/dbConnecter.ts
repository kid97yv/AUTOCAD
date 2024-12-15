import { Client } from 'pg';

// const client = new Client({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'Autocad',
//     password: 'kid97yv',
//     port: 5432,
// });
const client = new Client({
    user: 'kid97yv',
    host: 'dpg-ctf66u5ds78s73dmv090-a.singapore-postgres.render.com',
    database: 'autocad',
    password: 'zObYyaejEq8Qsa3xFwKAI0DWUedCa50N',
    port: 5432,
    ssl: { rejectUnauthorized: false }

});

const connectDatabase = async (): Promise<void> => {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL');
    } catch (err) {
        console.error('Connection error', (err as Error).stack);
    }
};

export {
    client,
    connectDatabase,
};