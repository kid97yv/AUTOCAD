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
const authController_1 = require("../controllers/authController");
const upload_1 = __importDefault(require("./upload"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.send('Welcome to my app!');
});
router.get('/register', (req, res) => {
    const errorMessages = req.flash('error') || [];
    res.render('register', { errorMessages });
});
router.post('/register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, authController_1.handleRegister)(req, res);
    }
    catch (err) {
        next(err);
    }
}));
router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', (req, res, next) => {
    (0, authController_1.handleLogin)(req, res)
        .catch((err) => next(err));
});
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out.');
        }
        res.redirect('/auth/login');
    });
});
router.use('/upload', upload_1.default);
exports.default = router;
