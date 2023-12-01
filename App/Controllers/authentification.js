"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Authentification = void 0;
const axios_1 = __importDefault(require("axios"));
const accountDAO_1 = require("../Models/DAO/accountDAO");
const databaseChoice_1 = require("../Data/databaseChoice");
const account_1 = require("../Models/account");
const user_1 = require("../Models/user");
const session_1 = require("../Models/session");
const userDAO_1 = require("../Models/DAO/userDAO");
const sessionDAO_1 = require("../Models/DAO/sessionDAO");
const Hash_1 = require("../lib/Hash");
const cookie = __importStar(require("cookie"));
/**
 * The authentication controller handles operations related to user authentication.
 *
 * This class manages registration, login, logout, and other authentication-related features.
 * It typically interacts with the user model to validate credentials and maintain authentication state.
 *
 * @class Authentification
 */
class Authentification {
    /**
     * Constructor
     */
    constructor() {
        let database = new databaseChoice_1.Database();
        this.accountDAO = new accountDAO_1.AccountDAO(database);
        this.userDAO = new userDAO_1.UserDAO(database);
        this.sessionDAO = new sessionDAO_1.SessionDAO(database);
    }
    /**
     * Handles the POST request for user signup.
     *
     * @param req - The HTTP request object containing user signup data.
     * @param res - The HTTP response object to send a response back to the client.
     */
    postsignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const mail = req.body.mail;
            const psw = req.body.psw;
            const psw2 = req.body.psw2;
            const pseudo = req.body.pseudo;
            const captcha = req.body['g-recaptcha-response'];
            const secretKey = '6LcUvrIoAAAAAFAPPi3cdZtxIPQ_lNHrJqcZviSA';
            try {
                const response = yield axios_1.default.post('https://www.google.com/recaptcha/api/siteverify', null, {
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
                    else {
                        const regex = /^[a-zA-Z0-9._-]+@iut-dijon\.u-bourgogne\.fr$/;
                        if (regex.test(mail)) {
                            let conditionMail = yield this.accountDAO.checkExistingMails(mail);
                            if (!conditionMail) {
                                let lenghtPassword = psw.length;
                                const specialCharacter = /[!@#$%.]/;
                                const numberPassword = /\d/;
                                if (!(lenghtPassword >= 12 && specialCharacter.test(psw) && numberPassword.test(psw))) {
                                    res.status(400).json({
                                        success: false,
                                        message: 'Le mot de passe doit contenir 12 caractères, 1 caractère spécial, 1 chiffre'
                                    });
                                }
                                else {
                                    if (psw != psw2) {
                                        res.status(400).json({
                                            success: false,
                                            message: 'Vous devez retaper le même mot de passe'
                                        });
                                    }
                                    else {
                                        const hashedPassword = yield Hash_1.Hash.hashPassword(psw);
                                        let session = yield this.createSessionInDb(mail, pseudo, hashedPassword);
                                        console.log(session);
                                        if (session !== null && session !== undefined) {
                                            this.setSessionCookie(res, 'token', session.Token);
                                            res.status(200).json({
                                                success: true,
                                                message: 'Inscription réussie',
                                                session: session,
                                                redirect: '/'
                                            });
                                        }
                                        else {
                                            res.status(400).json({
                                                success: false,
                                                message: 'Une erreur est survenue'
                                            });
                                        }
                                    }
                                }
                            }
                            else {
                                res.status(400).json({
                                    success: false,
                                    message: "L'email rentré est déjà associé à un autre compte"
                                });
                            }
                        }
                        else {
                            res.status(400).json({
                                success: false,
                                message: 'Vous devez avoir un mail IUT de Dijon'
                            });
                        }
                    }
                }
                else {
                    res.status(400).json({
                        success: false,
                        message: 'Merci de valider le captcha'
                    });
                }
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Erreur lors de la validation du captcha.'
                });
            }
        });
    }
    /**
     * Handles the POST request for user login.
     *
     * @param req - The HTTP request object containing user login data.
     * @param res - The HTTP response object to send a response back to the client.
     */
    postlogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const mail = req.body.mail;
            const psw = req.body.psw;
            if (!mail || !psw) {
                return res.status(400).json({
                    success: false,
                    message: 'Veuillez fournir une adresse e-mail et un mot de passe.'
                });
            }
            //let account = await this.accountDAO.checkCredentials(mail,this.hashPassword(psw));
            // if (account != null) {
            //     return res.status(200).json({
            //         success: true,
            //         message: 'Authentification réussie.',
            //         account: account
            //     });
            // } else {
            //     return res.status(401).json({
            //         success: false,
            //         message: 'Adresse e-mail ou mot de passe incorrect.'
            //     });
            // }
        });
    }
    isMailValid(mail) {
        return (mail === '' || mail === null || mail === undefined);
    }
    createUserInDb(firstName, lastName) {
        return __awaiter(this, void 0, void 0, function* () {
            this.userDAO.create(new user_1.User(0, firstName, lastName));
            let user = yield this.userDAO.getByID(yield this.userDAO.getLastInsertedID());
            return user;
        });
    }
    createAccountInDb(email, pseudo, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.createUserInDb("", "");
            this.accountDAO.create(new account_1.Account(0, email, pseudo, hash, user));
            let account = yield this.accountDAO.getByID(yield this.accountDAO.getLastInsertedID());
            return account;
        });
    }
    createSessionInDb(email, pseudo, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            let account = yield this.createAccountInDb(email, pseudo, hash);
            let dateNow = Date.now();
            let token = yield Hash_1.Hash.generateToken(email, dateNow.toString());
            this.sessionDAO.create(new session_1.Session(0, token, dateNow, account));
            let session = yield this.sessionDAO.getByID(yield this.sessionDAO.getLastInsertedID());
            return session;
        });
    }
    setSessionCookie(res, name, value) {
        const cookieString = cookie.serialize(name, value, {
            path: '/',
        });
        res.setHeader('Set-Cookie', [cookieString]);
    }
}
exports.Authentification = Authentification;
