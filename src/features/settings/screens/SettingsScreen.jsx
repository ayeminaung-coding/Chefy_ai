import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SettingsScreen = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>User Settings</Text>
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
	},
});

export default SettingsScreen;
