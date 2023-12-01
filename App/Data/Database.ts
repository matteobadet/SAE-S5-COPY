import {Connection} from "mysql";
/**
 * Manage the connection to the database
 */
class Database 
{
    private static instance : Database;
    private connection : Connection;

    /**
     * Return the database's connection instance
     * @returns Current instance of the database's connection
     */
    public static getInstance() : Database 
    {
        if (Database.instance == null){
            return new Database();
        }
        else{
            return Database.instance;
        }
    }

    /**
     * Initialize the database's connection
     */
    private constructor()
    {
        var mysql = require("mysql");
        this.connection = mysql.createConnection(
            {
                host: "localhost",
                user: "root",
                password: "",
                database : "piqcel"
            });
    }

    /**
     * Send a query to the database
     * @param sqlQuery Query to execute
     * @param values Values to insert in the query
     */
    public query(sqlQuery : string, values : any[]) : any
    {
        this.connection.connect((err) => {
            if (err) 
                throw err;
            console.log("Connected!");
            this.connection.query(sqlQuery, values, function (err:any, result:any) {
                if (err) throw err;
                  console.log(result);
              });
        });
    }
}