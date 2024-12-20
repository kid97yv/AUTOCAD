"use strict";
// import express, { NextFunction, Request, Response } from 'express';
// import multer from 'multer';
// import fs from 'fs';
// import path from 'path';
// import DxfParser from 'dxf-parser';
// import { Pool } from 'pg';
// import { startAutosave } from '../autosave';
// import { SessionData } from 'express-session';
// const router = express.Router();
// const parser = new DxfParser();
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
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const dir = 'uploads/';
//         // Kiểm tra nếu thư mục không tồn tại thì tạo mới
//         if (!fs.existsSync(dir)){
//             fs.mkdirSync(dir);
//         }
//         cb(null, dir);
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     }
// });
// const upload = multer({ storage });
// const pool = new Pool({
//     user: 'kid97yv',
//     host: 'dpg-ctf66u5ds78s73dmv090-a.singapore-postgres.render.com',
//     database: 'autocad',
//     password: 'zObYyaejEq8Qsa3xFwKAI0DWUedCa50N',
//     port: 5432,
//     ssl: { rejectUnauthorized: false }
// });
// router.get('/upload', (req: Request, res: Response) => {
//     res.render('upload'); 
// });
// router.post('/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
//     const filePath = path.join(__dirname, '../uploads/', req.file?.filename || '');
//     const userId = (req.session as any).userId;
// console.log('userid : ', userId);
//     if (!req.file) {
//         res.status(400).send('No file uploaded.');
//         return;
//     }
//     if (path.extname(req.file.filename) !== '.dxf') {
//         res.status(400).send('Please upload a valid DXF file.');
//         return;
//     }
//     try {
//         const fileContent = fs.readFileSync(filePath, 'utf-8');
//         const dxfData = parser.parseSync(fileContent);
//         if (!dxfData || !dxfData.entities) {
//             console.error('Error parsing DXF file: No data returned.');
//             res.status(500).send('Error parsing DXF file: No data returned.');
//             return;
//         }
//         const hasHeader = dxfData.header && Object.keys(dxfData.header).length > 0;
//         const hasTables = dxfData.tables && Object.keys(dxfData.tables).length > 0;
//         const hasBlocks = dxfData.blocks && Object.keys(dxfData.blocks).length > 0;
//         if (!hasHeader || !hasTables || !hasBlocks) {
//             console.error('Invalid DXF file: Missing required sections.');
//             res.status(400).send('Invalid DXF file: Please upload a complete DXF file with header, tables, and blocks.');
//             return;
//         }
//         (req.session as any).filePath = filePath; // Lưu đường dẫn file
//         (req.session as any).fileName = req.file.filename; // Lưu tên file
//         //   const warnings = []; 
//         // //   if (dxfData.warnings && dxfData.warnings.length > 0) {
//         // //       warnings.push(...dxfData.warnings);
//         // //   }
//         //   if (warnings.length > 0) {
//         //       console.error('Warnings found in DXF file:', warnings);
//         //       res.status(400).send('Invalid DXF file: Warnings found. Please check the file structure.');
//         //       return;
//         //   }
//         await pool.query(
//             'INSERT INTO "Files" (user_id, file_name, file_path, uploaded_at) VALUES ($1, $2, $3, NOW())',
//             [userId, req.file.filename, filePath]
//         );
//         const entitiesOnly = {
//             entities: dxfData.entities,
//         };
//         const entitiesFileName = `entities_only_${req.file.filename}`;
//         const entitiesFilePath = path.join(__dirname, '../uploads/', entitiesFileName);
//         fs.writeFileSync(entitiesFilePath, JSON.stringify(entitiesOnly, null, 2));
//         if (!res.headersSent) {
//             const readLink = `/read-dxf/${encodeURIComponent(req.file.filename)}`;
//             const downloadLink = `/download/${encodeURIComponent(entitiesFileName)}`;
//             res.send(`
//                 <h1>File Uploaded Successfully</h1>
//                 <p><a href="${readLink}">Click here to read the DXF file</a></p>
//                 <p><a href="${downloadLink}">Click here to download the DXF file</a></p>
//                 <p><a href="/upload">Back to Upload Page</a></p> 
//             `);
//         }
//     } catch (err) {
//         console.error('Error processing file:', err);
//         if (!res.headersSent) {
//             res.status(500).send('Error processing file.');
//             return;
//         }
//     }
// });
// router.post('/autosave', async (req: Request, res: Response): Promise<void> => {
//     startAutosave(req); // Gọi hàm để bắt đầu autosave
//     // Trả về phản hồi ngay lập tức
//     res.status(200).send('Autosave initiated.');
// });
// // router.post('/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
// //     const filePath = path.join(__dirname, '../uploads/', req.file?.filename || '');
// //     const userId = (req.session as any).userId;
// //     const fileContent = fs.readFileSync(filePath, 'utf-8');
// //     const dxfData = parser.parseSync(fileContent);
// //     console.log('User ID:', userId);
// // if (!req.file) {
// //         res.status(400).send('No file uploaded.');
// //         return;
// //     }
// //     if (path.extname(req.file.filename) !== '.dxf') {
// //         res.status(400).send('Please upload a valid DXF file.');
// //         return;
// //     }
// //         try {
// //             if (!dxfData || !dxfData.entities) {
// //                 console.error('Error parsing DXF file: No data returned.');
// //                 res.status(500).send('Error parsing DXF file: No data returned.');
// //                 return;
// //             }
// //             // Lưu thông tin về file vào bảng "Files"
// //             await pool.query(
// //                 'INSERT INTO "Files" (user_id, file_name, file_path, uploaded_at) VALUES ($1, $2, $3, NOW())',
// //                 [userId, req.file.filename, filePath]
// //             );
// //             console.log('File info saved to database successfully.');
// //             const readLink = `/read-dxf/${encodeURIComponent(req.file.filename)}`;
// //             const downloadLink = `/download/${encodeURIComponent(req.file.filename)}`;
// //             if (!res.headersSent) {
// //                 res.send(`
// //                     <h1>File Uploaded Successfully</h1>
// //                     <p><a href="${readLink}">Click here to read the DXF file</a></p>
// //                     <p><a href="${downloadLink}">Click here to download the DXF file</a></p>
// //                 `);
// //             }
// //         } catch (err) {
// //             console.error('Error processing file or saving file info:', err);
// //             if (!res.headersSent) {
// //                 res.status(500).send('Error processing file or saving file info.');
// //                 return;
// //             }
// //         }})
// //     fs.readFile(filePath, 'utf8', async (err: NodeJS.ErrnoException | null, data: string) => {
// //         if (err) {
// //             res.status(500).send('Error reading file.');
// //             return;
// //         }
// //         try {
// //             const dxfData = parser.parseSync(data);
// //             if (!dxfData) {
// //                 res.status(500).send('Error parsing DXF file: No data returned.');
// //                 return;
// //             }
// //             const entities = dxfData.entities;
// //             const tables = dxfData.tables;
// //             const isScaleOneToOne = dxfData.header && dxfData.header['$INSUNITS'] === 1;
// //             const entitiesHtml = '<h2>DXF Entities:</h2><pre>' + JSON.stringify(entities, null, 2) + '</pre>';
// //             const tablesHtml = '<h2>DXF Tables:</h2><pre>' + JSON.stringify(tables, null, 2) + '</pre>';
// //             const scaleHtml = `<h2>Scale 1:1:</h2><p>${isScaleOneToOne}</p>`;
// //             if (!res.headersSent) {
// //                 return res.send(`
// //                     <h1>File Uploaded Successfully</h1>
// //                     ${scaleHtml}
// //                     ${entitiesHtml}
// //                     ${tablesHtml}
// //                 `);
// //             }
// //         } catch (parseError) {
// //             console.error('Error parsing DXF:', parseError);
// //             if (!res.headersSent) {
// //                 return res.status(500).send('Error parsing DXF file.');
// //             }
// //         }
// //     });
//     router.get('/download/:filename', async (req: Request, res: Response): Promise<void> => {
//         const filename = req.params.filename;
//         const filePath = path.join(__dirname, '../uploads/', filename);
//         console.log('File path:', filePath); // Log đường dẫn file
//         console.log('File exists:', fs.existsSync(filePath)); // Kiểm tra sự tồn tại của file
//         if (fs.existsSync(filePath)) {
//             res.download(filePath, filename, (err) => {
//                 if (err) {
//                     console.error('Error downloading file:', err);
//                     res.status(500).send('Error downloading file.');
//                 }
//             });
//         } else {
//             console.error('File not found:', filePath);
//             res.status(404).send('File not found.');
//         }
//     });
//     const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
//         if ((req.session as any).userId) {
//             return next(); 
//         }
//         res.status(401).send('Unauthorized'); 
//     };
//     router.get('/history', isAuthenticated,async (req: Request, res: Response): Promise<void> => {
//         const userId = (req.session as any).userId; // Lấy ID người dùng từ session
//         if (!userId) {
//          res.status(401).send('Unauthorized');
//         }
//         try {
//             // const result = await pool.query('SELECT * FROM "Files" ORDER BY uploaded_at DESC');
//             const result = await pool.query('SELECT * FROM "Files" WHERE user_id = $1 ORDER BY uploaded_at DESC', [userId]);
//             const files = result.rows;
//             // Tạo HTML cho lịch sử file
//             let historyHtml = `
//             <h3>File Upload History</h3>
//             <table border="1">
//                 <tr>
//                     <th>ID</th>
//                     <th>File Name</th>
//                     <th>Uploaded At</th>
//                     <th>Actions</th>
//                 </tr>`;
//         files.forEach(file => {
//             historyHtml += `
//                 <tr>
//                     <td>${file.id}</td>
//                     <td>${file.file_name}</td>
//                     <td>${file.uploaded_at}</td>
//                     <td>
//                         <a href="/download/${file.file_name}">Download</a>
//                     </td>
//                 </tr>`;
//         });
//             historyHtml += '</table>';
//             res.send(historyHtml);
//         } catch (err) {
//             console.error('Error fetching file history:', err);
//             res.status(500).send('Error fetching file history.');
//         }
//     });
//     // router.get('/history/:id', async (req: Request, res: Response): Promise<void> => {
//     //     const fileId = req.params.id;
//     //     try {
//     //         const result = await pool.query('SELECT * FROM "Files" WHERE id = $1', [fileId]);
//     //         const file = result.rows[0];
//     //         if (!file) {
//     //          res.status(404).send('File not found');
//     //         }
//     //         // Tạo HTML hoặc JSON để gửi về cho client
//     //         res.send(`
//     //             <h3>File Details</h3>
//     //             <p>ID: ${file.id}</p>
//     //             <p>User ID: ${file.user_id}</p>
//     //             <p>File Name: ${file.file_name}</p>
//     //             <p>File Path: ${file.file_path}</p>
//     //             <p>Uploaded At: ${file.uploaded_at}</p>
//     //             <a href="/history">Back to History</a>
//     //         `);
//     //     } catch (err) {
//     //         console.error('Error fetching file:', err);
//     //         res.status(500).send('Error fetching file.');
//     //     }
//     // });
//     router.get('/read-dxf/:filename', (req: Request, res: Response) => {
//         const filename = decodeURIComponent(req.params.filename);
//         const filePath = path.join(__dirname, '../uploads/', filename);
//         const parser = new DxfParser();
//         fs.readFile(filePath, 'utf8', (err: NodeJS.ErrnoException | null, data: string) => {
//             if (err) {
//                 console.error('Error reading file:', err);
//                 return res.status(500).send('Error reading file.');
//             }
//             try {
//                 const dxfData = parser.parseSync(data);
//                 if (!dxfData) {
//                     return res.status(500).send('Error parsing DXF file: No data returned.');
//                 }
//                 const entities = dxfData.entities;
//                 const tables = dxfData.tables;
//                 const isScaleOneToOne = dxfData.header && dxfData.header['$INSUNITS'] === 1;
//                 const entitiesHtml = '<h2>DXF Entities:</h2><pre>' + JSON.stringify(entities, null, 2) + '</pre>';
//                 const tablesHtml = '<h2>DXF Tables:</h2><pre>' + JSON.stringify(tables, null, 2) + '</pre>';
//                 const scaleHtml = `<h2>Scale 1:1:</h2><p>${isScaleOneToOne}</p>`;
//                 return res.send(`
//                     <h1>DXF File Content</h1>
//                     ${scaleHtml}
//                     ${tablesHtml}
//                     ${entitiesHtml}
//                 `);
//             } catch (parseError) {
//                 console.error('Error parsing DXF:', parseError);
//                 return res.status(500).send('Error parsing DXF file.');
//             }
//         });
// });
// export default router;
const dxf_parser_1 = __importDefault(require("dxf-parser"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const path_1 = __importDefault(require("path"));
const autosave_1 = require("../autosave");
const stream_1 = require("stream");
// Khởi tạo router và parser
const router = express_1.default.Router();
const parser = new dxf_parser_1.default();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
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
    user: 'kid97yv',
    host: 'dpg-ctf66u5ds78s73dmv090-a.singapore-postgres.render.com',
    database: 'autocad',
    password: 'zObYyaejEq8Qsa3xFwKAI0DWUedCa50N',
    port: 5432,
    ssl: { rejectUnauthorized: false }
});
/**
 * @swagger
 * /upload:
 *   post:
 *     summary: "* Upload a DXF file"
 *     description: "* Uploads a DXF file, parses it, and stores it in the database."
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         description: "* The DXF file to upload."
 *         required: true
 *         type: file
 *       - in: formData
 *         name: userId
 *         description: "* The user ID for associating the file."
 *         required: false   # Chuyển từ true thành false
 *         type: string
 *     responses:
 *       200:
 *         description: "* File uploaded successfully."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File uploaded successfully"
 *                 file:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                       example: "example.dxf"
 *                     filePath:
 *                       type: string
 *                       example: "/uploads/example.dxf"
 *                     readLink:
 *                       type: string
 *                       example: "/read-dxf/example.dxf"
 *                     downloadLink:
 *                       type: string
 *                       example: "/download/example.dxf"
 *       400:
 *         description: "* Invalid file or missing required sections in the DXF file."
 *       500:
 *         description: "* Error processing file."
 */
