"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDAO = void 0;
const user_1 = require("../user");
/**
 * The User Data Access Object (DAO) for interacting with the database.
 * @author Mattéo BADET
 */
class UserDAO {
    /**
     * Creates a new UserDAO instance.
     * @param database - The database instance to be used for data access.
     */
    constructor(database) {
        this.database = database;
    }
    /**
     * Fetches all users from the database.
     * @returns A promise that resolves to an array of User objects.
     */
    getAll() {
        return this.database.queryAll("SELECT * FROM user", []).then((response) => response.map((row) => new user_1.User(row.id, row.lastName, row.firstName)));
    }
    /**
     * Retrieves a user by their ID.
     * @param id - The ID of the user to fetch.
     * @returns A promise that resolves to a User object, or null if not found.
     */
    getByID(id) {
        return this.database.queryOne("SELECT * FROM user WHERE Id = ?", [id]).then((response) => response ? new user_1.User(response.id, response.lastName, response.firstName) : null);
    }
    /**
     * Creates a new user in the database.
     * @param user - The User object to be added to the database.
     * @returns A promise that resolves when the operation is complete.
     */
    create(user) {
        return this.database.execute("INSERT INTO user (firstname, lastname) VALUES (?, ?)", [
            user.FirstName,
            user.LastName,
        ]);
    }
    /**
     * Updates a user's information in the database.
     * @param user - The User object with updated information.
     * @returns A promise that resolves when the operation is complete.
     */
    edit(user) {
        return this.database.execute("UPDATE user SET firstname = ?, lastname = ? WHERE id = ?", [
            user.FirstName,
            user.LastName,
            user.Id,
        ]);
    }
    /**
     * Deletes a user from the database.
     * @param user - The User object to be deleted.
     * @returns A promise that resolves when the operation is complete.
     */
    delete(user) {
        return this.database.execute("DELETE FROM user WHERE id = ?", [user.Id]);
    }
    /**
     * Retrieves the last inserted ID from the User table.
     * @returns A promise that resolves to the last inserted ID.
     */
    getLastInsertedID() {
        return this.database.queryOne("SELECT MAX(id) AS lastID FROM user", []).then((response) => {
            if (response && response.lastID !== null) {
                return response.lastID;
            }
            else {
                return Promise.reject(new Error("Aucun ID inséré n'a été trouvé."));
            }
        });
    }
}
exports.UserDAO = UserDAO;
