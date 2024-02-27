import React, { useState, useEffect } from 'react';
import { View, Button } from 'react-native';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH, REALTIME_DB } from '../../firebaseConfig';
import { get, push, ref, set } from 'firebase/database';

const Homescreen = () => {
  const [latestScanNumber, setLatestScanNumber] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchLatestScanNumber = async () => {
      try {
        // Adjust this query based on your Realtime Database structure
        const latestScanRef = ref(REALTIME_DB, 'latestScanNumber');
        const snapshot = await get(latestScanRef);

        if (snapshot.exists()) {
          const latestScan = snapshot.val();
          setLatestScanNumber(latestScan);
        } else {
          // If 'latestScanNumber' node doesn't exist, initialize it to 0
          set(ref(REALTIME_DB, 'latestScanNumber'), 0);
        }
      } catch (error) {
        console.error('Error fetching latest scan number:', error);
      }
    };

    fetchLatestScanNumber();
  }, []);

  useEffect(() => {
    let intervalId;

    if (isGenerating) {
      intervalId = setInterval(() => {
        generateFakeData();
        setLatestScanNumber((prev) => prev + 1);
      }, 2000);
    }

    return () => clearInterval(intervalId);
  }, [isGenerating]);

  const generateFakeData = async () => {
    try {
      // Fetch the latest scan number from the 'latestScanNumber' node in the Realtime Database
      const latestScanSnapshot = await get(ref(REALTIME_DB, 'latestScanNumber'));
      const latestScanNumber = latestScanSnapshot.val() || 0;
  
      // Increment the latest scan number
      const newScanNumber = latestScanNumber + 1;
  
      const paddedScanNumber = String(newScanNumber).padStart(3, '0'); // Adjusted padding to 3 digits
      const scanNumber = `SCAN_${paddedScanNumber}`;
  
      // Replace this with actual sensor data retrieval logic
      const waveform = getWaveform();
  
      // Calculate a value that determines 'Good' or 'Bad' based on some condition
      const qualityValue = Math.random();
  
      // Generate an integer random voltage between 10V and 100V
      const voltage = Math.floor(Math.random() * 10) * 10 + 10;
  
      // Generate your fake data here
      const fakeData = {
        scanNumber: scanNumber,
        timestamp: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }), // Updated timestamp format
        quality: '',
        frequency: '40KHz',
        voltage: `${voltage}V`,
        waveform: '',
      };
  
      // Update 'latestScanNumber' node in the Realtime Database with the latest scan number
      await set(ref(REALTIME_DB, 'latestScanNumber'), newScanNumber);
  
      // Update this to use Realtime Database push and set
      const fakeDataRef = ref(REALTIME_DB, 'fakeData');
      await set(push(fakeDataRef), fakeData);
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };
  

  const logout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Replace this function with actual sensor waveform retrieval logic
  const getWaveform = () => {
    // Example: Replace this with the actual logic to get waveform from the sensor
    return [];
  };

  const handleGenerate = () => {
    setIsGenerating(true);
  };

  const handleStop = () => {
    setIsGenerating(false);
  };

  return (
    <View>
      <Button title="Generate" onPress={handleGenerate} disabled={isGenerating} />
      <Button title="Stop" onPress={handleStop} disabled={!isGenerating} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default Homescreen;
