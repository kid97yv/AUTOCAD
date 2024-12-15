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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const dbConnecter_1 = require("./dbConnecter");
const createUser = (email, username, password, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const query = 'INSERT INTO Users (email, username, password, role, createdAt) VALUES ($1, $2, $3, $4, NOW())';
        yield dbConnecter_1.client.query(query, [email, username, hashedPassword, role]);
    }
    catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
});
const findUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM Users WHERE username = $1';
        const result = yield dbConnecter_1.client.query(query, [username]);
        return result.rows[0];
    }
    catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
});
const userModel = {
    createUser,
    findUserByUsername,
};
exports.default = userModel;
