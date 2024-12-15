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
const client = new pg_1.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Autocad',
    password: 'kid97yv',
    port: 5432,
});
function listTables() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const res = yield client.query(`
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
        finally {
            yield client.end();
        }
    });
}
listTables();
