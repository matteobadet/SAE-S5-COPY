import express from 'express';
import axios from 'axios';
import { AccountDAO } from '../Models/DAO/accountDAO';
import { Database } from '../Data/databaseChoice'
import { Account } from '../Models/account';
import { User } from '../Models/user';
import { Session } from '../Models/session';
import { UserDAO } from '../Models/DAO/userDAO';
import { SessionDAO } from '../Models/DAO/sessionDAO'
import { Hash } from '../lib/Hash';
import * as cookie from 'cookie';

/**
 * The authentication controller handles operations related to user authentication.
 *
 * This class manages registration, login, logout, and other authentication-related features.
 * It typically interacts with the user model to validate credentials and maintain authentication state.
 *
 * @class Authentification
 */
class Authentification {

    private accountDAO : AccountDAO;
    private userDAO : UserDAO;
    private sessionDAO : SessionDAO;

    /**
     * Constructor
     */
    constructor() { 
        let database = new Database();
        this.accountDAO = new AccountDAO(database);
        this.userDAO = new UserDAO(database);
        this.sessionDAO = new SessionDAO(database);
    }

    /**
     * Allow a user to deconnect himself for the website
     * 
     * @param req - Requête Express
     * @param res - Réponse Express
     */
    public logout(req: express.Request, res: express.Response): void {
        res.clearCookie('token');
        this.sessionDAO.deleteSessionByToken(req.cookies['token']);
        res.redirect('/');
    }

    /**
     * Handles the POST request for user signup.
     *
     * @param req - The HTTP request object containing user signup data.
     * @param res - The HTTP response object to send a response back to the client.
     */
    public async postsignup(req: express.Request, res: express.Response) {
        const mail: string = req.body.mail;
        const psw: string = req.body.psw;
        const psw2: string = req.body.psw2;
        const pseudo: string = req.body.pseudo;
        const captcha: boolean = req.body['g-recaptcha-response'];

        const secretKey = '6LcUvrIoAAAAAFAPPi3cdZtxIPQ_lNHrJqcZviSA';
        
        try {
            const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
                params: {
                    secret: secretKey,
                    response: captcha,
                },
            });

            const data = response.data;
            
            if (data.success) {
                if (this.isMailValid(mail)) {
                    console.error('Aucun mail fourni.');
                    res.status(400).json({
                        success: false,
                        message: 'Merci d\'entrer une adresse mail correcte'
                    });
                } 
                else 
                {
                    const regex = /^[a-zA-Z0-9._-]+@iut-dijon\.u-bourgogne\.fr$/;

                    if (regex.test(mail)) 
                    {

                        let conditionMail = await this.accountDAO.checkExistingMails(mail);

                        if(!conditionMail) {

                            let lenghtPassword = psw.length;
                            const specialCharacter = /[!@#$%.]/;
                            const numberPassword = /\d/;

                            if (!(lenghtPassword >= 12 && specialCharacter.test(psw) && numberPassword.test(psw))) 
                            {
                                res.status(400).json({
                                    success: false,
                                    message: 'Le mot de passe doit contenir 12 caractères, 1 caractère spécial, 1 chiffre'
                                });
                            } 
                            else 
                            {
                                if (psw != psw2) 
                                {
                                    res.status(400).json({
                                        success: false,
                                        message: 'Vous devez retaper le même mot de passe'
                                    });
                                }
                                else 
                                {
                                    const hashedPassword = await Hash.hashPassword(psw);
                                    let session = await this.createSessionInDb(mail, pseudo, hashedPassword);


                                    if (session !== null && session !== undefined) 
                                    {
                                        this.setSessionCookie(res, 'token', session.Token);

                                        res.status(200).json({
                                            success: true,
                                            message: 'Inscription réussie',
                                            session: session
                                        });
                                    }
                                    else 
                                    {
                                        res.status(400).json({
                                            success: false,
                                            message: 'Une erreur est survenue'
                                        });
                                    }
                                }
                            }
                        } 
                        else 
                        {
                            res.status(400).json({
                                success: false,
                                message: "L'email rentré est déjà associé à un autre compte"
                            });
                        }
                    } 
                    else 
                    {
                        res.status(400).json({
                            success: false,
                            message: 'Vous devez avoir un mail IUT de Dijon'
                        });
                    }
                }
                
            } else {
                res.status(400).json({
                    success: false,
                    message : 'Merci de valider le captcha'
                });
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message : 'Erreur lors de la validation du captcha.'
            });
        }
    }

    /**
     * Handles the POST request for user login.
     *
     * @param req - The HTTP request object containing user login data.
     * @param res - The HTTP response object to send a response back to the client.
     */
    public async postlogin(req: express.Request, res: express.Response) {
        const mail: string = req.body.mail;
        const psw: string = req.body.psw;

        if (!mail || !psw) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir une adresse e-mail et un mot de passe.'
            });
        }

        let account = await this.accountDAO.checkCredentials(mail, await Hash.hashPassword(psw));

        let dateNow = Date.now();
        let token = await Hash.generateToken(mail, dateNow.toString());

        this.sessionDAO.create(new Session(0, token, dateNow, account));
        let session = await this.sessionDAO.getByID(await this.sessionDAO.getLastInsertedID());

        if (account != null) {
            return res.status(200).json({
                success: true,
                message: 'Authentification réussie.',
                account: account
            });
        } 
        else 
        {
            return res.status(401).json({
                success: false,
                message: 'Adresse e-mail ou mot de passe incorrect.'
            });
        }
    }

    private isMailValid(mail : string) : Boolean{
        return (mail === '' || mail === null || mail === undefined);    
    }

    private async createUserInDb(firstName : string, lastName : string) : Promise<User|null>
    {
        this.userDAO.create(new User(0, firstName, lastName));
        let user = await this.userDAO.getByID(await this.userDAO.getLastInsertedID());
        return user; 
    }

    private async createAccountInDb(email : string, pseudo : string, hash : string) : Promise<Account|null>
    {
        let user = await this.createUserInDb("","");
        this.accountDAO.create(new Account(0, email, pseudo, hash, user));
        let account = await this.accountDAO.getByID(await this.accountDAO.getLastInsertedID());
        return account;
    }

    private async createSessionInDb(email : string, pseudo : string, hash : string) : Promise<Session|null>
    {
        let account = await this.createAccountInDb(email, pseudo, hash);
        let dateNow = Date.now();
        let token = await Hash.generateToken(email, dateNow.toString());

        this.sessionDAO.create(new Session(0, token, dateNow, account));
        let session = await this.sessionDAO.getByID(await this.sessionDAO.getLastInsertedID());
        return session;
    }

    private setSessionCookie(res: express.Response, name : string, value : string) : void 
    {
        const cookieString = cookie.serialize(name, value, {
            path: '/',
        });

        res.setHeader('Set-Cookie', [cookieString]);
    }
}

export { Authentification };