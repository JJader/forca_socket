import React, { useEffect, useState } from 'react'
import { StyleSheet, FlatList, KeyboardAvoidingView, Text, View, TextInput, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';
import { Feather } from '@expo/vector-icons';
import server_address from '../../server_address';
import defaultStyle from '../style/defaultStyle';
const socket = io(server_address);

export default function Home({ navigation, route }) {
    const [connected, setConnected] = useState(false);
    const [name, setName] = useState("")
    const [room, setRoom] = useState(0)
    const [mensagens, setMensagens] = useState([])

    const [lastMessage, setlastMessage] = useState("");
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        socket.on('connect', () => onConnectionStateUpdate());
        socket.on('disconnect', () => onConnectionStateUpdate());
        socket.on('receive_message', (content) => onMessage(content));
        onConnectionStateUpdate();

        const unsubscribe = navigation.addListener('focus', () => {
            setName(route.params.name)
            setRoom(route.params.room)
        });

    }, [connected])

    const onConnectionStateUpdate = () => {
        setConnected(socket.connected);
    };

    const onMessage = (content) => {
        setlastMessage(content);
        mensagens.push(content);
        setMensagens(mensagens)
    };

    const onPress = () => {
        socket.emit('send_message', room, name, mensagem);
        setMensagem('');
    }

    return (
        <KeyboardAvoidingView style={defaultStyle.container}>
            <Text style={defaultStyle.text}>
                State: {connected ? 'Connected' : 'Disconnected'}
            </Text>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={mensagens}
                    renderItem={({ item, index }) => (
                        <Text
                            style={defaultStyle.text}
                            mykey={index}
                        >
                            {item.text}
                        </Text>
                    )}
                    vertical="true"
                />
            </View>

            <View style={styles.send}>
                <TextInput
                    placeholderTextColor={'gray'}
                    style={{...defaultStyle.input, flex:1}}
                    placeholder="mensagem"
                    value={mensagem}
                    onChangeText={setMensagem}
                />

                <TouchableOpacity
                    onPress={() => onPress()}
                    style={{ ...defaultStyle.button, ...styles.button }}
                >
                    <Feather name="send" size={30} color="black"/>
                    
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
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
        alignContent:'center',
        flexDirection:'row'
    },
    button:{
        borderRadius:50,
        marginHorizontal:10, 
        width:'15%', 
        backgroundColor: 'white'
    },
});