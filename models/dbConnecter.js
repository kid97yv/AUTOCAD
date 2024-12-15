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
exports.connectDatabase = exports.client = void 0;
const pg_1 = require("pg");
// const client = new Client({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'Autocad',
//     password: 'kid97yv',
//     port: 5432,
// });
const client = new pg_1.Client({
    user: 'kid97yv',
    host: 'dpg-ctf66u5ds78s73dmv090-a.singapore-postgres.render.com',
    database: 'autocad',
    password: 'zObYyaejEq8Qsa3xFwKAI0DWUedCa50N',
    port: 5432,
    ssl: { rejectUnauthorized: false }
});
exports.client = client;
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log('Connected to PostgreSQL');
    }
    catch (err) {
        console.error('Connection error', err.stack);
    }
});
exports.connectDatabase = connectDatabase;
