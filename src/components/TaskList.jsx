import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert, Switch, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const TaskList = ({ navigation }) => {
    const [tasks, setTasks] = useState([]);

    const loadTasks = async () => {
        try {
            const existingTasks = await AsyncStorage.getItem('tasks');
            setTasks(existingTasks ? JSON.parse(existingTasks) : []);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    };

    const toggleTaskCompletion = async (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].completed = !updatedTasks[index].completed;
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
    };

    const deleteTask = async (index) => {
        const updatedTasks = tasks.filter((_, taskIndex) => taskIndex !== index);
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
    };

    useFocusEffect(
        React.useCallback(() => {
            loadTasks();
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Task List</Text>
            <Button title="Add Task" onPress={() => navigation.navigate('AddTask')} color="#6200ee" />
            {tasks.length === 0 ? (
                <Text style={styles.emptyMessage}>
                    You don't have any tasks yet. Click "Add Task" to add a task.
                </Text>
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={styles.taskContainer}>
                            <Image source={require('./assets/task-icon.png')} style={styles.taskIcon} />
                            <View style={styles.taskContent}>
                                <Text style={styles.taskName}>{item.name}</Text>
                                <Text style={styles.taskDate}>{item.date}</Text>
                                <Text style={styles.taskText}>{item.task}</Text>
                            </View>
                            <Switch
                                value={item.completed}
                                onValueChange={() => toggleTaskCompletion(index)}
                            />
                            <TouchableOpacity onPress={() => deleteTask(index)}>
                                <Text style={styles.deleteText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    taskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    taskContent: {
        flex: 1,
        marginLeft: 10,
    },
    taskName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    taskDate: {
        fontSize: 14,
        color: '#888',
    },
    taskText: {
        fontSize: 16,
    },
    deleteText: {
        color: 'red',
    },
    taskIcon: {
        width: 30,
        height: 30,
    },
    emptyMessage: {
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center',
        marginVertical: 20,
    },
});

export default TaskList;