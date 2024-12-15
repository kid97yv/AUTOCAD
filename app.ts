import express from 'express';
import path from 'path';
import uploadRoutes from './routes/upload';
import authRoutes from './routes/auth';
import session, { SessionData } from 'express-session';
import { Pool } from 'pg';
import flash from 'express-flash';
import bcrypt from 'bcrypt';
import multer from 'multer';
import autosaveRoutes from './routes/autosaveRoutes'; 
const app = express();
const PORT = 3030;

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'My API',
        version: '1.0.0',
        description: 'This is a simple API with Swagger documentation',
      },
      basePath: '/', 
    },
    apis: ['./routes/*.js'], 
  };
  
  
  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  
  /**
   * @swagger
   * /hello:
   *   get:
   *     description: Returns a hello message
   *     responses:
   *       200:
   *         description: A hello message
   */
  app.get('/hello', (req, res) => {
    res.send('Hello World!');
  });

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Autocad',
    password: 'kid97yv',
    port: 5432,
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your secret', // Thay đổi secret
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());
app.use('/auth', authRoutes);
app.use(autosaveRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', uploadRoutes);
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// Đăng ký Routes
app.get('/auth/register', (req, res) => {
    const errorMessages = req.flash('error') || [];
    res.render('register', { errorMessages });
});
app.get('/upload', (req, res) => {
    res.render('upload');
});
app.post('/api/register', async (req, res) => {
    const { email, username, password, role } = req.body;

    try {
        const existingUser = await pool.query('SELECT * FROM "Users" WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            req.flash('error', 'Tên đăng nhập đã tồn tại!');
            return res.redirect('/auth/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO "Users" (email, username, password, role, created_at) VALUES ($1, $2, $3, $4, NOW())',
            [email, username, hashedPassword, role]
        );

        return res.redirect('/auth/login');
    } catch (err) {
        console.error('Lỗi:', err);
        req.flash('error', 'Đã xảy ra lỗi trong quá trình đăng ký.');
        return res.redirect('/auth/register');
    }
});

// Tải lên Routes

app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

async function getUserFromDatabase(username: string, password: string) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    return result.rows[0]; }

    // app.post('/auth/login', async (req, res) => {
    //     const { username, password } = req.body;
    //     // Kiểm tra thông tin đăng nhập
    //     const user = await getUserFromDatabase(username, password);
    // console.log(user);
    //     if (user) {
    //         (req.session as any).userId = user.id; 
    //         res.send('Login successful!');
    //     } else {
    //         res.status(401).send('Invalid credentials');
    //     }
    // })




// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});