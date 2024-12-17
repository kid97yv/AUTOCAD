import express from 'express';
import path from 'path';
import uploadRoutes from './routes/upload';
import authRoutes from './routes/auth';
import session, { SessionData } from 'express-session';
import { Pool } from 'pg';
import flash from 'express-flash';
// import bcrypt from 'bcrypt';
import bcryptjs from 'bcryptjs';
import swaggerUi from 'swagger-ui-express'; // import swagger-ui-express
import swaggerJSDoc from 'swagger-jsdoc'; // import swagger-jsdoc
import multer from 'multer';
import autosaveRoutes from './routes/autosaveRoutes'; 
const app = express();
const PORT = 3030;

const cors = require('cors');
app.use(cors());
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'This is a simple API with Swagger documentation',
        },
        servers: [
            {
                url: 'http://localhost:3030',
            },
        ],
    },
    apis: ['./routes/*.js', './routes/*.ts'], // Adjust the paths to match your route files
};
app.use(cors({
    origin: 'http://localhost:3030',  // Swagger UI domain
    credentials: true  // Cho phép gửi cookies
}));

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve Swagger documentation
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
  app.get('/hello', (req, res) => {
    res.send('Hello World!');
  });

  const pool = new Pool({
    user: 'kid97yv',
    host: 'dpg-ctf66u5ds78s73dmv090-a.singapore-postgres.render.com',
    database: 'autocad',
    password: 'zObYyaejEq8Qsa3xFwKAI0DWUedCa50N',
    port: 5432,
    ssl: { rejectUnauthorized: false }

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

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});