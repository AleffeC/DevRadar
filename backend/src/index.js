const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // cria o servidor
const routes = require('./routes'); // mostrando o caminho da configuração
const { setupWebsocket } = require('./websocket'); // usar {} sempre que quiser importar uma função especifica apenas 

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect('mongodb+srv://aleffe:aleffe@cluster0-7pvf4.mongodb.net/week10?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

app.use(cors());
app.use(express.json()); // necessario para a plicação entender que ser ausado json
app.use(routes); // a ordem aqui importa. nesse caso a ordem de usar o jason deve vir antes 

//Metodos HTTP: GET, POST, PUT, DELETE

//Tipos de parametros:
//Query Params: request.query (Filtros, ordenação, paginação, ...)
//Route Params: request.params(identificar recurso na alteração ou remoção)
//Body: request.body (Dados para criação ou remocoa de um registro)
//Mongo db (banco nao relacional)

server.listen(3333);

