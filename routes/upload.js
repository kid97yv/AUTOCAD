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
const dxf_parser_1 = __importDefault(require("dxf-parser"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const path_1 = __importDefault(require("path"));
const autosave_1 = require("../autosave");
const filereader_1 = __importDefault(require("filereader"));
const cors_1 = __importDefault(require("cors"));
// Khởi tạo router và parser
const router = express_1.default.Router();
const parser = new dxf_parser_1.default();
router.use((0, cors_1.default)({
    origin: '*', // Cho phép tất cả các miền
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP được phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
    credentials: true // Cho phép cookie và thông tin xác thực khác
}));
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
 *     summary: "Upload a DXF file"
 *     description: "Uploads a DXF file, parses it, and stores it in the database. Each file will be saved with a unique name using a timestamp to prevent overwriting."
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         description: "The DXF file to upload."
 *         required: true
 *         type: file
 *       - in: formData
 *         name: userId
 *         description: "The user ID for associating the file."
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: "File uploaded successfully."
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
 *                     id:
 *                       type: integer
 *                       example: 123
 *                     filename:
 *                       type: string
 *                       example: "1672447712345_example.dxf"
 *                     filePath:
 *                       type: string
 *                       example: "/uploads/1672447712345_example.dxf"
 *                     readLink:
 *                       type: string
 *                       example: "/read-dxf/1672447712345_example.dxf"
 *                     downloadLink:
 *                       type: string
 *                       example: "/download/123"
 *       400:
 *         description: "Invalid file or missing required sections in the DXF file."
 *       500:
 *         description: "Error processing file."
 */
router.post('/upload', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.session.userId;
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded.' });
        return;
    }
    if (path_1.default.extname(req.file.filename) !== '.dxf') {
        res.status(400).json({ error: 'Please upload a valid DXF file.' });
        return;
    }
    const timestamp = Date.now(); // Thêm dấu thời gian
    const newFileName = `${timestamp}_${req.file.filename}`;
    const newFilePath = path_1.default.join(__dirname, '../uploads/', newFileName);
    try {
        const fileContent = fs_1.default.readFileSync(req.file.path, 'utf-8'); // Đọc tệp từ đường dẫn tạm thời
        const dxfData = parser.parseSync(fileContent);
        if (!dxfData || !dxfData.entities) {
            console.error('Error parsing DXF file: No data returned.');
            res.status(500).json({ error: 'Error parsing DXF file: No data returned.' });
            return;
        }
        // Di chuyển tệp tin đến đường dẫn mới với tên mới
        fs_1.default.renameSync(req.file.path, newFilePath);
        const result = yield pool.query('INSERT INTO "Files" (user_id, file_name, file_path, uploaded_at) VALUES ($1, $2, $3, NOW()) RETURNING id', [userId, newFileName, newFilePath]);
        const fileId = result.rows[0].id;
        res.status(200).json({
            message: 'File uploaded successfully',
            file: {
                id: fileId,
                filename: newFileName,
                filePath: newFilePath,
                readLink: `/read-dxf/${encodeURIComponent(newFileName)}`,
                downloadLink: `/download/${fileId}`
            }
        });
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
/**
* @swagger
* /download/{id}:
*   get:
*     description: Download the original DXF file without any modifications
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
*           application/octet-stream:  # Thay đổi loại nội dung cho file gốc
*             schema:
*               type: string
*               format: binary
*       404:
*         description: File not found
*       500:
*         description: Error retrieving the file
*/
router.get('/download/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileId = req.params.id;
    try {
        const result = yield pool.query('SELECT file_name, file_path FROM "Files" WHERE id = $1', [fileId]);
        if (result.rows.length === 0) {
            res.status(404).send('File not found.');
            return;
        }
        const { file_name, file_path } = result.rows[0];
        const fullPath = file_path;
        if (fs_1.default.existsSync(fullPath)) {
            // Đặt tên file và header cho download
            res.setHeader('Content-Disposition', `attachment; filename="${file_name}"`);
            res.setHeader('Content-Type', 'application/octet-stream');
            // Tải file xuống
            const fileStream = fs_1.default.createReadStream(fullPath);
            fileStream.pipe(res).on('error', (err) => {
                console.error('Error streaming file:', err);
                res.status(500).send('Error downloading file.');
            });
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
 *     description: "Fetches the list of uploaded files for a specific user. If userId is not provided, it fetches the files of the authenticated user. The response includes details of files that may not exist."
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
 *                         format: date-time
 *                         description: "The date and time when the file was uploaded."
 *                       user:
 *                         type: string
 *                       downloadUrl:
 *                         type: string
 *                         description: "The URL to download the file."
 *                       exists:
 *                         type: boolean
 *                         description: "Indicates if the file exists on the server."
 *                       fullPath:
 *                         type: string
 *                         description: "The full path of the file on the server."
 *                 missingFiles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fileName:
 *                         type: string
 *                         description: "The name of the missing file."
 *                       fullPath:
 *                         type: string
 *                         description: "The full path of the file that does not exist."
 *                       uploadedAt:
 *                         type: string
 *                         format: date-time
 *                         description: "The date and time when the file was supposed to be uploaded."
 *                       user:
 *                         type: string
 *       401:
 *         description: "Unauthorized - User is not authenticated."
 *       500:
 *         description: "Internal server error while fetching file history."
 */
router.get('/history/:userId?', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId || req.session.userId;
    if (!userId) {
        res.status(401).send('Unauthorized');
        return;
    }
    try {
        const result = yield pool.query('SELECT * FROM "Files" WHERE user_id = $1 ORDER BY uploaded_at DESC', [userId]);
        const files = result.rows;
        const historyResponse = files.map(file => {
            const { file_name, uploaded_at, id, file_path, upload_user } = file;
            // Tạo đường dẫn đầy đủ
            const fullPath = path_1.default.resolve(__dirname, 'uploads', file_path);
            return {
                id,
                fileName: file_name,
                uploadedAt: uploaded_at,
                user: upload_user,
                downloadUrl: `/download/${id}`,
                exists: fs_1.default.existsSync(fullPath), // Kiểm tra file có tồn tại không
                fullPath: fullPath // Đường dẫn đầy đủ của file
            };
        });
        res.json({
            success: true,
            files: historyResponse,
        });
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
 *     description: "Reads the content of a DXF file and returns the filtered entities (only LINE type) and basic file information."
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         description: "The ID of the DXF file to read"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "The content of the DXF file, including filtered entities"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileId:
 *                   type: string
 *                   description: "The ID of the DXF file"
 *                 fileName:
 *                   type: string
 *                   description: "The name of the DXF file"
 *                 user:
 *                   type: string
 *                   description: "The user who uploaded the file"
 *                 entities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         description: "The type of the entity (should be LINE)"
 *                       handle:
 *                         type: string
 *                         description: "The handle of the entity"
 *                       ownerHandle:
 *                         type: string
 *                         description: "The owner handle of the entity"
 *                       layer:
 *                         type: string
 *                         description: "The layer of the entity"
 *                       colorIndex:
 *                         type: integer
 *                         description: "The color index of the entity"
 *                       color:
 *                         type: integer
 *                         description: "The color of the entity"
 *                       lineweight:
 *                         type: integer
 *                         description: "The line weight of the entity"
 *                       center:
 *                         type: array
 *                         items:
 *                           type: number
 *                         description: "The center point of the entity (if applicable)"
 *                       radius:
 *                         type: number
 *                         description: "The radius of the entity (if applicable)"
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
            return;
        }
        const file = result.rows[0];
        const filePath = file.file_path;
        const parser = new dxf_parser_1.default();
        const fileReader = new filereader_1.default();
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
                const entities = dxfData.entities
                    .filter((entity) => entity.type === 'LINE');
                res.json({
                    fileId,
                    fileName: file.file_name,
                    user: file.upload_user,
                    entities,
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
