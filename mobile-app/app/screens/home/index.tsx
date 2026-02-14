import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { fetchTopDoctors } from '@/redux/doctors/doctorThunks';
import { setSearch, setCity, setSpeciality } from '@/redux/filters/filterSlice';
import { CITIES, SPECIALITIES } from '@/constants/theme';

const PRIMARY = '#0a7ea4';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/56?text=MD';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { topDoctors } = useSelector((state: { doctors: { topDoctors: Array<Record<string, unknown>> } }) => state.doctors);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('');

  useEffect(() => {
    dispatch(fetchTopDoctors());
  }, [dispatch]);

  const goToListing = (filters?: { search?: string; city?: string; speciality?: string }) => {
    if (filters) {
      if (filters.search !== undefined) dispatch(setSearch(filters.search));
      if (filters.city !== undefined) dispatch(setCity(filters.city));
      if (filters.speciality !== undefined) dispatch(setSpeciality(filters.speciality));
    }
    router.push('/screens/Doctorlisting');
  };

  const handleSearchSubmit = () => {
    goToListing({
      search: searchInput.trim(),
      city: selectedCity,
      speciality: selectedSpeciality,
    });
  };

  const top4 = Array.isArray(topDoctors) ? topDoctors.slice(0, 4) : [];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Section 1: Most Searched Doctors - VERTICAL list */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Most Searched Doctors</ThemedText>
          <View style={styles.verticalList}>
            {top4.map((doc: Record<string, unknown>) => {
              const pic = (typeof doc.profile_picture === 'string' && doc.profile_picture) ? doc.profile_picture : PLACEHOLDER_IMAGE;
              return (
                <Pressable
                  key={String(doc.id)}
                  style={({ pressed }) => [styles.doctorCard, pressed && styles.cardPressed]}
                  onPress={() => router.push(`/screens/DoctorDetail/${doc.id}`)}
                >
                  <Image source={{ uri: pic }} style={styles.doctorAvatar} />
                  <View style={styles.doctorCardBody}>
                    <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.doctorName}>{String(doc.name ?? '')}</ThemedText>
                    <ThemedText style={styles.cardSub}>{String(doc.speciality ?? '')}</ThemedText>
                    <ThemedText style={styles.cardSub}>{String(doc.city ?? '')} · ₹{doc.consultation_fee ?? '—'}</ThemedText>
                  </View>
                </Pressable>
              );
            })}
            {top4.length === 0 && (
              <View style={styles.emptyCard}>
                <ThemedText style={styles.emptyHint}>No doctors yet.</ThemedText>
                <ThemedText style={styles.emptyHintSub}>Register one to get started.</ThemedText>
              </View>
            )}
          </View>
        </View>

        {/* Section 2: Speciality Tags */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Browse by Speciality</ThemedText>
          <View style={styles.tagsWrap}>
            {SPECIALITIES.map((spec) => (
              <Pressable
                key={spec}
                style={({ pressed }) => [styles.tag, pressed && styles.tagPressed]}
                onPress={() => goToListing({ speciality: spec })}
              >
                <ThemedText type="defaultSemiBold" style={styles.tagText}>{spec}</ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Section 3: Search and Filter */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Search & Filter</ThemedText>
          <TextInput style={styles.input} placeholder="Doctor name" placeholderTextColor="#999" value={searchInput} onChangeText={setSearchInput} />
          <TextInput style={styles.input} placeholder="City" placeholderTextColor="#999" value={selectedCity} onChangeText={setSelectedCity} />
          <TextInput style={styles.input} placeholder="Speciality" placeholderTextColor="#999" value={selectedSpeciality} onChangeText={setSelectedSpeciality} />
          <Pressable style={({ pressed }) => [styles.searchBtn, pressed && styles.btnPressed]} onPress={handleSearchSubmit}>
            <Text style={styles.searchBtnText}>Search Doctors</Text>
          </Pressable>
        </View>

        <Pressable style={({ pressed }) => [styles.registerBtn, pressed && styles.btnPressed]} onPress={() => router.push('/screens/DoctorRegistration')}>
          <ThemedText type="defaultSemiBold" style={styles.registerBtnText}>Register a Doctor</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  section: { marginBottom: 28, paddingHorizontal: 20 },
  sectionTitle: { marginBottom: 14 },
  verticalList: {},
  doctorCard: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardPressed: { opacity: 0.9 },
  doctorAvatar: { width: 56, height: 56, borderRadius: 28, marginRight: 14 },
  doctorCardBody: { flex: 1 },
  doctorName: { marginBottom: 4 },
  cardSub: { fontSize: 13, marginTop: 2, opacity: 0.9 },
  emptyCard: { padding: 24, alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 12, borderWidth: 1, borderColor: '#eee', marginTop: 4 },
  emptyHint: { fontStyle: 'italic' },
  emptyHintSub: { fontSize: 13, marginTop: 4, opacity: 0.8 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, backgroundColor: '#f0f4f8', borderWidth: 1, borderColor: '#e0e4e8' },
  tagPressed: { opacity: 0.85 },
  tagText: { fontSize: 14 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, marginBottom: 12, fontSize: 16 },
  searchBtn: { backgroundColor: PRIMARY, padding: 16, borderRadius: 10, alignItems: 'center' },
  btnPressed: { opacity: 0.9 },
  searchBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  registerBtn: { marginHorizontal: 20, padding: 16, borderRadius: 10, alignItems: 'center', borderWidth: 2, borderColor: PRIMARY },
  registerBtnText: { color: PRIMARY },
});
