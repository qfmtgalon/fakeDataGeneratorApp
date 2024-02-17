// Homescreen.tsx
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';


const Homescreen = () => {
  
  const handleLogout = () => {
    // Implement logout functionality here
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        
      </View>
      <View style={styles.buttonContainer}>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 10,
  },
});

export default Homescreen;
