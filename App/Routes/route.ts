import express, { Request, Response, Router } from 'express';
import { Authentification } from '../Controllers/authentification';

const router: Router = express.Router();
const authController = new Authentification();

// Route for rendering the 'index' view
router.get('/', (req: Request, res: Response) => {
  res.render('index');
});

// Route for rendering the 'login' view
router.get('/login', (req: Request, res: Response) => {
  res.render('login');
});

// Route for handling POST request for user login
router.post('/login', (req: Request, res: Response) => {
  authController.postlogin(req, res);
});

// Route for rendering the 'signup' view
router.get('/signup', (req: Request, res: Response) => {
  res.render('signup');
});
  
// Route for handling POST request for user signup
router.post('/signup', (req: Request, res: Response) => {
  authController.postsignup(req, res);
});

export = router;