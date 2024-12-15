import { Client } from 'pg';

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Autocad',
    password: 'kid97yv',
    port: 5432,
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