router.post('/upload', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const filePath = path_1.default.join(__dirname, '../uploads/', ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || '');
    const userId = req.session.userId;
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded.' });
        return;
    }
    if (path_1.default.extname(req.file.filename) !== '.dxf') {
        res.status(400).json({ error: 'Please upload a valid DXF file.' });
        return;
    }
    try {
        const fileContent = fs_1.default.readFileSync(filePath, 'utf-8');
        const dxfData = parser.parseSync(fileContent);
        if (!dxfData || !dxfData.entities) {
            console.error('Error parsing DXF file: No data returned.');
            res.status(500).json({ error: 'Error parsing DXF file: No data returned.' });
            return;
        }
        // Kiểm tra tệp đã tồn tại trong cơ sở dữ liệu
        const checkFileExists = yield pool.query('SELECT * FROM "Files" WHERE file_name = $1', [req.file.filename]);
        if (checkFileExists.rows.length > 0) {
            // Nếu tệp đã tồn tại, thay đổi tên tệp (ví dụ: thêm UUID hoặc thời gian)
            const newFileName = `${Date.now()}_${req.file.filename}`; // Thêm thời gian vào tên tệp
            const newFilePath = path_1.default.join(__dirname, '../uploads/', newFileName);
            // Di chuyển tệp cũ sang tên mới
            fs_1.default.renameSync(filePath, newFilePath);
            // Cập nhật lại đường dẫn trong cơ sở dữ liệu
            yield pool.query('INSERT INTO "Files" (user_id, file_name, file_path, uploaded_at) VALUES ($1, $2, $3, NOW()) RETURNING id', [userId, newFileName, newFilePath]);
            res.status(200).json({
                message: 'File uploaded successfully',
                file: {
                    filename: newFileName,
                    filePath: newFilePath,
                    readLink: `/read-dxf/${encodeURIComponent(newFileName)}`,
                    downloadLink: `/download/${newFileName}`
                }
            });
        }
        else {
            // Nếu tệp chưa tồn tại, lưu vào cơ sở dữ liệu bình thường
            yield pool.query('INSERT INTO "Files" (user_id, file_name, file_path, uploaded_at) VALUES ($1, $2, $3, NOW()) RETURNING id', [userId, req.file.filename, filePath]);
            res.status(200).json({
                message: 'File uploaded successfully',
                file: {
                    filename: req.file.filename,
                    filePath: filePath,
                    readLink: `/read-dxf/${encodeURIComponent(req.file.filename)}`,
                    downloadLink: `/download/${req.file.filename}`
                }
            });
        }
    }
    catch (err) {
        console.error('Error processing file:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Error processing file.' });
        }
    }
}));
/**
 * @swagger
 * /autosave:
 *   post:
 *     description: Start autosave process
 *     responses:
 *       200:
 *         description: Autosave initiated
 */
