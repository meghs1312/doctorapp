import { View, TextInput, ScrollView, Pressable, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { registerDoctor } from '@/redux/doctors/doctorThunks';

const PRIMARY = '#0a7ea4';
const INPUT_BG = '#f8f9fa';
const BORDER = '#e0e4e8';

type Step = 1 | 2;

export default function DoctorRegistrationScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [step1, setStep1] = useState({
    name: '',
    gender: '',
    age: '',
    email: '',
    phone: '',
    city: '',
    profile_picture: '',
  });
  const [step2, setStep2] = useState({
    institute_name: '',
    degree_name: '',
    speciality: '',
    yoe: '',
    consultation_fee: '',
  });

  const canNextStep1 = step1.name.trim() && step1.gender && step1.age.trim() && step1.email.trim() && step1.phone.trim() && step1.city.trim();
  const canSubmit = canNextStep1 && step2.institute_name.trim() && step2.degree_name.trim() && step2.speciality.trim() && step2.yoe.trim() && step2.consultation_fee.trim();

  const handleNext = () => {
    if (step === 1 && canNextStep1) setStep(2);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await dispatch(registerDoctor({
        name: step1.name.trim(),
        gender: step1.gender,
        age: parseInt(step1.age, 10),
        email: step1.email.trim(),
        phone: step1.phone.trim(),
        city: step1.city.trim(),
        profile_picture: step1.profile_picture.trim() || null,
        institute_name: step2.institute_name.trim(),
        degree_name: step2.degree_name.trim(),
        speciality: step2.speciality.trim(),
        yoe: parseInt(step2.yoe, 10),
        consultation_fee: parseFloat(step2.consultation_fee),
      }) as any).unwrap();
      Alert.alert('Success', 'Doctor registered successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
          <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
          <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
        </View>
        <ThemedText type="defaultSemiBold" style={styles.stepLabel}>Step {step} of 2</ThemedText>

        {step === 1 && (
          <View style={styles.form}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Personal Information</ThemedText>
            <TextInput style={styles.input} placeholder="Full name *" placeholderTextColor="#888" value={step1.name} onChangeText={(t) => setStep1((s) => ({ ...s, name: t }))} />
            <ThemedText style={styles.label}>Gender *</ThemedText>
            <View style={styles.radioRow}>
              {(['Male', 'Female', 'Other'] as const).map((g) => (
                <Pressable key={g} onPress={() => setStep1((s) => ({ ...s, gender: g }))} style={[styles.radio, step1.gender === g && styles.radioActive]}>
                  <ThemedText style={step1.gender === g ? styles.radioTextActive : undefined}>{g}</ThemedText>
                </Pressable>
              ))}
            </View>
            <TextInput style={styles.input} placeholder="Age *" placeholderTextColor="#888" keyboardType="number-pad" value={step1.age} onChangeText={(t) => setStep1((s) => ({ ...s, age: t }))} />
            <TextInput style={styles.input} placeholder="Email *" placeholderTextColor="#888" keyboardType="email-address" autoCapitalize="none" value={step1.email} onChangeText={(t) => setStep1((s) => ({ ...s, email: t }))} />
            <TextInput style={styles.input} placeholder="Phone *" placeholderTextColor="#888" keyboardType="phone-pad" value={step1.phone} onChangeText={(t) => setStep1((s) => ({ ...s, phone: t }))} />
            <TextInput style={styles.input} placeholder="City *" placeholderTextColor="#888" value={step1.city} onChangeText={(t) => setStep1((s) => ({ ...s, city: t }))} />
            <TextInput style={styles.input} placeholder="Profile picture URL (optional)" placeholderTextColor="#888" value={step1.profile_picture} onChangeText={(t) => setStep1((s) => ({ ...s, profile_picture: t }))} />
            <Pressable style={[styles.btn, !canNextStep1 && styles.btnDisabled]} onPress={handleNext} disabled={!canNextStep1}>
              <Text style={styles.btnText}>Next</Text>
            </Pressable>
          </View>
        )}

        {step === 2 && (
          <View style={styles.form}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Professional Details</ThemedText>
            <TextInput style={styles.input} placeholder="Institute name *" placeholderTextColor="#888" value={step2.institute_name} onChangeText={(t) => setStep2((s) => ({ ...s, institute_name: t }))} />
            <TextInput style={styles.input} placeholder="Degree (e.g. MBBS, MD) *" placeholderTextColor="#888" value={step2.degree_name} onChangeText={(t) => setStep2((s) => ({ ...s, degree_name: t }))} />
            <TextInput style={styles.input} placeholder="Speciality *" placeholderTextColor="#888" value={step2.speciality} onChangeText={(t) => setStep2((s) => ({ ...s, speciality: t }))} />
            <TextInput style={styles.input} placeholder="Years of experience *" placeholderTextColor="#888" keyboardType="number-pad" value={step2.yoe} onChangeText={(t) => setStep2((s) => ({ ...s, yoe: t }))} />
            <TextInput style={styles.input} placeholder="Consultation fee (₹) *" placeholderTextColor="#888" keyboardType="decimal-pad" value={step2.consultation_fee} onChangeText={(t) => setStep2((s) => ({ ...s, consultation_fee: t }))} />
            <Pressable style={[styles.btn, styles.btnSecondary]} onPress={() => setStep(1)}>
              <ThemedText style={styles.btnTextSecondary}>Back</ThemedText>
            </Pressable>
            <Pressable style={[styles.btn, (!canSubmit || loading) && styles.btnDisabled]} onPress={handleSubmit} disabled={!canSubmit || loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Register Doctor</Text>}
            </Pressable>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  stepIndicator: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 8 },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: BORDER },
  stepDotActive: { backgroundColor: PRIMARY },
  stepLine: { flex: 1, height: 2, backgroundColor: BORDER, marginHorizontal: 6 },
  stepLineActive: { backgroundColor: PRIMARY },
  stepLabel: { paddingHorizontal: 20, marginBottom: 20 },
  form: { paddingHorizontal: 20 },
  sectionTitle: { marginBottom: 16 },
  label: { marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: INPUT_BG,
  },
  radioRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  radio: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: BORDER },
  radioActive: { borderColor: PRIMARY, backgroundColor: '#e8f4fc' },
  radioTextActive: { color: PRIMARY, fontWeight: '600' },
  btn: { backgroundColor: PRIMARY, padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  btnSecondary: { backgroundColor: 'transparent', borderWidth: 2, borderColor: PRIMARY, marginTop: 12 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  btnTextSecondary: { color: PRIMARY, fontWeight: '600' },
});
