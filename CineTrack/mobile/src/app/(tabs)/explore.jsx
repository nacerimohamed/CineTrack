
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getTrendingMovies,
  searchMovies,
  getMoviePoster,
} from '../../services/movie-service';

export default function ExploreScreen() {
  const router = useRouter();

  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    try {
      setLoading(true);
      setError('');
      setIsSearch(false);

      const data = await getTrendingMovies();
      setMovies(data.results || []);
    } catch (err) {
      console.log('Trending error:', err.message);
      setError('Unable to load movies. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const value = query.trim();

    if (!value) {
      loadTrending();
      return;
    }

    Keyboard.dismiss();

    try {
      setSearching(true);
      setError('');
      setIsSearch(true);

      const data = await searchMovies(value);
      setMovies(data.results || []);
    } catch (err) {
      console.log('Search error:', err.message);
      setError('Search failed. Please try again.');
      setMovies([]);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    loadTrending();
  };

  const renderMovie = (movie) => {
    const poster = getMoviePoster(movie.poster_path);

    return (
      <Pressable
        key={movie.id}
        style={styles.movieCard}
        onPress={() => router.push(`/movie/${movie.id}`)}
      >
        <View style={styles.posterContainer}>
          {poster ? (
            <Image
              source={{ uri: poster }}
              style={styles.poster}
              contentFit="cover"
              transition={300}
            />
          ) : (
            <View style={styles.noPoster}>
              <Text style={styles.noPosterText}>NO IMAGE</Text>
            </View>
          )}

          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>
              {'★'} {Number(movie.vote_average || 0).toFixed(1)}
            </Text>
          </View>
        </View>

        <Text style={styles.movieTitle} numberOfLines={1}>
          {movie.title}
        </Text>

        <Text style={styles.movieYear}>
          {movie.release_date
            ? movie.release_date.substring(0, 4)
            : 'Unknown year'}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>
              CINE<Text style={styles.logoAccent}>TRACK</Text>
            </Text>
            <Text style={styles.tagline}>DISCOVER YOUR NEXT MOVIE</Text>
          </View>

          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>EXPLORE</Text>
          </View>
        </View>

        <View style={styles.intro}>
          <Text style={styles.title}>Discover</Text>
          <Text style={styles.subtitle}>
            Find movies worth remembering.
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
            placeholderTextColor="#77777F"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
          />

          {query.length > 0 && (
            <Pressable onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearText}>X</Text>
            </Pressable>
          )}

          <Pressable
            onPress={handleSearch}
            style={styles.searchButton}
            disabled={searching}
          >
            <Text style={styles.searchButtonText}>GO</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              {isSearch ? 'SEARCH RESULTS' : 'TRENDING THIS WEEK'}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {isSearch
                ? `Results for "${query.trim()}"`
                : 'Popular movies right now'}
            </Text>
          </View>

          {!isSearch && (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>

        {(loading || searching) && (
          <View style={styles.centerMessage}>
            <ActivityIndicator size="large" color="#F05A3E" />
            <Text style={styles.messageText}>
              Discovering movies...
            </Text>
          </View>
        )}

        {!loading && !searching && error !== '' && (
          <View style={styles.centerMessage}>
            <Text style={styles.errorText}>{error}</Text>

            <Pressable
              style={styles.retryButton}
              onPress={isSearch ? handleSearch : loadTrending}
            >
              <Text style={styles.retryText}>TRY AGAIN</Text>
            </Pressable>
          </View>
        )}

        {!loading &&
          !searching &&
          !error &&
          movies.length === 0 && (
            <View style={styles.centerMessage}>
              <Text style={styles.emptyTitle}>No movies found</Text>
              <Text style={styles.messageText}>
                Try searching with another title.
              </Text>
            </View>
          )}

        {!loading && !searching && !error && movies.length > 0 && (
          <View style={styles.movieGrid}>
            {movies.map(renderMovie)}
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            MOVIE DATA POWERED BY TMDB
          </Text>
          <Text style={styles.footerSubtext}>
            MADE FOR MOVIE LOVERS
          </Text>
        </View>
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
    marginBottom: 35,
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
    letterSpacing: 2,
    marginTop: 4,
  },
  headerBadge: {
    backgroundColor: '#211B1A',
    borderWidth: 1,
    borderColor: '#49302B',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 7,
  },
  headerBadgeText: {
    color: '#F05A3E',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  intro: {
    marginBottom: 25,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
  },
  subtitle: {
    color: '#92929A',
    fontSize: 13,
    marginTop: 7,
  },
  searchContainer: {
    height: 55,
    backgroundColor: '#18181D',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#303037',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginBottom: 32,
  },
  searchIcon: {
    color: '#F05A3E',
    fontSize: 27,
    marginRight: 9,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    height: '100%',
  },
  clearButton: {
    padding: 8,
  },
  clearText: {
    color: '#9999A1',
    fontSize: 13,
    fontWeight: '800',
  },
  searchButton: {
    backgroundColor: '#F05A3E',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 7,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 19,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  sectionSubtitle: {
    color: '#77777F',
    fontSize: 11,
    marginTop: 6,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17231D',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#50C878',
    marginRight: 6,
  },
  liveText: {
    color: '#50C878',
    fontSize: 9,
    fontWeight: '900',
  },
  movieGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  movieCard: {
    width: '48%',
    marginBottom: 24,
  },
  posterContainer: {
    width: '100%',
    height: 235,
    borderRadius: 11,
    overflow: 'hidden',
    backgroundColor: '#202027',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  noPoster: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPosterText: {
    color: '#77777F',
    fontSize: 11,
    fontWeight: '800',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 9,
    left: 9,
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 6,
  },
  ratingText: {
    color: '#F5C451',
    fontSize: 10,
    fontWeight: '900',
  },
  movieTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 10,
  },
  movieYear: {
    color: '#77777F',
    fontSize: 11,
    marginTop: 5,
  },
  centerMessage: {
    minHeight: 190,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    color: '#92929A',
    fontSize: 12,
    marginTop: 12,
  },
  errorText: {
    color: '#F08070',
    fontSize: 13,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#F05A3E',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 7,
    marginTop: 15,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  footer: {
    alignItems: 'center',
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#242429',
  },
  footerText: {
    color: '#77777F',
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '800',
  },
  footerSubtext: {
    color: '#4F4F57',
    fontSize: 8,
    letterSpacing: 1.5,
    marginTop: 7,
  },
});
