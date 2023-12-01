const webServer = require('./Server/webServer');
const socketServer = require('./Server/socketServer');
const { Database } = require('./App/Data/sqlite/databaseSqlite')

//création d'une instance de la bdd
const db = new Database();

//Creation of the server
const server = webServer;

//link between http server (express) and websocket server
socketServer(server);

const port = 3000 || process.argv[0];


server.listen(3000, () => {
    console.log('Lancement du serveur : http://localhost:3000');
});

// Gestionnaire d'événements pour SIGINT (Ctrl+C dans le terminal)
process.on('SIGINT', () => {
    console.log('Reçu SIGINT. Fermeture du serveur.');
    db.close();
    process.exit(0);
});