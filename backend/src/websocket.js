const socketio = require('socket.io');
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

let io;
const connections = [];

exports.setupWebsocket = (server) => {
    io = socketio(server);

    io.on('connection', socket => {
       const {latitude, longitude, techs} = socket.handshake.query;

        connections.push({
            id: socket.id, 
            coordinates: {
                latitude: Number(latitude),
                longitide: Number(longitude),
            },
            techs: parseStringAsArray(techs),
        });

        // setTimeout(() => {
        //     socket.emit('message', 'OLA')   /////// Backend enviando informação sem ser requisitada (webScoket)
        // }, 3000);
    });
};

//

exports.findConnections = (cordinates, techs) => {
    return connections.filter(connections => {
        return calculateDistance(coordinates, connections.coordinates) < 10 /// filtrat por devs que estejam num raio de 10km e que atentadam as tecnologias 
        && connections.techs.some(item => techs.includes(item));
    })
}

exports.sendMassage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data);
    })
}