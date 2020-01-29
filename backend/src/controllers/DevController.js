const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMassage } = require('../websocket');

// index, show, store, update, store

module.exports = { 
    async index(request, response){
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response){
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({github_username});

        if(!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`); /// async/wait obriga o metodo a esperar a execução da linha terminar pra continuar 
    
            const {name = login, avatar_url, bio} = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
            // const techsArray =  techs.split(',').map(tech => tech.trim());
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });

            //filtrar conexçoes que estão a no maximo 10km e que o novo dev tenha ao menos uma das techs filtradas 

            const sendSocketMessageTo = findConnections(
                {latitude, longitude},
                techsArray,
            );

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }
        return response.json(dev);
    }
}