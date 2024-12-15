import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import DxfParser from 'dxf-parser';
import { Pool } from 'pg';
import { startAutosave } from '../autosave';
import { SessionData } from 'express-session';
const router = express.Router();
const parser = new DxfParser();



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        // Kiểm tra nếu thư mục không tồn tại thì tạo mới
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

const pool = new Pool({
    user: 'kid97yv',
    host: 'dpg-ctf66u5ds78s73dmv090-a.singapore-postgres.render.com',
    database: 'autocad',
    password: 'zObYyaejEq8Qsa3xFwKAI0DWUedCa50N',
    port: 5432,
    ssl: { rejectUnauthorized: false }

});


router.get('/upload', (req: Request, res: Response) => {
    res.render('upload'); 
});
router.post('/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
    const filePath = path.join(__dirname, '../uploads/', req.file?.filename || '');
    const userId = (req.session as any).userId;
console.log('userid : ', userId);
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
    }

    if (path.extname(req.file.filename) !== '.dxf') {
        res.status(400).send('Please upload a valid DXF file.');
        return;
    }

    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
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
        (req.session as any).filePath = filePath; // Lưu đường dẫn file
        (req.session as any).fileName = req.file.filename; // Lưu tên file

        //   const warnings = []; 

        // //   if (dxfData.warnings && dxfData.warnings.length > 0) {
        // //       warnings.push(...dxfData.warnings);
        // //   }
  
        //   if (warnings.length > 0) {
        //       console.error('Warnings found in DXF file:', warnings);
        //       res.status(400).send('Invalid DXF file: Warnings found. Please check the file structure.');
        //       return;
        //   }

        await pool.query(
            'INSERT INTO "Files" (user_id, file_name, file_path, uploaded_at) VALUES ($1, $2, $3, NOW())',
            [userId, req.file.filename, filePath]
        );
        const entitiesOnly = {
            entities: dxfData.entities,
        };
        const entitiesFileName = `entities_only_${req.file.filename}`;
        const entitiesFilePath = path.join(__dirname, '../uploads/', entitiesFileName);
        fs.writeFileSync(entitiesFilePath, JSON.stringify(entitiesOnly, null, 2));


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
    } catch (err) {
        console.error('Error processing file:', err);
        if (!res.headersSent) {
            res.status(500).send('Error processing file.');
            return;
        }
    }
});

router.post('/autosave', async (req: Request, res: Response): Promise<void> => {
    startAutosave(req); // Gọi hàm để bắt đầu autosave

    // Trả về phản hồi ngay lập tức
    res.status(200).send('Autosave initiated.');
});
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



    router.get('/download/:filename', async (req: Request, res: Response): Promise<void> => {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../uploads/', filename);
    
        console.log('File path:', filePath); // Log đường dẫn file
        console.log('File exists:', fs.existsSync(filePath)); // Kiểm tra sự tồn tại của file
    
        if (fs.existsSync(filePath)) {
            res.download(filePath, filename, (err) => {
                if (err) {
                    console.error('Error downloading file:', err);
                    res.status(500).send('Error downloading file.');
                }
            });
        } else {
            console.error('File not found:', filePath);
            res.status(404).send('File not found.');
        }
    });
    const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
        if ((req.session as any).userId) {
            return next(); 
        }
        res.status(401).send('Unauthorized'); 
    };
    
    
    router.get('/history', isAuthenticated,async (req: Request, res: Response): Promise<void> => {

        const userId = (req.session as any).userId; // Lấy ID người dùng từ session

        if (!userId) {
         res.status(401).send('Unauthorized');
        }

        try {
            // const result = await pool.query('SELECT * FROM "Files" ORDER BY uploaded_at DESC');
            const result = await pool.query('SELECT * FROM "Files" WHERE user_id = $1 ORDER BY uploaded_at DESC', [userId]);
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
        } catch (err) {
            console.error('Error fetching file history:', err);
            res.status(500).send('Error fetching file history.');
        }
    });
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

    router.get('/read-dxf/:filename', (req: Request, res: Response) => {
        const filename = decodeURIComponent(req.params.filename);
        const filePath = path.join(__dirname, '../uploads/', filename);
        const parser = new DxfParser();
    
        fs.readFile(filePath, 'utf8', (err: NodeJS.ErrnoException | null, data: string) => {
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
            } catch (parseError) {
                console.error('Error parsing DXF:', parseError);
                return res.status(500).send('Error parsing DXF file.');
            }
        });
    

});

export default router;