router.post('/autosave', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, autosave_1.startAutosave)(req, res);
    res.status(200).send('Autosave initiated.');
}));
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.status(401).send('Unauthorized');
};
// router.get('/download/:id', async (req: Request, res: Response): Promise<void> => {
//     const fileId = req.params.id;
//     try {
//         const result = await pool.query('SELECT file_name, file_path FROM "Files" WHERE id = $1', [fileId]);
//         if (result.rows.length === 0) {
//              res.status(404).send('File not found.');
//         }
//         const { file_name, file_path } = result.rows[0];
//         const fullPath = file_path;
//         if (fs.existsSync(fullPath)) {
//             res.setHeader('Content-Disposition', `attachment; filename="${file_name}"`);
//              res.download(fullPath, file_name, (err) => {
//                 if (err) {
//                     console.error('Error downloading file:', err);
//                     return res.status(500).send('Error downloading file.');
//                 }
//             });
//         } else {
//             console.error('File not found on server:', fullPath);
//              res.status(404).send('File not found on server.');
//         }
//     } catch (error) {
//         console.error('Database error:', error);
//          res.status(500).send('Error retrieving file information.');
//     }
// });
/**
/**
* @swagger
* /download/{id}:
*   get:
*     description: Download a modified DXF file with filtered entities
*     parameters:
*       - in: path
*         name: id
*         required: true
*         type: string
*         description: The unique ID of the DXF file to download (required)
*     responses:
*       200:
*         description: File downloaded successfully
*         content:
*           application/dxf:
*             schema:
*               type: string
*               format: binary
*       404:
*         description: File not found
*       500:
*         description: Error retrieving or processing the file
*/
router.get('/download/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileId = req.params.id;
    try {
        const result = yield pool.query('SELECT file_name, file_path, user_id FROM "Files" WHERE id = $1', [fileId]);
        if (result.rows.length === 0) {
            res.status(404).send('File not found.');
            return;
        }
        const { file_name, file_path, user_id } = result.rows[0];
        const fullPath = file_path;
        if (fs_1.default.existsSync(fullPath)) {
            const dxfData = fs_1.default.readFileSync(fullPath, 'utf-8');
            const parsedData = parser.parseSync(dxfData);
            if (!parsedData) {
                res.status(500).send('Error parsing DXF file.');
                return;
            }
            const entities = parsedData.entities.map((entity) => {
                const filteredEntity = {
                    type: entity.type,
                    handle: entity.handle,
                    ownerHandle: entity.ownerHandle,
                    layer: entity.layer,
                    colorIndex: entity.colorIndex,
                    color: entity.color,
                    lineweight: entity.lineweight,
                    center: entity.center,
                    radius: entity.radius
                };
                return filteredEntity;
            });
            const scale = {
                extmin: parsedData.header.$EXTMIN,
                extmax: parsedData.header.$EXTMAX,
                isScaleOneToOne: parsedData.header && parsedData.header['$INSUNITS'] === 1
            };
            const modifiedDxfData = createModifiedDxfString(user_id, scale, entities);
            const buffer = Buffer.from(modifiedDxfData, 'utf-8');
            const stream = stream_1.Readable.from(buffer);
            const newFileName = `Entities_${file_name}`;
            res.setHeader('Content-Disposition', `attachment; filename="${newFileName}"`);
            res.setHeader('Content-Type', 'application/dxf');
            stream.pipe(res);
        }
        else {
            res.status(404).send('File not found on server.');
        }
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error retrieving file.');
    }
}));
function createModifiedDxfString(user, scale, entities) {
    const dxfJson = {
        user: user,
        scale: scale,
        entities: entities
    };
    return JSON.stringify(dxfJson, null, 2);
}
/**
 * @swagger
 * /history/{userId?}:
 *   get:
 *     summary: "Get the history of uploaded files for a specific user"
 *     description: "Fetches the list of uploaded files for a specific user. If userId is not provided, it fetches the files of the authenticated user. The response includes details of files that do not exist."
 *     security:
 *       - bearerAuth: []  # Nếu bạn sử dụng JWT hoặc cơ chế xác thực khác
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: "The ID of the user whose files history is being fetched. If not provided, the authenticated user's files will be fetched."
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "A list of uploaded files and missing files information"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: "Indicates if the request was successful."
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       fileName:
 *                         type: string
 *                       uploadedAt:
 *                         type: string
 *                       user:
 *                         type: string
 *                       downloadUrl:
 *                         type: string
 *                         description: "The URL to download the file"
 *                 missingFiles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fileName:
 *                         type: string
 *                       fullPath:
 *                         type: string
 *                         description: "The full path of the file that does not exist."
 *                       uploadedAt:
 *                         type: string
 *                       user:
 *                         type: string
 *       401:
 *         description: "Unauthorized - User is not authenticated."
 *       500:
 *         description: "Internal server error while fetching file history."
 */
