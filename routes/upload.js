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
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dxf_parser_1 = __importDefault(require("dxf-parser"));
const pg_1 = require("pg");
const autosave_1 = require("../autosave");
const router = express_1.default.Router();
const parser = new dxf_parser_1.default();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        // Kiểm tra nếu thư mục không tồn tại thì tạo mới
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage });
const pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Autocad',
    password: 'kid97yv',
    port: 5432,
});
router.get('/upload', (req, res) => {
    res.render('upload');
});
router.post('/upload', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const filePath = path_1.default.join(__dirname, '../uploads/', ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || '');
    const userId = req.session.userId;
    console.log('userid : ', userId);
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
    }
    if (path_1.default.extname(req.file.filename) !== '.dxf') {
        res.status(400).send('Please upload a valid DXF file.');
        return;
    }
    try {
        const fileContent = fs_1.default.readFileSync(filePath, 'utf-8');
        const dxfData = parser.parseSync(fileContent);
        if (!dxfData || !dxfData.entities) {
            console.error('Error parsing DXF file: No data returned.');
            res.status(500).send('Error parsing DXF file: No data returned.');
            return;
        }
        const hasHeader = dxfData.header && Object.keys(dxfData.header).length > 0;
        const hasTables = dxfData.tables && Object.keys(dxfData.tables).length > 0;
        const hasBlocks = dxfData.blocks && Object.keys(dxfData.blocks).length > 0;
        if (!hasHeader || !hasTables || !hasBlocks) {
            console.error('Invalid DXF file: Missing required sections.');
            res.status(400).send('Invalid DXF file: Please upload a complete DXF file with header, tables, and blocks.');
            return;
        }
        req.session.filePath = filePath; // Lưu đường dẫn file
        req.session.fileName = req.file.filename; // Lưu tên file
        //   const warnings = []; 
        // //   if (dxfData.warnings && dxfData.warnings.length > 0) {
        // //       warnings.push(...dxfData.warnings);
        // //   }
        //   if (warnings.length > 0) {
        //       console.error('Warnings found in DXF file:', warnings);
        //       res.status(400).send('Invalid DXF file: Warnings found. Please check the file structure.');
        //       return;
        //   }
        yield pool.query('INSERT INTO "Files" (user_id, file_name, file_path, uploaded_at) VALUES ($1, $2, $3, NOW())', [userId, req.file.filename, filePath]);
        const entitiesOnly = {
            entities: dxfData.entities,
        };
        const entitiesFileName = `entities_only_${req.file.filename}`;
        const entitiesFilePath = path_1.default.join(__dirname, '../uploads/', entitiesFileName);
        fs_1.default.writeFileSync(entitiesFilePath, JSON.stringify(entitiesOnly, null, 2));
        if (!res.headersSent) {
            const readLink = `/read-dxf/${encodeURIComponent(req.file.filename)}`;
            const downloadLink = `/download/${encodeURIComponent(entitiesFileName)}`;
            res.send(`
                <h1>File Uploaded Successfully</h1>
                <p><a href="${readLink}">Click here to read the DXF file</a></p>
                <p><a href="${downloadLink}">Click here to download the DXF file</a></p>
                <p><a href="/upload">Back to Upload Page</a></p> 
            `);
        }
    }
    catch (err) {
        console.error('Error processing file:', err);
        if (!res.headersSent) {
            res.status(500).send('Error processing file.');
            return;
        }
    }
}));
router.post('/autosave', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, autosave_1.startAutosave)(req); // Gọi hàm để bắt đầu autosave
    // Trả về phản hồi ngay lập tức
    res.status(200).send('Autosave initiated.');
}));
// router.post('/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
//     const filePath = path.join(__dirname, '../uploads/', req.file?.filename || '');
//     const userId = (req.session as any).userId;
//     const fileContent = fs.readFileSync(filePath, 'utf-8');
//     const dxfData = parser.parseSync(fileContent);
//     console.log('User ID:', userId);
// if (!req.file) {
//         res.status(400).send('No file uploaded.');
//         return;
//     }
//     if (path.extname(req.file.filename) !== '.dxf') {
//         res.status(400).send('Please upload a valid DXF file.');
//         return;
//     }
//         try {
//             if (!dxfData || !dxfData.entities) {
//                 console.error('Error parsing DXF file: No data returned.');
//                 res.status(500).send('Error parsing DXF file: No data returned.');
//                 return;
//             }
//             // Lưu thông tin về file vào bảng "Files"
//             await pool.query(
//                 'INSERT INTO "Files" (user_id, file_name, file_path, uploaded_at) VALUES ($1, $2, $3, NOW())',
//                 [userId, req.file.filename, filePath]
//             );
//             console.log('File info saved to database successfully.');
//             const readLink = `/read-dxf/${encodeURIComponent(req.file.filename)}`;
//             const downloadLink = `/download/${encodeURIComponent(req.file.filename)}`;
//             if (!res.headersSent) {
//                 res.send(`
//                     <h1>File Uploaded Successfully</h1>
//                     <p><a href="${readLink}">Click here to read the DXF file</a></p>
//                     <p><a href="${downloadLink}">Click here to download the DXF file</a></p>
//                 `);
//             }
//         } catch (err) {
//             console.error('Error processing file or saving file info:', err);
//             if (!res.headersSent) {
//                 res.status(500).send('Error processing file or saving file info.');
//                 return;
//             }
//         }})
//     fs.readFile(filePath, 'utf8', async (err: NodeJS.ErrnoException | null, data: string) => {
//         if (err) {
//             res.status(500).send('Error reading file.');
//             return;
//         }
//         try {
//             const dxfData = parser.parseSync(data);
//             if (!dxfData) {
//                 res.status(500).send('Error parsing DXF file: No data returned.');
//                 return;
//             }
//             const entities = dxfData.entities;
//             const tables = dxfData.tables;
//             const isScaleOneToOne = dxfData.header && dxfData.header['$INSUNITS'] === 1;
//             const entitiesHtml = '<h2>DXF Entities:</h2><pre>' + JSON.stringify(entities, null, 2) + '</pre>';
//             const tablesHtml = '<h2>DXF Tables:</h2><pre>' + JSON.stringify(tables, null, 2) + '</pre>';
//             const scaleHtml = `<h2>Scale 1:1:</h2><p>${isScaleOneToOne}</p>`;
//             if (!res.headersSent) {
//                 return res.send(`
//                     <h1>File Uploaded Successfully</h1>
//                     ${scaleHtml}
//                     ${entitiesHtml}
//                     ${tablesHtml}
//                 `);
//             }
//         } catch (parseError) {
//             console.error('Error parsing DXF:', parseError);
//             if (!res.headersSent) {
//                 return res.status(500).send('Error parsing DXF file.');
//             }
//         }
//     });
router.get('/download/:filename', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filename = req.params.filename;
    const filePath = path_1.default.join(__dirname, '../uploads/', filename);
    console.log('File path:', filePath); // Log đường dẫn file
    console.log('File exists:', fs_1.default.existsSync(filePath)); // Kiểm tra sự tồn tại của file
    if (fs_1.default.existsSync(filePath)) {
        res.download(filePath, filename, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Error downloading file.');
            }
        });
    }
    else {
        console.error('File not found:', filePath);
        res.status(404).send('File not found.');
    }
}));
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.status(401).send('Unauthorized');
};
router.get('/history', isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.session.userId; // Lấy ID người dùng từ session
    if (!userId) {
        res.status(401).send('Unauthorized');
    }
    try {
        // const result = await pool.query('SELECT * FROM "Files" ORDER BY uploaded_at DESC');
        const result = yield pool.query('SELECT * FROM "Files" WHERE user_id = $1 ORDER BY uploaded_at DESC', [userId]);
        const files = result.rows;
        // Tạo HTML cho lịch sử file
        let historyHtml = `
            <h3>File Upload History</h3>
            <table border="1">
                <tr>
                    <th>ID</th>
                    <th>File Name</th>
                    <th>Uploaded At</th>
                    <th>Actions</th>
                </tr>`;
        files.forEach(file => {
            historyHtml += `
                <tr>
                    <td>${file.id}</td>
                    <td>${file.file_name}</td>
                    <td>${file.uploaded_at}</td>
                    <td>
                        <a href="/download/${file.file_name}">Download</a>
                    </td>
                </tr>`;
        });
        historyHtml += '</table>';
        res.send(historyHtml);
    }
    catch (err) {
        console.error('Error fetching file history:', err);
        res.status(500).send('Error fetching file history.');
    }
}));
// router.get('/history/:id', async (req: Request, res: Response): Promise<void> => {
//     const fileId = req.params.id;
//     try {
//         const result = await pool.query('SELECT * FROM "Files" WHERE id = $1', [fileId]);
//         const file = result.rows[0];
//         if (!file) {
//          res.status(404).send('File not found');
//         }
//         // Tạo HTML hoặc JSON để gửi về cho client
//         res.send(`
//             <h3>File Details</h3>
//             <p>ID: ${file.id}</p>
//             <p>User ID: ${file.user_id}</p>
//             <p>File Name: ${file.file_name}</p>
//             <p>File Path: ${file.file_path}</p>
//             <p>Uploaded At: ${file.uploaded_at}</p>
//             <a href="/history">Back to History</a>
//         `);
//     } catch (err) {
//         console.error('Error fetching file:', err);
//         res.status(500).send('Error fetching file.');
//     }
// });
router.get('/read-dxf/:filename', (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path_1.default.join(__dirname, '../uploads/', filename);
    const parser = new dxf_parser_1.default();
    fs_1.default.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file.');
        }
        try {
            const dxfData = parser.parseSync(data);
            if (!dxfData) {
                return res.status(500).send('Error parsing DXF file: No data returned.');
            }
            const entities = dxfData.entities;
            const tables = dxfData.tables;
            const isScaleOneToOne = dxfData.header && dxfData.header['$INSUNITS'] === 1;
            const entitiesHtml = '<h2>DXF Entities:</h2><pre>' + JSON.stringify(entities, null, 2) + '</pre>';
            const tablesHtml = '<h2>DXF Tables:</h2><pre>' + JSON.stringify(tables, null, 2) + '</pre>';
            const scaleHtml = `<h2>Scale 1:1:</h2><p>${isScaleOneToOne}</p>`;
            return res.send(`
                    <h1>DXF File Content</h1>
                    ${scaleHtml}
                    ${tablesHtml}
                    ${entitiesHtml}
                `);
        }
        catch (parseError) {
            console.error('Error parsing DXF:', parseError);
            return res.status(500).send('Error parsing DXF file.');
        }
    });
});
exports.default = router;
