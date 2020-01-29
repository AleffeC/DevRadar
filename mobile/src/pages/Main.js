import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native'; // TouchableOpacity botão personalizado que diminui a opacidade quando acionado
import MapView, { Marker, Callout } from 'react-native-maps'; //Marker para qualquer marcação e CAllout detalhes de marcação 
import {requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../Services/api';
import {connect, disconnect, subscribeToNewDevs} from '../Services/socket';

function Main( { navigation } ){
    const [currentRegion, setCurrentRegion] = useState(null); 
    const [devs, setDevs] = useState([]);
    const [techs, setTechs] = useState('');

    useEffect(() => {
        async function loadInitialPosition(){
           const {granted} = await requestPermissionsAsync();        
        
           if(granted){
               const {coords} = await getCurrentPositionAsync({
                   enableHighAccuracy: true,
               });

               const { latitude, longitude } = coords;
               setCurrentRegion({
                   latitude,
                   longitude,
                   latitudeDelta: 0.04,
                   longitudeDelta: 0.04,
               })

           }
        }
        loadInitialPosition();
    }, []);

    useEffect(() => {
        subscribeToNewDevs(dev => setDevs([...devs, dev]));          ///useEffect => toda vez que occorre uma mudança na variavel [devs] vai executar o que tiver dentro de {}
    }, [devs]);

    function setupWebsocket(){
        disconnect();

        const {latitude, longitude} = currentRegion;

        connect(
            latitude,
            longitude,
            techs,
        );
    }

    async function loadDevs(){
        const {latitude, longitude} = currentRegion;

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs
            }
        });
        
        setDevs(response.data.devs); 
        setupWebsocket();
    }

    function handleRegionChanged(region){
        console.log(region);
        setCurrentRegion(region);
    }

    if(!currentRegion){
        return null;
    }

    return( 
        <>
            <MapView onRegionChangeComplete={handleRegionChanged} initialRegion={currentRegion} style={styles.map}>
                {devs.map(dev => (
                    <Marker key={dev_id} coordinate ={{ latitude: dev.location.coordinates[1], longitude: dev.location.coordinates[0] }}>
                    <Image style={styles.avatar}source={{uri: dev.avatar_url}} />
                    <Callout onPress={() => {
                        //Navegação 
                        navigation.navigate('Profile', { github_username: dev.github_username });
                    }}>
                        <View style={styles.callout}>
                            <Text style={styles.devName}>{dev.name}</Text>
                            <Text style={styles.devBio}>{dev.bio}</Text>
                            <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                        </View>
                    </Callout>
                </Marker> 
                ))}
           </MapView>
           <View style={styles.searchForm}>
                <TextInput 
                    style={styles.searchInput}
                    placeholder = "Buscar devs por techs..."
                    placeholderTextColor = "#999"
                    autoCaptalize = "words"
                    autoCorrect = {false}
                    value = {techs}
                    onChangeText = {setTechs}                    
                />
                <TouchableOpacity onPress={loadDevs} syle={styles.loadButton}>
                    <MaterialIcons name="my-location" size={20} color="#FFF"/>
                </TouchableOpacity>
           </View>
        </>//Sempre criar "fragment" quando tiver dois containers um abaixo do outro
        )
    } 

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#FFF'
    },
    callout:{
        width: 260,
    },
    devName:{
        fontWeight: 'bold',
        fontSize: 16,
    },
    devBio:{
        color: '#666',
        marginTop: 5,
    },
    devTechs:{
        marginTop: 5,
    },
    searchForm: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row',
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        elevation: 3,
    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8E4Dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },
})

export default Main;