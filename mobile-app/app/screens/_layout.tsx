import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Doctor Discovery' }} />
      <Stack.Screen name="home/index" options={{ title: 'Home' }} />
      <Stack.Screen name="Doctorlisting/index" options={{ title: 'Doctor Listing' }} />
      <Stack.Screen name="DoctorDetail/[id]" options={{ title: 'Doctor Detail' }} />
      <Stack.Screen name="DoctorRegistration/index" options={{ title: 'Doctor Registration' }} />
    </Stack>
  );
}
