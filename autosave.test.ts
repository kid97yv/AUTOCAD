import { startAutosave } from './autosave'; // Nhập hàm autosave cần kiểm thử
import { Pool } from 'pg'; // Nhập lớp Pool từ pg để mô phỏng
import { Request } from 'express'; // Nhập giao diện Request từ express để kiểm tra kiểu dữ liệu

// Mô phỏng module pg để tránh thao tác thực tế với cơ sở dữ liệu
jest.mock('pg');

// Mô phỏng phương thức query của Pool prototype
const mockQuery = jest.fn();
(Pool.prototype.query as jest.Mock) = mockQuery;

// Mô phỏng global fetch để giả lập các yêu cầu HTTP cho API autosave
global.fetch = jest.fn(() =>
  Promise.resolve(
    new Response(JSON.stringify({}), {
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
    })
  )
);

describe('Autosave Functionality', () => {
  let req: Partial<Request>; // Khai báo đối tượng Request giả để mô phỏng dữ liệu yêu cầu

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
  it('should call autosaveEntities after the specified timeout', async () => {
    jest.useFakeTimers();
    startAutosave(req as Request);
  
    jest.advanceTimersByTime(1000); // Tiến tiến thời gian giả
  
    expect(global.fetch).toHaveBeenCalledWith('/autosave', expect.any(Object));
  });
  

  // Test 2: Kiểm tra xem có lỗi được ghi lại khi thiếu blueprintId hoặc content
  it('should log an error if no blueprintId or content is provided', () => {
    console.error = jest.fn();
  
    req.body = {}; // Không có blueprintId và content
    startAutosave(req as Request);
  
    expect(console.error).toHaveBeenCalledWith('Missing blueprintId or content');
  });
  

  // Test 3: Kiểm tra xem lỗi có được xử lý đúng khi fetch gặp sự cố
  it('should handle query errors gracefully', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Database error')));
  
    await startAutosave(req as Request);
  
    expect(console.error).toHaveBeenCalledWith('Error saving autosave:', expect.any(Error));
  });
  
});
