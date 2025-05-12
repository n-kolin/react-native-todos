import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert, Switch, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const TaskList = ({ navigation }) => {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('all');
    const [sortOption, setSortOption] = useState('date');

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

    const filteredTasks = () => {
        if (filter === 'completed') {
            return tasks.filter((task) => task.completed);
        } else if (filter === 'incomplete') {
            return tasks.filter((task) => !task.completed);
        }
        return tasks;
    };

    const sortedTasks = () => {
        const filtered = filteredTasks();
        if (sortOption === 'title') {
            return filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOption === 'date') {
            return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        return filtered;
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

            <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Filter:</Text>
                <Picker
                    selectedValue={filter}
                    style={styles.picker}
                    onValueChange={(itemValue) => setFilter(itemValue)}
                >
                    <Picker.Item label="All Tasks" value="all" />
                    <Picker.Item label="Completed Tasks" value="completed" />
                    <Picker.Item label="Incomplete Tasks" value="incomplete" />
                </Picker>
            </View>

            <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Sort by:</Text>
                <Picker
                    selectedValue={sortOption}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSortOption(itemValue)}
                >
                    <Picker.Item label="Date" value="date" />
                    <Picker.Item label="Title" value="title" />
                </Picker>
            </View>

            {/* Task List */}
            {tasks.length === 0 ? (
                <Text style={styles.emptyMessage}>
                    You don't have any tasks yet. Click "Add Task" to add a task.
                </Text>
            ) : (
                <FlatList
                    data={sortedTasks()}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={styles.taskContainer}>
                            <Image source={require('../../assets/item.jpg')} style={styles.taskIcon} />
                            <View style={styles.taskContent}>
                                <Text
                                    style={[
                                        styles.taskTitle,
                                        item.completed && styles.completedTaskTitle,
                                    ]}
                                >
                                    {item.title}
                                </Text>
                                <Text style={styles.taskDate}>{item.date}</Text>
                                <Text style={styles.taskText}>{item.task}</Text>
                            </View>
                            <Switch
                                value={item.completed}
                                onValueChange={() => toggleTaskCompletion(index)}
                            />
                            <TouchableOpacity onPress={() => deleteTask(index)}>
                                <MaterialIcons name="delete" size={24} color="red" />
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
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    filterLabel: {
        fontSize: 16,
        marginRight: 10,
    },
    picker: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
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
    taskTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    completedTaskTitle: {
        textDecorationLine: 'line-through', 
        color: 'gray',
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