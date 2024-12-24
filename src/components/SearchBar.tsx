import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useUser } from '../contexts/UserContext';

// Define the type for the user
interface User {
    user_id: number;
    username: string;
}

const SearchUser = () => {
    const { user } = useUser();
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);  // Use the User type here

    useEffect(() => {
        console.log('Search Query:', searchQuery);
        if (searchQuery.length >= 3) {  // Start searching after 3 characters
            fetch(`https://fitness-backend-server-gkdme7bxcng6g9cn.southeastasia-01.azurewebsites.net/users/search/?name=${searchQuery}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched data:', data);  // Log the data to see its structure
                    setUsers(data);
                })
                .catch(error => console.error('Error fetching users:', error));
        } else {
            setUsers([]);  // Clear the dropdown if the search query is less than 3 characters
        }
    }, [searchQuery]);
    

    const handleUserClick = (user_id: number, username: string) => {
        // Show an alert to confirm sending a friend request
        Alert.alert(
            "Send Friend Request",
            `Send a friend request to ${username}?`,
            [
                {
                    text: "Cancel", // Cancel button to close the alert
                    style: "cancel"
                },
                {
                    text: "OK", // OK button to send the request
                    onPress: () => sendFriendRequest(user_id) // Call the function to send the request
                }
            ]
        );
    };
    
    // Function to call the API for sending the friend request
    const sendFriendRequest = async (recipientId: number) => {
        setUsers([]);
        try {    
            const response = await fetch(
                `https://fitness-backend-server-gkdme7bxcng6g9cn.southeastasia-01.azurewebsites.net/send-request?req_id=${user?.user_id}&rec_id=${recipientId}`,
                {
                    method: 'GET', // You can also use POST depending on the API design
                }
            );
    
            const data = await response.json();
    
            if (response.ok) {
                console.log('Friend request sent:', data);
                Alert.alert("Success", "Friend request sent successfully!");
            } else {
                console.error('Failed to send friend request:', data);
                Alert.alert("Error", "Failed to send friend request.");
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
            Alert.alert("Error", "An error occurred while sending the friend request.");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search for a name..."
                value={searchQuery}
                onChangeText={setSearchQuery}  // Update the search query as the user types
                style={styles.searchInput}
            />
            <FlatList
                data={users}
                keyExtractor={(item) => item.user_id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleUserClick(item.user_id, item.username)} style={styles.card}>
                        <Text style={styles.username}>{item.username}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1c1e',  // Dark background to match the theme '#1c1c1e'

    },
    searchInput: {
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#444',  // Darker gray border to fit the dark theme
        borderRadius: 8,
        backgroundColor: '#333',  // Dark background for the input box
        fontSize: 16,
        color: '#fff',  // White text for input to contrast with the dark background
        marginBottom: 0,  // Remove margin to eliminate space between the input and the list
    },
    listContainer: {
        paddingTop: 10,  // Remove any extra padding at the top of the list
    },
    card: {
        padding: 15,
        marginBottom: 1,
        backgroundColor: '#333',  // Dark background for the card
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',  // Border color matching the dark theme
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    username: {
        fontSize: 16,
        fontWeight: '500',  // Lighter font weight to make it less bold and more elegant
        color: '#fff',  // White text for the username to contrast with dark background
    },
});

export default SearchUser;
