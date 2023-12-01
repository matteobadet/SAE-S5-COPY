"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixelDAO = void 0;
const pixel_1 = require("../pixel");
const userDAO_1 = require("./userDAO");
class PixelDAO {
    constructor(database) {
        this.database = database;
    }
    getAll() {
        const userDAO = new userDAO_1.UserDAO(this.database);
        return this.database.queryAll("SELECT * FROM pixel", []).then((response) => Promise.all(response.map((row) => userDAO.getByID(row.targetUser).then((user) => new pixel_1.Pixel(row.xCoordinate, row.yCoordinate, row.pixelColor, user)))));
    }
    clearAllPixels() {
        return this.database.execute("DELETE FROM pixel", []);
    }
    initPixels() {
        for (let i = 0; i < 100; i++) {
            for (let j = 0; j < 100; j++) {
                this.database.execute("INSERT INTO pixel VALUES (?,?,?,?)", [i, j, "white", 0]);
            }
        }
    }
    changePixelColor(x, y, color, userID) {
        return this.database.execute("UPDATE pixel SET pixelColor=?, targetUser=? WHERE xCoordinate=? AND yCoordinate=?", [
            color,
            userID,
            x,
            y
        ]);
    }
}
exports.PixelDAO = PixelDAO;
