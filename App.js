import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';

import server_address from './server_address';
const socket = io(server_address);

export default function App() {
    const [connected, setConnected] = useState(false);
    const [lastMessage, setlastMessage] = useState("");
    const [email, setEmail] = useState("");
    const [user, setUser] = useState("Jamisson")

    useEffect(() => {
        socket.on('connect', () => onConnectionStateUpdate());
        socket.on('disconnect', () => onConnectionStateUpdate());
        socket.on('chat message', (content) => onMessage(content));
    }, [connected])

    const onConnectionStateUpdate = () => {
        setConnected(socket.connected);
        socket.emit('joinServer', user);
    };

    const onMessage = (content) => {
        setlastMessage(content);
    };

    const onPress = () => {
        socket.emit('chat message', user, email);
        setEmail('');
    }

    return (
        <View style={styles.container}>
            <Text>State: {connected ? 'Connected' : 'Disconnected'}</Text>
            <Text>Last message: {lastMessage.text}</Text>
            <TextInput
                placeholderTextColor={'gray'}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />

            <TouchableOpacity
                onPress={() => onPress()}
                style={styles.button}
            >
                <Text style={{ backgroundColor: 'black' }}>
                    clica em mim
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});