"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const authentification_1 = require("../Controllers/authentification");
const router = express_1.default.Router();
const authController = new authentification_1.Authentification();
// Route for rendering the 'index' view
router.get('/', (req, res) => {
    res.render('index');
});
// Route for rendering the 'login' view
router.get('/login', (req, res) => {
    res.render('login');
});
// Route for handling POST request for user login
router.post('/login', (req, res) => {
    authController.postlogin(req, res);
});
// Route for rendering the 'signup' view
router.get('/signup', (req, res) => {
    res.render('signup');
});
// Route for handling POST request for user signup
router.post('/signup', (req, res) => {
    authController.postsignup(req, res);
});
module.exports = router;
