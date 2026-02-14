import { View, TextInput, FlatList, Pressable, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { fetchDoctorsWithFilters } from '@/redux/doctors/doctorThunks';
import { setSearch, setCity, setSpeciality } from '@/redux/filters/filterSlice';
import { clearList } from '@/redux/doctors/doctorSlice';

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
  const { search, city, speciality } = useSelector((state: any) => state.filters);

  const [searchInput, setSearchInput] = useState(search);
  const [cityInput, setCityInput] = useState(city);
  const [specialityInput, setSpecialityInput] = useState(speciality);

  const load = useCallback((append: boolean) => {
    const nextPage = append ? page + 1 : 1;
    dispatch(fetchDoctorsWithFilters({
      search: searchInput.trim() || undefined,
      city: cityInput || undefined,
      speciality: specialityInput || undefined,
      page: nextPage,
      limit: 10,
      append,
    }) as any);
  }, [dispatch, searchInput, cityInput, specialityInput, page]);

  useEffect(() => {
    dispatch(clearList());
    load(false);
  }, []);

  const applyFilters = () => {
    dispatch(setSearch(searchInput.trim()));
    dispatch(setCity(cityInput));
    dispatch(setSpeciality(specialityInput));
    dispatch(clearList());
    dispatch(fetchDoctorsWithFilters({
      search: searchInput.trim() || undefined,
      city: cityInput || undefined,
      speciality: specialityInput || undefined,
      page: 1,
      limit: 10,
      append: false,
    }) as any);
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
        <View style={styles.filterRow}>
          <View style={styles.filterHalf}>
            <ThemedText style={styles.label}>City</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mumbai"
              placeholderTextColor="#999"
              value={cityInput}
              onChangeText={setCityInput}
            />
          </View>
          <View style={styles.filterHalf}>
            <ThemedText style={styles.label}>Speciality</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="e.g. Cardiologist"
              placeholderTextColor="#999"
              value={specialityInput}
              onChangeText={setSpecialityInput}
            />
          </View>
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
    marginBottom: 12,
  },
  filterRow: { flexDirection: 'row', gap: 12 },
  filterHalf: { flex: 1 },
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
