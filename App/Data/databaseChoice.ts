//Importer ici les types de base de donnée
import { Database as SqliteDB } from './sqlite/databaseSqlite';
import { Database as MySqlDB } from './mysql/databaseMySQL';

//Utiliser Sqlite
export { SqliteDB as Database };