// router.get('/history', isAuthenticated, async (req: Request, res: Response): Promise<void> => {
//     const userId = (req.session as any).userId;
//     if (!userId) {
//         res.status(401).send('Unauthorized');
//         return;
//     }
//     try {
//         // Truy vấn các tệp của người dùng
//         const result = await pool.query('SELECT * FROM "Files" WHERE user_id = $1 ORDER BY uploaded_at DESC', [userId]);
//         const files = result.rows;
//         const historyResponse = [];
//         for (const file of files) {
//             const { file_name, uploaded_at, id, file_path, upload_user } = file;
//             const fullPath = path.resolve(__dirname, 'uploads', file_path);  
//             if (!fs.existsSync(fullPath)) {
//                 console.error(`File not found: ${fullPath}`);
//                 continue; 
//             }
//             // Cập nhật phản hồi chỉ bao gồm thông tin cơ bản và link tải file
//             historyResponse.push({
//                 id,
//                 fileName: file_name,
//                 uploadedAt: uploaded_at,
//                 user: upload_user,
//                 downloadUrl: `/download/${id}`  // Đường dẫn tải file
//             });
//         }
//         res.json(historyResponse);
//     } catch (err) {
//         console.error('Error fetching file history:', err);
//         res.status(500).send('Error fetching file history.');
//     }
// });
// router.get('/history/:userId?', async (req: Request, res: Response): Promise<void> => {
//     const userId = req.params.userId || (req.session as any).userId;
//     if (!userId) {
//         res.status(401).send('Unauthorized');
//         return;
//     }
//     try {
//         // Truy vấn các tệp của người dùng
//         const result = await pool.query('SELECT * FROM "Files" WHERE user_id = $1 ORDER BY uploaded_at DESC', [userId]);
//         const files = result.rows;
//         const historyResponse = [];
//         for (const file of files) {
//             const { file_name, uploaded_at, id, file_path, upload_user } = file;
//             const fullPath = path.resolve(__dirname, 'uploads', file_path);  
//             if (!fs.existsSync(fullPath)) {
//                 console.error(`File not found: ${fullPath}`);
//                 continue; 
//             }
//             historyResponse.push({
//                 id,
//                 fileName: file_name,
//                 uploadedAt: uploaded_at,
//                 user: upload_user,
//                 downloadUrl: `/download/${id}`  
//             });
//         }
//         res.json(historyResponse);
//     } catch (err) {
//         console.error('Error fetching file history:', err);
//         res.status(500).send('Error fetching file history.');
//     }
// });
router.get('/history/:userId?', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId || req.session.userId;
    if (!userId) {
        res.status(401).send('Unauthorized');
        return;
    }
    try {
        const result = yield pool.query('SELECT * FROM "Files" WHERE user_id = $1 ORDER BY uploaded_at DESC', [userId]);
        const files = result.rows;
        const historyResponse = [];
        for (const file of files) {
            const { file_name, uploaded_at, id, file_path, upload_user } = file;
            // Tạo đường dẫn đầy đủ
            const fullPath = path_1.default.resolve(__dirname, 'uploads', file_path);
            // Thêm thông tin vào response mà không bỏ qua file nào
            historyResponse.push({
                id,
                fileName: file_name,
                uploadedAt: uploaded_at,
                user: upload_user,
                downloadUrl: `/download/${id}`,
                exists: fs_1.default.existsSync(fullPath), // Thông tin file tồn tại
                fullPath: fullPath // Đường dẫn đầy đủ của file
            });
        }
        // Kiểm tra các file không tồn tại
        const missingFiles = historyResponse.filter(file => !file.exists);
        if (missingFiles.length > 0) {
            // Thêm thông tin về các file không tồn tại vào phản hồi
            res.json({
                success: true,
                files: historyResponse,
                missingFiles: missingFiles.map(file => ({
                    fileName: file.fileName,
                    fullPath: file.fullPath,
                    uploadedAt: file.uploadedAt,
                    user: file.user,
                })),
            });
        }
        else {
            // Nếu không có file nào bị thiếu
            res.json({
                success: true,
                files: historyResponse,
                missingFiles: [],
            });
        }
    }
    catch (err) {
        console.error('Error fetching file history:', err);
        res.status(500).send('Error fetching file history.');
    }
}));
/**
 * @swagger
 * /read-dxf/{fileId}:
 *   get:
 *     summary: "Read the content of a DXF file"
 *     description: "Reads the content of a DXF file and returns the entities and scale information."
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         description: "The ID of the DXF file to read"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "The content of the DXF file"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileId:
 *                   type: string
 *                 fileName:
 *                   type: string
 *                 user:
 *                   type: string
 *                 scale:
 *                   type: object
 *                   properties:
 *                     extmin:
 *                       type: array
 *                       items:
 *                         type: number
 *                     extmax:
 *                       type: array
 *                       items:
 *                         type: number
 *                     isScaleOneToOne:
 *                       type: boolean
 *                 entities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                       handle:
 *                         type: string
 *                       ownerHandle:
 *                         type: string
 *                       layer:
 *                         type: string
 *                       colorIndex:
 *                         type: integer
 *                       color:
 *                         type: integer
 *                       lineweight:
 *                         type: integer
 *                       center:
 *                         type: array
 *                         items:
 *                           type: number
 *                       radius:
 *                         type: number
 *       404:
 *         description: "File not found"
 *       500:
 *         description: "Error reading or parsing the file"
 */
