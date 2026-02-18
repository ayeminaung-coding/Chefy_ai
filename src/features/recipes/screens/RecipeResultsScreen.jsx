import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RecipeResultsScreen = ({ navigation }) => {
	const mockResults = [
		{ id: "1", title: "Garlic Butter Pasta" },
		{ id: "2", title: "Quick Chili Toast" },
		{ id: "3", title: "Egg Fried Rice" },
	];

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Recipe Results</Text>
			{mockResults.map((item) => (
				<TouchableOpacity
					key={item.id}
					style={styles.card}
					onPress={() => navigation.navigate("RecipeDetail", { id: item.id })}
				>
					<Text style={styles.cardText}>{item.title}</Text>
				</TouchableOpacity>
			))}
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
	card: {
		width: "100%",
		padding: 14,
		marginBottom: 12,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#ddd",
	},
	cardText: {
		fontSize: 16,
	},
});

export default RecipeResultsScreen;
