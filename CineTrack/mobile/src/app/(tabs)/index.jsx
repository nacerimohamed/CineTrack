
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const movies = [
  {
    id: '1',
    title: 'Interstellar',
    year: '2014',
    rating: '8.7',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  },
  {
    id: '2',
    title: 'Inception',
    year: '2010',
    rating: '8.4',
    poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
  },
  {
    id: '3',
    title: 'The Batman',
    year: '2022',
    rating: '7.8',
    poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
  },
  {
    id: '4',
    title: 'Dune: Part Two',
    year: '2024',
    rating: '8.5',
    poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
  },
  {
    id: '5',
    title: 'Fight Club',
    year: '1999',
    rating: '8.8',
    poster: 'https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8Px.jpg',
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>
              CINE<Text style={styles.logoAccent}>TRACK</Text>
            </Text>
            <Text style={styles.tagline}>YOUR MOVIE JOURNAL</Text>
          </View>

          <Pressable style={styles.profileButton}>
            <Text style={styles.profileIcon}>M</Text>
          </Pressable>
        </View>

        {/* Welcome */}
        <View style={styles.welcome}>
          <Text style={styles.welcomeTitle}>Welcome back,</Text>
          <Text style={styles.welcomeSubtitle}>
            What are we watching today?
          </Text>
        </View>

        {/* Featured Movie */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>FEATURED</Text>
          <Text style={styles.sectionLabel}>MOVIE OF THE DAY</Text>
        </View>

        <ImageBackground
          source={{
            uri: movies[3].poster,
          }}
          style={styles.featured}
          imageStyle={styles.featuredImage}
        >
          <View style={styles.featuredOverlay}>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>âœ¦  EDITOR'S PICK</Text>
            </View>

            <View>
              <Text style={styles.featuredTitle}>DUNE: PART TWO</Text>
              <Text style={styles.featuredInfo}>
                2024  â€¢  SCI-FI / ADVENTURE
              </Text>

              <Pressable style={styles.watchButton}>
                <Text style={styles.watchButtonText}>
                  Explore movie  â†’
                </Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>

        {/* Trending */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>TRENDING NOW</Text>
            <Text style={styles.sectionDescription}>
              Movies everyone is talking about
            </Text>
          </View>

          <Text style={styles.seeAll}>SEE ALL â†’</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.movieList}
        >
          {movies.map((movie, index) => (
            <Pressable key={movie.id} style={styles.movieCard}>
              <View style={styles.posterContainer}>
                <Image
                  source={{ uri: movie.poster }}
                  style={styles.poster}
                  resizeMode="cover"
                />

                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>â˜… {movie.rating}</Text>
                </View>
              </View>

              <Text style={styles.movieTitle} numberOfLines={1}>
                {movie.title}
              </Text>

              <Text style={styles.movieYear}>{movie.year}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Popular */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>YOUR NEXT WATCH</Text>
            <Text style={styles.sectionDescription}>
              Discover something extraordinary
            </Text>
          </View>
        </View>

        <View style={styles.nextWatchCard}>
          <View style={styles.nextWatchIcon}>
            <Text style={styles.nextWatchEmoji}>ðŸŽ¬</Text>
          </View>

          <View style={styles.nextWatchContent}>
            <Text style={styles.nextWatchTitle}>
              Build your watchlist
            </Text>
            <Text style={styles.nextWatchDescription}>
              Save movies you want to watch later.
            </Text>
          </View>

          <Text style={styles.nextWatchArrow}>â†’</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          MADE FOR MOVIE LOVERS  â€¢  CINE TRACK
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 32,
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  logoAccent: {
    color: '#F05A3E',
  },
  tagline: {
    color: '#77777F',
    fontSize: 9,
    letterSpacing: 2.5,
    marginTop: 4,
  },
  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#242429',
    borderWidth: 1,
    borderColor: '#393940',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    color: '#F05A3E',
    fontWeight: '800',
    fontSize: 16,
  },
  welcome: {
    marginBottom: 28,
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
  },
  welcomeSubtitle: {
    color: '#9999A1',
    fontSize: 14,
    marginTop: 7,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  sectionLabel: {
    color: '#F05A3E',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  sectionDescription: {
    color: '#77777F',
    fontSize: 11,
    marginTop: 5,
  },
  seeAll: {
    color: '#F05A3E',
    fontSize: 10,
    fontWeight: '800',
  },
  featured: {
    height: 230,
    borderRadius: 17,
    overflow: 'hidden',
    justifyContent: 'space-between',
    marginBottom: 30,
    backgroundColor: '#292930',
  },
  featuredImage: {
    borderRadius: 17,
    opacity: 0.9,
  },
  featuredOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F05A3E',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 5,
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 1,
  },
  featuredInfo: {
    color: '#E0E0E0',
    fontSize: 10,
    marginTop: 7,
    letterSpacing: 1,
  },
  watchButton: {
    backgroundColor: '#F05A3E',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 7,
    marginTop: 15,
  },
  watchButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
  },
  movieList: {
    paddingBottom: 25,
    gap: 13,
  },
  movieCard: {
    width: 130,
  },
  posterContainer: {
    width: 130,
    height: 190,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#242429',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  ratingText: {
    color: '#F5C451',
    fontSize: 10,
    fontWeight: '800',
  },
  movieTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 9,
  },
  movieYear: {
    color: '#77777F',
    fontSize: 10,
    marginTop: 4,
  },
  nextWatchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17171C',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#292930',
    padding: 15,
    marginTop: 3,
  },
  nextWatchIcon: {
    width: 43,
    height: 43,
    borderRadius: 10,
    backgroundColor: '#29201F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextWatchEmoji: {
    fontSize: 21,
  },
  nextWatchContent: {
    flex: 1,
    marginLeft: 12,
  },
  nextWatchTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  nextWatchDescription: {
    color: '#85858D',
    fontSize: 10,
    marginTop: 5,
  },
  nextWatchArrow: {
    color: '#F05A3E',
    fontSize: 22,
  },
  footer: {
    textAlign: 'center',
    color: '#55555D',
    fontSize: 9,
    letterSpacing: 1.5,
    marginTop: 30,
  },
});

