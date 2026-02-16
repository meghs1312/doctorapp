import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { fetchTopDoctors } from '@/redux/doctors/doctorThunks';
import { setSearch, setCities, setSpecialities } from '@/redux/filters/filterSlice';
import { CITIES, SPECIALITIES } from '@/constants/theme';

const PRIMARY = '#0a7ea4';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/56?text=MD';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { topDoctors } = useSelector((state: { doctors: { topDoctors: Array<Record<string, unknown>> } }) => state.doctors);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchTopDoctors() );
  }, [dispatch]);

  const goToListing = (filters?: { search?: string; cities?: string[]; specialities?: string[] }) => {
    if (filters) {
      if (filters.search !== undefined) dispatch(setSearch(filters.search));
      if (filters.cities !== undefined) dispatch(setCities(filters.cities));
      if (filters.specialities !== undefined) dispatch(setSpecialities(filters.specialities));
    }
    router.push('/screens/Doctorlisting');
  };

  const handleSearchSubmit = () => {
    goToListing({
      search: searchInput.trim(),
      cities: selectedCities,
      specialities: selectedSpecialities,
    });
  };

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const toggleSpeciality = (spec: string) => {
    setSelectedSpecialities((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const top4 = Array.isArray(topDoctors) ? topDoctors.slice(0,4) : [];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Most Searched Doctors</ThemedText>
          <View style={styles.verticalList}>
            {top4.map((doc: Record<string, unknown>) => {

              return (
                <Pressable
                  key={String(doc.id)}
                  style={({ pressed }) => [styles.doctorCard, pressed && styles.cardPressed]}
                  onPress={() => router.push(`/screens/DoctorDetail/${doc.id}`)}
                >

                  <View style={styles.doctorCardBody}>
                    <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.doctorName}>{String(doc.name ?? '')}</ThemedText>
                    <ThemedText style={styles.cardSub}>{String(doc.speciality ?? '')}</ThemedText>
                    <ThemedText style={styles.cardSub}>{String(doc.city ?? '')} · ₹{String(doc.consultation_fee ?? '—')}</ThemedText>
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


        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Browse by Speciality</ThemedText>
          <View style={styles.tagsWrap}>
            {SPECIALITIES.map((spec) => (
              <Pressable
                key={spec}
                style={({ pressed }) => [styles.tag, pressed && styles.tagPressed]}
                onPress={() => goToListing({ specialities: [spec], search: searchInput.trim(), cities: selectedCities })}
              >
                <ThemedText type="defaultSemiBold" style={styles.tagText}>
                  {spec}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Search & Filter</ThemedText>
          <TextInput style={styles.input} placeholder="Doctor name" placeholderTextColor="#999" value={searchInput} onChangeText={setSearchInput} />
          <ThemedText style={styles.filterLabel}>Filter by City</ThemedText>
          <View style={styles.filterWrap}>
            {CITIES.map((city) => {
              const isSelected = selectedCities.includes(city);
              return (
                <Pressable
                  key={city}
                  style={({ pressed }) => [
                    styles.filterChip,
                    isSelected && styles.filterChipSelected,
                    pressed && styles.filterChipPressed,
                  ]}
                  onPress={() => toggleCity(city)}
                >
                  <ThemedText style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>{city}</ThemedText>
                </Pressable>
              );
            })}
          </View>
          <ThemedText style={styles.filterLabel}>Filter by Speciality</ThemedText>
          <View style={styles.filterWrap}>
            {SPECIALITIES.map((spec) => {
              const isSelected = selectedSpecialities.includes(spec);
              return (
                <Pressable
                  key={spec}
                  style={({ pressed }) => [
                    styles.filterChip,
                    isSelected && styles.filterChipSelected,
                    pressed && styles.filterChipPressed,
                  ]}
                  onPress={() => toggleSpeciality(spec)}
                >
                  <ThemedText style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>{spec}</ThemedText>
                </Pressable>
              );
            })}
          </View>
          <Pressable style={({ pressed }) => [styles.searchBtn, pressed && styles.btnPressed]} onPress={handleSearchSubmit}>
            <Text style={styles.searchBtnText}>Search Doctors</Text>
          </Pressable>
        </View>

        <Pressable style={({ pressed }) => [styles.registerBtn, pressed && styles.btnPressed]} onPress={() => router.push('/screens/DoctorRegistration')}>

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
  tagSelected: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  tagPressed: { opacity: 0.85 },
  tagText: { fontSize: 14 },
  tagTextSelected: { color: '#fff' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 16 },
  filterLabel: { fontSize: 14, fontWeight: '600', marginBottom: 10, opacity: 0.9 },
  filterWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f4f8',
    borderWidth: 1,
    borderColor: '#e0e4e8',
  },
  filterChipSelected: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  filterChipPressed: { opacity: 0.9 },
  filterChipText: { fontSize: 13 },
  filterChipTextSelected: { color: '#fff', fontWeight: '600' },
  searchBtn: { backgroundColor: PRIMARY, padding: 16, borderRadius: 10, alignItems: 'center' },
  btnPressed: { opacity: 0.9 },
  searchBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },

});
