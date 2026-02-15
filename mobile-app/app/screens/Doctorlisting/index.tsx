import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CITIES, SPECIALITIES } from '@/constants/theme';
import { clearList } from '@/redux/doctors/doctorSlice';
import { fetchDoctorsWithFilters } from '@/redux/doctors/doctorThunks';
import { setCities, setSearch, setSpecialities } from '@/redux/filters/filterSlice';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const PRIMARY = '#0a7ea4';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/80?text=MD';

function DoctorCard({ item, onPress }: { item: Record<string, unknown>; onPress: () => void }) {
  const pic = typeof item.profile_picture === 'string' && item.profile_picture ? item.profile_picture : PLACEHOLDER_IMAGE;

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={onPress}>
      <Image source={{ uri: pic }} style={styles.avatar} />
      <View style={styles.cardBody}>
        <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.name}>{String(item.name ?? '')}</ThemedText>
        <ThemedText style={styles.speciality}>{String(item.speciality ?? '')}</ThemedText>
        <View style={styles.row}>
          <ThemedText style={styles.meta}>{String(item.yoe ?? '—')} yrs exp</ThemedText>
          <ThemedText style={styles.dot}> · </ThemedText>
          <ThemedText style={styles.meta}>{String(item.city ?? '')}</ThemedText>
        </View>
        <ThemedText style={styles.qual} numberOfLines={1}>Qualification: {String(item.degree_name ?? '—')}</ThemedText>
        <ThemedText style={styles.fee}>₹{item.consultation_fee ?? '—'} consultation</ThemedText>
      </View>
    </Pressable>
  );
}

export default function DoctorListingScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { list, listLoading, hasMore, page } = useSelector((state: any) => state.doctors);
  const { search, cities, specialities } = useSelector((state: any) => state.filters);

  const [searchInput, setSearchInput] = useState(search);
  const [selectedCities, setSelectedCities] = useState<string[]>(cities ?? []);
  const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>(specialities ?? []);

  useEffect(() => {
    setSearchInput(search);
    setSelectedCities(Array.isArray(cities) ? cities : []);
    setSelectedSpecialities(Array.isArray(specialities) ? specialities : []);
  }, [search, cities, specialities]);

  const load = useCallback((append: boolean) => {
    const nextPage = append ? page + 1 : 1;
    dispatch(fetchDoctorsWithFilters({
      search: searchInput.trim() || undefined,
      cities: selectedCities.length ? selectedCities : undefined,
      specialities: selectedSpecialities.length ? selectedSpecialities : undefined,
      page: nextPage,
      limit: 10,
      append,
    }) as any);
  }, [dispatch, searchInput, selectedCities, selectedSpecialities, page]);

  useEffect(() => {
    dispatch(clearList());
    load(false);
  }, [load]);

  const applyFilters = () => {
    dispatch(setSearch(searchInput.trim()));
    dispatch(setCities(selectedCities));
    dispatch(setSpecialities(selectedSpecialities));
    dispatch(clearList());
    dispatch(fetchDoctorsWithFilters({
      search: searchInput.trim() || undefined,
      cities: selectedCities.length ? selectedCities : undefined,
      specialities: selectedSpecialities.length ? selectedSpecialities : undefined,
      page: 1,
      limit: 10,
      append: false,
    }) as any);
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

  const loadMore = () => {
    if (!listLoading && hasMore) load(true);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.label}>Search by name</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Doctor name"
          placeholderTextColor="#999"
          value={searchInput}
          onChangeText={setSearchInput}
        />
        <ThemedText style={styles.filterLabel}>Filter by City</ThemedText>
        <View style={styles.filterWrap}>
          {CITIES.map((c) => {
            const isSelected = selectedCities.includes(c);
            return (
              <Pressable
                key={c}
                style={({ pressed }) => [
                  styles.filterChip,
                  isSelected && styles.filterChipSelected,
                  pressed && styles.filterChipPressed,
                ]}
                onPress={() => toggleCity(c)}
              >
                <ThemedText style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>{c}</ThemedText>
              </Pressable>
            );
          })}
        </View>
        <ThemedText style={styles.filterLabel}>Filter by Speciality</ThemedText>
        <View style={styles.filterWrap}>
          {SPECIALITIES.map((s) => {
            const isSelected = selectedSpecialities.includes(s);
            return (
              <Pressable
                key={s}
                style={({ pressed }) => [
                  styles.filterChip,
                  isSelected && styles.filterChipSelected,
                  pressed && styles.filterChipPressed,
                ]}
                onPress={() => toggleSpeciality(s)}
              >
                <ThemedText style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>{s}</ThemedText>
              </Pressable>
            );
          })}
        </View>
        <Pressable style={({ pressed }) => [styles.applyBtn, pressed && styles.btnPressed]} onPress={applyFilters}>
          <ThemedText style={styles.applyBtnText}>Apply</ThemedText>
        </Pressable>
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={list.length === 0 ? styles.listEmpty : styles.listContent}
        renderItem={({ item }) => (
          <DoctorCard item={item} onPress={() => router.push(`/screens/DoctorDetail/${item.id}`)} />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          listLoading ? (
            <ActivityIndicator size="large" color={PRIMARY} style={styles.loader} />
          ) : (
            <ThemedText style={styles.empty}>No doctors found. Try different filters.</ThemedText>
          )
        }
        ListFooterComponent={listLoading && list.length > 0 ? <ActivityIndicator color={PRIMARY} style={styles.footerLoader} /> : null}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
    opacity: 0.9,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 16,
  },
  filterLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8, opacity: 0.9 },
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
  applyBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  btnPressed: { opacity: 0.9 },
  applyBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  listContent: { padding: 16, paddingBottom: 32 },
  listEmpty: { flexGrow: 1, justifyContent: 'center', paddingTop: 48 },
  card: {
    flexDirection: 'row',
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardPressed: { opacity: 0.95 },
  avatar: { width: 72, height: 72, borderRadius: 36, marginRight: 14 },
  cardBody: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 16, marginBottom: 2 },
  speciality: { fontSize: 14, opacity: 0.9, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  meta: { fontSize: 13, opacity: 0.85 },
  dot: { fontSize: 13, opacity: 0.6 },
  qual: { fontSize: 12, opacity: 0.8, marginTop: 4 },
  fee: { fontSize: 15, fontWeight: '600', marginTop: 6 },
  loader: { marginTop: 24 },
  empty: { textAlign: 'center', fontSize: 15 },
  footerLoader: { padding: 16 },
});
