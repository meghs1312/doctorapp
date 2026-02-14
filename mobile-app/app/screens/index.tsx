import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const PRIMARY = '#0a7ea4';
const PRIMARY_LIGHT = '#e8f4fc';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <ThemedText type="title" style={styles.title}>Doctor Discovery</ThemedText>
          <ThemedText style={styles.subtitle}>Register doctors or browse by city and speciality.</ThemedText>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
            onPress={() => router.push('/screens/DoctorRegistration')}
          >
            <ThemedText style={styles.primaryBtnText}>Register a Doctor</ThemedText>
            <ThemedText style={styles.primaryBtnHint}>Add a new doctor to the directory</ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
            onPress={() => router.push('/screens/home')}
          >
            <ThemedText type="defaultSemiBold" style={styles.secondaryBtnText}>Go to Home</ThemedText>
            <ThemedText style={styles.secondaryBtnHint}>Browse doctors, specialities and search</ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  hero: { marginBottom: 48 },
  title: { textAlign: 'center', marginBottom: 12 },
  subtitle: { textAlign: 'center', fontSize: 16, opacity: 0.85, lineHeight: 24 },
  actions: { gap: 16 },
  primaryBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 0,
  },
  secondaryBtn: {
    backgroundColor: PRIMARY_LIGHT,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: PRIMARY,
  },
  pressed: { opacity: 0.85 },
  primaryBtnText: { color: '#fff', fontSize: 18, fontWeight: '700', textAlign: 'center' },
  primaryBtnHint: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 4, textAlign: 'center' },
  secondaryBtnText: { color: PRIMARY, textAlign: 'center' },
  secondaryBtnHint: { fontSize: 13, marginTop: 4, textAlign: 'center', opacity: 0.9 },
});
