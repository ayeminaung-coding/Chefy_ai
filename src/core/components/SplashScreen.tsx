import React from 'react';
import { ActivityIndicator, Image, StatusBar, StyleSheet, Text, View } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF4EB" />
      <View style={styles.logoShell}>
        <Image
          source={require('../../assets/images/splash_logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      {/* <Text style={styles.title}>Chefy AI</Text> */}
      <Text style={styles.subtitle}>Cooking made simple and smart</Text>
      <View style={styles.loaderRow}>
        <ActivityIndicator size="small" color="#FF6B3D" />
        <Text style={styles.loadingText}>Preparing your kitchen...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF4EB',
    paddingHorizontal: 24,
  },
  logoShell: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    marginBottom: 18,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 30,
    color: '#2D1A12',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: '#7A5A48',
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 26,
  },
  loadingText: {
    marginLeft: 10,
    color: '#A06B53',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SplashScreen;
