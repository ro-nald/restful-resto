const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 3000;

const appServer = http.createServer(app);

appServer.listen(PORT);