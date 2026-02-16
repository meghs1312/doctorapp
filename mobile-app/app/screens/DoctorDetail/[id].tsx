import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { clearSelectedDoctor } from '@/redux/doctors/doctorSlice';
import { fetchDoctorById } from '@/redux/doctors/doctorThunks';
import { apiGet } from '@/services/api';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const PRIMARY = '#0a7ea4';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/120?text=MD';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.rowLabel}>{label}</ThemedText>
      <ThemedText style={styles.rowValue}>{value}</ThemedText>
    </View>
  );
}

export default function DoctorDetailScreen() {
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = useMemo(() => (Array.isArray(idParam) ? idParam[0] : idParam) ?? '', [idParam]);
  const dispatch = useDispatch();
  const { selectedDoctor, loading, error } = useSelector((state: any) => state.doctors);
  const [topTenIds, setTopTenIds] = useState<number[]>([]);
  const [topTenLoaded, setTopTenLoaded] = useState(false);

  useEffect(() => {
    if (!id) return;
    dispatch(clearSelectedDoctor());
    dispatch(fetchDoctorById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (!selectedDoctor || topTenLoaded) return;
    apiGet('/doctors/top', { limit: 10 })
      .then((data: unknown) => {
//
        const list = Array.isArray(data) ? data : [];
        const ids = list.map((d: Record<string, unknown>) => {
          const rawId = d.id;
          if (rawId == null) return 0;
          const n = typeof rawId === 'number' ? rawId : Number(rawId);
          return Number.isFinite(n) ? n : 0;
        }).filter((n) => n > 0);

        setTopTenIds(ids);
        setTopTenLoaded(true);
      })
      .catch((error) => {
        console.error('Error fetching top doctors:', error);
        setTopTenLoaded(true);
      });
  }, [selectedDoctor, topTenLoaded]);

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={PRIMARY} />
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </ThemedView>
    );
  }
  if (!selectedDoctor) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.loadingText}>{error || 'Doctor not found.'}</ThemedText>
      </ThemedView>
    );
  }

  const doc = selectedDoctor as Record<string, unknown>;
  const pic = typeof doc.profile_picture === 'string' && doc.profile_picture ? doc.profile_picture : PLACEHOLDER_IMAGE;
  const doctorId = Number(id) || 0;
  const searchCount = Number(doc.search_count ?? 0);
  const isTopSearched = doctorId > 0 && (topTenIds.includes(doctorId) );
  


  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Profile picture + name block - picture always visible */}
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: pic }} style={styles.avatar} resizeMode="cover" />
          </View>
          <View style={styles.headerText}>
            <ThemedText type="title" numberOfLines={2} style={styles.name}>{String(doc.name ?? '')}</ThemedText>
            <ThemedText style={styles.speciality}>{String(doc.speciality ?? '')}</ThemedText>
            {/* Badge inline so it's always visible */}
            {isTopSearched && (
              <View style={styles.badgeInline}>
                <Text style={styles.badgeInlineText}>MOST SEARCHED</Text>
                <Text style={styles.badgeCountInline}> · {searchCount} profile views</Text>
              </View>
            )}
          </View>
        </View>

        {/* Full-width highlight block for top 10 */}
        {isTopSearched && (
          <View style={styles.mostSearchedSection}>
            <Text style={styles.searchCountBig}>{searchCount}</Text>
            <Text style={styles.searchCountSub}>profile views</Text>
          </View>
        )}

        <View style={styles.card}>
          <Row label="Gender" value={String(doc.gender ?? '—')} />
          <Row label="Age" value={String(doc.age ?? '—')} />
          <Row label="Email" value={String(doc.email ?? '—')} />
          <Row label="Phone" value={String(doc.phone ?? '—')} />
          <Row label="City" value={String(doc.city ?? '—')} />
          <Row label="Institute" value={String(doc.institute_name ?? '—')} />
          <Row label="Degree" value={String(doc.degree_name ?? '—')} />
          <Row label="Years of experience" value={String(doc.yoe ?? '—')} />
          <View style={[styles.row, styles.feeRow]}>
            <ThemedText style={styles.rowLabel}>Consultation fee</ThemedText>
            <ThemedText style={styles.feeValue}>₹{doc.consultation_fee ?? '—'}</ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 12 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  avatarWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: '#f0f0f0',
  },
  avatar: { width: 100, height: 100 },
  headerText: { flex: 1, justifyContent: 'center' },
  name: { marginBottom: 4 },
  speciality: { fontSize: 15, opacity: 0.9, marginBottom: 8 },
  badgeInline: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeInlineText: { color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
  badgeCountInline: { color: '#fff', fontSize: 12, marginLeft: 2 },

  mostSearchedSection: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#e8f4fc',
    borderWidth: 1,
    borderColor: PRIMARY,
    alignItems: 'center',
  },
  searchCountBig: { fontSize: 36, fontWeight: '700', color: PRIMARY },
  searchCountSub: { fontSize: 14, color: PRIMARY, marginTop: 4, opacity: 0.9 },

  card: { margin: 16, padding: 16, borderRadius: 12, backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#eee' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  feeRow: { borderBottomWidth: 0 },
  rowLabel: { fontSize: 14, opacity: 0.85 },
  rowValue: { fontSize: 15, fontWeight: '500', flex: 1, marginLeft: 12, textAlign: 'right' },
  feeValue: { fontSize: 18, fontWeight: '700', color: PRIMARY },
});
