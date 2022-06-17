import React, { useEffect, useState } from 'react'
import { StyleSheet, FlatList, KeyboardAvoidingView, Text, View, TextInput, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';
import { Feather } from '@expo/vector-icons';
import server_address from '../../server_address';
import defaultStyle from '../style/defaultStyle';

import { useFocusEffect } from '@react-navigation/native';

var socket = io(server_address);

export default function Home({ navigation, route }) {
    const [connected, setConnected] = useState(false);
    const [name, setName] = useState("adfadf")
    const [room, setRoom] = useState('1')
    const [mensagens, setMensagens] = useState([])

    const [mensagem, setMensagem] = useState("");

    useFocusEffect(
        React.useCallback(() => {

            const unsubscribe = navigation.addListener('focus', () => {
                setName(route.params.name)
                setRoom(route.params.room)
                socket = route.params.socket

                socket.on('connect', () => onConnectionStateUpdate());
                socket.on('disconnect', () => onConnectionStateUpdate());
                socket.on('receive_message', (content) => onMessage(content));

                onConnectionStateUpdate();
            });

            return function cleanup() {
                setMensagens([]);
                unsubscribe
                socket.close();
            };
        }, [route.params.name, route.params.room])
    );

    const onConnectionStateUpdate = () => {
        setConnected(socket.connected);
    };

    const onMessage = (content) => {
        let aux = mensagens
        aux.push(content)
        setMensagens(aux)
        // let aux = [...mensagens];
        // aux.push(content);
        // setMensagens([...aux]);
    };

    const onPress = () => {
        socket.emit('send_message', room, name, mensagem);
        setMensagem('');
    }

    return (
        <View style={defaultStyle.container}>
            <Text style={defaultStyle.text}>
                State: {connected ? 'Connected' : 'Disconnected'}
            </Text>
            <View style={{ flex: 1 }}>

                <FlatList
                    data={mensagens}
                    extraData={mensagens.length}
                    key={mensagens.length}
                    renderItem={({ item, index }) => (
                        <View style={item.username == name ? styles.mensagem : { ...styles.mensagem, backgroundColor: 'gray', alignSelf: 'flex-end' }}>
                            <Text style={{ fontSize: 10, color: 'black' }}>
                                {item.username}
                            </Text>
                            <Text
                                style={defaultStyle.text}
                                mykey={index}
                            >
                                {item.text}
                            </Text>
                        </View>
                    )}
                    vertical="true"
                />
            </View>

            <View style={styles.send}>
                <TextInput
                    placeholderTextColor={'gray'}
                    style={{ ...defaultStyle.input, flex: 1 }}
                    placeholder="mensagem"
                    value={mensagem}
                    onChangeText={setMensagem}
                />

                <TouchableOpacity
                    onPress={() => onPress()}
                    style={{ ...defaultStyle.button, ...styles.button }}
                >
                    <Feather name="send" size={30} color="black" />

                </TouchableOpacity>
            </View>
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
    send: {
        height: 100,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'row'
    },
    button: {
        borderRadius: 50,
        marginHorizontal: 10,
        width: '15%',
        backgroundColor: 'white'
    },

    mensagem: {
        alignSelf: 'flex-start',
        backgroundColor: 'green',
        width: '90%',
        marginVertical: 5,
        borderRadius: 20,
        padding: 10,
        height: 50
    },
});