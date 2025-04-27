import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddTask = ({ navigation }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [task, setTask] = useState('');

    const saveTask = async () => {
        if (!name || !date || !task) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        try {
            const existingTasks = await AsyncStorage.getItem('tasks');
            const tasks = existingTasks ? JSON.parse(existingTasks) : [];
            tasks.push({ name, date, task, completed: false });
            await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
            Alert.alert('Task added!', `Your task "${name}" has been saved.`);
            navigation.navigate('TaskList');
        } catch (error) {
            Alert.alert('Error', 'Failed to save the task.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TextInput
                placeholder="Task Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <TextInput
                placeholder="Enter Date (e.g., 2025-04-28)"
                value={date}
                onChangeText={setDate}
                style={styles.input}
            />
            <TextInput
                placeholder="Enter Task Details"
                value={task}
                onChangeText={setTask}
                style={styles.input}
            />
            <Button title="Save Task" onPress={saveTask} color="#6200ee" />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
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
});

export default AddTask;