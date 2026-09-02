import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { initNfc } from '../hooks/useNfc';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  useEffect(() => {
    initNfc();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
