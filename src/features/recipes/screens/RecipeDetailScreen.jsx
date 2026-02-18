import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RecipeDetailScreen = () => {
	const handleSave = () => {
		// Placeholder for favorites logic
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Recipe Detail</Text>
			<TouchableOpacity style={styles.button} onPress={handleSave}>
				<Text style={styles.buttonText}>Save to Favorites</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
	},
	title: {
		fontSize: 22,
		marginBottom: 16,
	},
	button: {
		backgroundColor: "#222",
		paddingVertical: 12,
		paddingHorizontal: 18,
		borderRadius: 8,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
	},
});

export default RecipeDetailScreen;
