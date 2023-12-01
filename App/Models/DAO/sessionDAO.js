"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionDAO = void 0;
const session_1 = require("../session");
const accountDAO_1 = require("./accountDAO");
/**
 * The Session Data Access Object (DAO) for interacting with the database.
 * @author Mattéo BADET
 */
class SessionDAO {
    constructor(database) {
        this.database = database;
    }
    /**
     * Retrieves all sessions from the database.
     * @returns A promise that resolves to an array of Session objects.
     */
    getAll() {
        const accountDAO = new accountDAO_1.AccountDAO(this.database);
        return this.database.queryAll("SELECT * FROM Session", []).then((response) => Promise.all(response.map((row) => accountDAO.getByID(row.account_id).then((account) => new session_1.Session(row.id, row.token, row.creationDate, account)))));
    }
    /**
     * Retrieves a session by its ID.
     * @param id - The ID of the Session to fetch.
     * @returns A promise that resolves to a Session object, or null if not found.
     */
    getByID(id) {
        return this.database.queryOne("SELECT * FROM Session WHERE Id = ?", [id]).then((response) => {
            if (!response) {
                return null;
            }
            const accountDAO = new accountDAO_1.AccountDAO(this.database);
            return accountDAO.getByID(response.account_id).then((account) => new session_1.Session(response.id, response.token, response.creationDate, account));
        });
    }
    /**
     * Creates a new session in the database.
     * @param session - The Session object to be added to the database.
     * @returns A promise that resolves when the operation is complete.
     */
    create(session) {
        var _a, _b;
        return this.database.execute("INSERT INTO Session (token, creationDate, account_id) VALUES (?, ?, ?)", [
            session.Token,
            session.CreationDate,
            (_b = (_a = session.Account) === null || _a === void 0 ? void 0 : _a.Id) !== null && _b !== void 0 ? _b : null,
        ]);
    }
    /**
     * Updates session information in the database.
     * @param session - The Session object with updated information.
     * @returns A promise that resolves when the operation is complete.
     */
    edit(session) {
        var _a, _b;
        return this.database.execute("UPDATE Session SET token = ?, creationDate = ?, account_id = ? WHERE id = ?", [
            session.Token,
            session.CreationDate,
            (_b = (_a = session.Account) === null || _a === void 0 ? void 0 : _a.Id) !== null && _b !== void 0 ? _b : null,
            session.Id,
        ]);
    }
    /**
     * Deletes a session from the database.
     * @param session - The Session object to be deleted.
     * @returns A promise that resolves when the operation is complete.
     */
    delete(session) {
        return this.database.execute("DELETE FROM Session WHERE id = ?", [session.Id]);
    }
    /**
     * Retrieves the last inserted ID from the Session table.
     * @returns A promise that resolves to the last inserted ID.
     */
    getLastInsertedID() {
        return this.database.queryOne("SELECT MAX(id) AS lastID FROM Session", []).then((response) => {
            if (response && response.lastID !== null) {
                return response.lastID;
            }
            else {
                return Promise.reject(new Error("Aucun ID inséré n'a été trouvé."));
            }
        });
    }
}
exports.SessionDAO = SessionDAO;
