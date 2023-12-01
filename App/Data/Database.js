"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Manage the connection to the database
 */
class Database {
    /**
     * Return the database's connection instance
     * @returns Current instance of the database's connection
     */
    static getInstance() {
        if (Database.instance == null) {
            return new Database();
        }
        else {
            return Database.instance;
        }
    }
    /**
     * Initialize the database's connection
     */
    constructor() {
        var mysql = require("mysql");
        this.connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "piqcel"
        });
    }
    /**
     * Send a query to the database
     * @param sqlQuery Query to execute
     * @param values Values to insert in the query
     */
    query(sqlQuery, values) {
        this.connection.connect((err) => {
            if (err)
                throw err;
            console.log("Connected!");
            this.connection.query(sqlQuery, values, function (err, result) {
                if (err)
                    throw err;
                console.log(result);
            });
        });
    }
}
