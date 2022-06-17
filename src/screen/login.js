import React, { useContext, useState, useEffect } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    StatusBar,
    Image
} from 'react-native';
import defaultStyle from '../style/defaultStyle'
import io from 'socket.io-client';

const IMG = require('../../assets/hangmanDead.png');
import server_address from '../../server_address';

const socket = io(server_address);

export default function Login({ navigation }) {

    const [name, setName] = useState("");
    const [room, setRoom] = useState('');
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        socket.on('connect', () => onConnectionStateUpdate());
        socket.on('disconnect', () => onConnectionStateUpdate());
    }, [connected])

    const onConnectionStateUpdate = () => {
        setConnected(socket.connected);
    };

    const joinRoom = () => {
        if (name != "" && room != 0) {
            socket.connect();
            socket.emit('join_room', name, room);
            navigation.navigate(
                'Home',
                { name:name, room:room, socket:socket }
            )
        }
    };

    return (
        <View style={defaultStyle.container}>
            <StatusBar backgroundColor="black" />
            
            <Text style={defaultStyle.title}>Redes</Text>

            <TextInput
                style={defaultStyle.input}
                placeholderTextColor={defaultStyle.input.color}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={defaultStyle.input}
                placeholderTextColor={defaultStyle.input.color}
                placeholder="Room"
                value={String(room)}
                onChangeText={setRoom}
                keyboardType='numeric'
            />

            <TouchableOpacity
                onPress={() => joinRoom()}
                style={defaultStyle.button}
            >
                <Text style={defaultStyle.buttonText}>
                    play
                </Text>
            </TouchableOpacity>

            <Image
                style={{ height: 600, width: '100%', }}
                resizeMode='cover'
                source={IMG}
            />
        </View>
    )
}