router.get('/read-dxf/:fileId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileId = req.params.fileId;
    try {
        const result = yield pool.query('SELECT * FROM "Files" WHERE id = $1', [fileId]);
        if (result.rows.length === 0) {
            res.status(404).send('File not found.');
        }
        const file = result.rows[0];
        const filePath = file.file_path;
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
                const entities = dxfData.entities.map((entity) => ({
                    type: entity.type,
                    handle: entity.handle,
                    ownerHandle: entity.ownerHandle,
                    layer: entity.layer,
                    colorIndex: entity.colorIndex,
                    color: entity.color,
                    lineweight: entity.lineweight,
                    center: entity.center,
                    radius: entity.radius
                }));
                const scale = {
                    extmin: dxfData.header.$EXTMIN,
                    extmax: dxfData.header.$EXTMAX,
                    isScaleOneToOne: dxfData.header && dxfData.header['$INSUNITS'] === 1
                };
                res.json({
                    fileId: fileId,
                    fileName: file.file_name,
                    user: file.upload_user,
                    scale,
                    entities
                });
            }
            catch (parseError) {
                console.error('Error parsing DXF:', parseError);
                return res.status(500).send('Error parsing DXF file.');
            }
        });
    }
    catch (err) {
        console.error('Error fetching file from database:', err);
        res.status(500).send('Error fetching file from database.');
    }
}));
exports.default = router;
