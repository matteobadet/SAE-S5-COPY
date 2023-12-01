"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
//Importer ici les types de base de donnée
const databaseSqlite_1 = require("./sqlite/databaseSqlite");
Object.defineProperty(exports, "Database", { enumerable: true, get: function () { return databaseSqlite_1.Database; } });
