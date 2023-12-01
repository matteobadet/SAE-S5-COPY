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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const sqlite = __importStar(require("sqlite3"));
const sqlite3 = sqlite.verbose();
class Database {
    constructor() {
        this.isConnected = false;
        this.db = new sqlite3.Database('./App/Data/sqlite/BDD.db', (err) => {
            if (err) {
                console.error('Erreur lors de la connexion à la base de données:', err);
            }
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.db.on('open', () => __awaiter(this, void 0, void 0, function* () {
                    //console.log('Connecté à la base de données SQLite.');
                    resolve();
                    this.isConnected = true;
                }));
                this.db.on('error', (err) => {
                    reject(err);
                });
            });
        });
    }
    queryOne(req, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.db.get(req, params, (error, row) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(row);
                    }
                });
            });
        });
    }
    queryAll(req, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.db.all(req, params, (error, rows) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(rows);
                    }
                });
            });
        });
    }
    execute(req, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.db.run(req, params, function (error) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
    close() {
        console.log('Fermeture de la connexion à la base de données...');
        if (this.isConnected) {
            this.db.close((err) => {
                if (err) {
                    console.error('Erreur lors de la fermeture de la connexion :', err);
                }
                else {
                    this.isConnected = false;
                    console.log('Connexion à la base de données fermée avec succès.');
                }
            });
        }
    }
    IsConnected() {
        return this.isConnected;
    }
}
exports.Database = Database;
