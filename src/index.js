import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';

const ChatGPT = () => {
    const [data, setData] = useState([]);
    const apiKey = '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';
    const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-002/completions';
    const [textInput, setTextInput] = useState('');
    const [isSending, setIsSending] = useState(false); // Track whether a request is currently being sent

    const handleSend = async () => {
        if (isSending) return; // Don't send if a request is already in progress
        const prompt = textInput;
        try {
            setIsSending(true); // Set sending flag to true
            const response = await axios.post(
                apiUrl,
                {
                    prompt: prompt,
                    max_tokens: 1024, // Corrected 'maxToken' to 'max_tokens'
                    temperature: 0.2,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                }
            );
            const text = response.data.choices[0].text;
            setData([...data, { type: 'user', text: textInput }, { type: 'bot', text: text }]);
            setTextInput('');
        } catch (error) {
            console.error('API request failed:', error);
        } finally {
            setIsSending(false); // Reset sending flag to false after request completes
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>AI ChatBot</Text>
            <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                style={styles.body}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', padding: 10 }}>
                        <Text style={{ fontWeight: 'bold', color: item.type === 'user' ? 'green' : 'red' }}>
                            {item.type === 'user' ? 'Ninza: ' : 'Bot: '}
                        </Text>
                        <Text style={styles.bot}>{item.text}</Text>
                    </View>
                )}
            />
            <TextInput
                style={styles.input}
                value={textInput}
                onChangeText={text => setTextInput(text)}
                placeholder='Ask me anything'
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleSend}
            >
                <Text style={styles.buttonText}>Let's Go</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ChatGPT;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fffcc9',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 70,
    },
    body: {
        backgroundColor: 'fffcc9',
        width: '102%',
        margin: 10,
    },
    bot: {
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        width: '90%',
        height: 60,
        marginBottom: 10,
        borderRadius: 10,
    },
    button: {
        backgroundColor: 'yellow',
        width: '90%',
        height: 60,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'blue',
    },
});
