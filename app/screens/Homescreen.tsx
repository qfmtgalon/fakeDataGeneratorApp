import React, { useState, useEffect } from 'react';
import { View, Button } from 'react-native';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const Homescreen = () => {
  const [latestScanNumber, setLatestScanNumber] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchLatestScanNumber = async () => {
      const q = query(collection(FIRESTORE_DB, 'fakeData'), orderBy('scanNumber', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const latestScan = querySnapshot.docs[0].data().scanNumber;
        setLatestScanNumber(latestScan);
      }
    };

    fetchLatestScanNumber();
  }, []);

  useEffect(() => {
    let intervalId;

    if (isGenerating) {
      intervalId = setInterval(() => {
        generateFakeData();
        setLatestScanNumber((prev) => prev + 1); // Update the latestScanNumber in the component state
      }, 2000); // Adjust the interval as needed
    }

    return () => clearInterval(intervalId);
  }, [isGenerating]);

  const generateFakeData = async () => {
    const paddedScanNumber = String(latestScanNumber + 1).padStart(4, '0');
    const scanNumber = `SCAN_${paddedScanNumber}`;

    // Replace this with actual sensor data retrieval logic
    const waveform = getWaveform(); // Replace with your actual logic to get waveform

    // Calculate a value that determines 'Good' or 'Bad' based on some condition
    const qualityValue = Math.random();

    // Generate an integer random voltage between 10V and 100V
    const voltage = Math.floor(Math.random() * 10) * 10 + 10;

    // Generate your fake data here
    const fakeData = {
      scanNumber: scanNumber,
      timestamp: serverTimestamp(),
      quality: '', // Quality will be determined by the model, leave it blank for now
      frequency: '40KHz',
      voltage: `${voltage}V`,
      waveform:'',
    };

    try {
      // Add the fakeData to a 'fakeData' collection in Firestore
      await addDoc(collection(FIRESTORE_DB, 'fakeData'), fakeData);
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
    return []; // Returning an empty array for the waveform
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
