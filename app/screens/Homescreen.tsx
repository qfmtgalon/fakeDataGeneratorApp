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
       
        const latestScanRef = ref(REALTIME_DB, 'latestScanNumber');
        const snapshot = await get(latestScanRef);

        if (snapshot.exists()) {
          const latestScan = snapshot.val();
          setLatestScanNumber(latestScan);
        } else {
          
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
  
      const paddedScanNumber = String(newScanNumber).padStart(3, '0'); 
      const scanNumber = `SCAN_${paddedScanNumber}`;
  
      
      const waveform = getWaveform();
  
     
      const qualityValue = Math.random();
  
      // Generate an integer random voltage between 10V and 100V
      const voltage = Math.floor(Math.random() * 10) * 10 + 10;
  
      // Generate fake data
      const fakeData = {
        scanNumber: scanNumber,
        timestamp: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }), // Updated timestamp format
        quality: '',
        frequency: '40KHz',
        voltage: `${voltage}V`,
        waveform: '',
      };
  
     
      await set(ref(REALTIME_DB, 'latestScanNumber'), newScanNumber);
  
      
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

  
  const getWaveform = () => {
    
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
