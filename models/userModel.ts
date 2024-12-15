import { Client } from 'pg';
import bcrypt from 'bcrypt';
import { client } from './dbConnecter';

const createUser = async (email: string, username: string, password: string, role: string): Promise<void> => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO Users (email, username, password, role, createdAt) VALUES ($1, $2, $3, $4, NOW())';
        await client.query(query, [email, username, hashedPassword, role]);
    } catch (error) {
        console.error('Error creating user:', error);
        throw error; 
    }
};

const findUserByUsername = async (username: string): Promise<any> => {
    try {
        const query = 'SELECT * FROM Users WHERE username = $1';
        const result = await client.query(query, [username]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error; 
    }
};

const userModel = {
    createUser,
    findUserByUsername,
};

export default userModel;