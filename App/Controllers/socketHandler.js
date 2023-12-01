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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketHandler = void 0;
const databaseChoice_1 = require("../Data/databaseChoice");
const pixelDAO_1 = require("../Models/DAO/pixelDAO");
class SocketHandler {
    constructor() {
        let database = new databaseChoice_1.Database();
        this.pixelDAO = new pixelDAO_1.PixelDAO(database);
    }
    changePixel(x, y, color, userID) {
        this.pixelDAO.changePixelColor(x, y, color, userID);
    }
    initGrid() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pixelDAO.clearAllPixels();
            this.pixelDAO.initPixels();
        });
    }
    getAllPixels() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.pixelDAO.getAll();
        });
    }
}
exports.SocketHandler = SocketHandler;
