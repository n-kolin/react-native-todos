import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, KeyboardAvoidingView, Platform, Text, TouchableOpacity, ImageBackground } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddTask = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const saveTask = async () => {
        if (!title || !date) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        try {
            const existingTasks = await AsyncStorage.getItem('tasks');
            const tasks = existingTasks ? JSON.parse(existingTasks) : [];
            tasks.push({ title, date: date.toISOString().split('T')[0], completed: false });
            await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
            Alert.alert('Task added!', `Your task "${title}" has been saved.`);
            navigation.navigate('TaskList');
        } catch (error) {
            Alert.alert('Error', 'Failed to save the task.');
        }
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false); 
        if (selectedDate) {
            setDate(selectedDate); 
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/background.jpg')} 
            style={styles.background}
        >

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TextInput
                    placeholder="Task Title"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                />
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.dateText}>
                        Select Date: {date.toISOString().split('T')[0]}
                    </Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}
                <TouchableOpacity style={styles.saveButton} onPress={saveTask}>
                    <Text style={styles.saveButtonText}>Save Task</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </ImageBackground>

    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover', 
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 50,
        borderColor: '#6200ee',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    dateButton: {
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        padding: 15,
        marginBottom: 20,
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    saveButton: {
        backgroundColor: '#6200ee',
        borderRadius: 5,
        paddingVertical: 15,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddTask;