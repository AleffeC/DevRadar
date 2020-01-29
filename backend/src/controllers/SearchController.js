const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(request, response){
        const { latitude, longitude, techs } = request.query;
        //buscar num raio de 10km
        //buscar por tecnologias split(',').map(tech => tech.trim())
        console.log(techs);
        const techsArray = parseStringAsArray(techs);
        // const techsArray =  techs.split(',').map(tech => tech.trim());
        console.log(techsArray);

        const devs = await Dev.find({
            techs:{
                $in: techsArray,
            },
            location:{
                $near: {
                    $geometry:{
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000,
                },
            },
        });

        return response.json( { devs } );
    },
}