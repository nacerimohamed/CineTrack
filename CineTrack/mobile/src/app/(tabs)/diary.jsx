
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DiaryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>CINE<Text style={styles.orange}>TRACK</Text></Text>
      <Text style={styles.title}>Your Diary</Text>
      <Text style={styles.subtitle}>Every movie has a story.</Text>

      <View style={styles.card}>
        <Text style={styles.icon}>ðŸŽ¬</Text>
        <Text style={styles.cardTitle}>Your movie journey starts here</Text>
        <Text style={styles.description}>
          Movies you watch and rate will appear in your diary.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090B', padding: 22 },
  logo: { color: 'white', fontSize: 20, fontWeight: '900', marginTop: 15 },
  orange: { color: '#F05A3E' },
  title: { color: 'white', fontSize: 30, fontWeight: '900', marginTop: 45 },
  subtitle: { color: '#85858D', marginTop: 8 },
  card: {
    marginTop: 45, padding: 25, backgroundColor: '#17171C',
    borderRadius: 15, alignItems: 'center',
  },
  icon: { fontSize: 45, marginBottom: 18 },
  cardTitle: { color: 'white', fontWeight: '800', fontSize: 16, textAlign: 'center' },
  description: { color: '#85858D', textAlign: 'center', marginTop: 10, lineHeight: 21 },
});

