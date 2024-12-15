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
const autosave_1 = require("./autosave"); // Nhập hàm autosave cần kiểm thử
const pg_1 = require("pg"); // Nhập lớp Pool từ pg để mô phỏng
// Mô phỏng module pg để tránh thao tác thực tế với cơ sở dữ liệu
jest.mock('pg');
// Mô phỏng phương thức query của Pool prototype
const mockQuery = jest.fn();
pg_1.Pool.prototype.query = mockQuery;
// Mô phỏng global fetch để giả lập các yêu cầu HTTP cho API autosave
global.fetch = jest.fn(() => Promise.resolve(new Response(JSON.stringify({}), {
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
})));
describe('Autosave Functionality', () => {
    let req; // Khai báo đối tượng Request giả để mô phỏng dữ liệu yêu cầu
    beforeEach(() => {
        // Reset lại body của request trước mỗi lần kiểm thử
        req = {
            body: {
                blueprintId: '1',
                content: 'Test content',
            },
        };
        jest.clearAllMocks(); // Xóa các mock trước mỗi lần kiểm thử
    });
    // Test 1: Kiểm tra xem autosaveEntities có được gọi sau một khoảng thời gian nhất định không
    it('should call autosaveEntities after the specified timeout', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.useFakeTimers();
        (0, autosave_1.startAutosave)(req);
        jest.advanceTimersByTime(1000); // Tiến tiến thời gian giả
        expect(global.fetch).toHaveBeenCalledWith('/autosave', expect.any(Object));
    }));
    // Test 2: Kiểm tra xem có lỗi được ghi lại khi thiếu blueprintId hoặc content
    it('should log an error if no blueprintId or content is provided', () => {
        console.error = jest.fn();
        req.body = {}; // Không có blueprintId và content
        (0, autosave_1.startAutosave)(req);
        expect(console.error).toHaveBeenCalledWith('Missing blueprintId or content');
    });
    // Test 3: Kiểm tra xem lỗi có được xử lý đúng khi fetch gặp sự cố
    it('should handle query errors gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch = jest.fn(() => Promise.reject(new Error('Database error')));
        yield (0, autosave_1.startAutosave)(req);
        expect(console.error).toHaveBeenCalledWith('Error saving autosave:', expect.any(Error));
    }));
});
