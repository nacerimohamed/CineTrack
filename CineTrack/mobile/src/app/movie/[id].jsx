import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import {
  getMovieDetails,
  getMoviePoster,
} from '../../services/movie-service';

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watched, setWatched] = useState(false);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getMovieDetails(id);
      setMovie(data);
    } catch (err) {
      console.log('Movie details error:', err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchMovie();
  }, [id]);

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0
      ? `${hours}h ${remainingMinutes}min`
      : `${remainingMinutes}min`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <StatusBar barStyle="light-content" backgroundColor="#09090B" />
        <ActivityIndicator size="large" color="#F05A3E" />
        <Text style={styles.loadingText}>Loading movie details...</Text>
      </SafeAreaView>
    );
  }

  if (error || !movie) {
    return (
      <SafeAreaView style={styles.center}>
        <StatusBar barStyle="light-content" backgroundColor="#09090B" />
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>
          We couldn't load this movie. Please try again.
        </Text>
        <Pressable style={styles.retryButton} onPress={fetchMovie}>
          <Text style={styles.retryText}>TRY AGAIN</Text>
        </Pressable>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>GO BACK</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const poster = getMoviePoster(movie.poster_path, 'w780');
  const year = movie.release_date
    ? movie.release_date.substring(0, 4)
    : 'N/A';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>MOVIE DETAILS</Text>
          <View style={{ width: 42 }} />
        </View>

        <View style={styles.posterContainer}>
          {poster ? (
            <Image
              source={{ uri: poster }}
              style={styles.poster}
              contentFit="cover"
              transition={300}
            />
          ) : (
            <View style={[styles.poster, styles.noPoster]}>
              <Text style={styles.noPosterText}>NO POSTER</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.movieTitle}>{movie.title}</Text>

          {movie.original_title !== movie.title && (
            <Text style={styles.originalTitle}>
              Original title: {movie.original_title}
            </Text>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>{year}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.infoText}>
              {formatRuntime(movie.runtime)}
            </Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.rating}>
              ★ {Number(movie.vote_average || 0).toFixed(1)}
            </Text>
          </View>

          <View style={styles.genresContainer}>
            {movie.genres?.map((genre) => (
              <View key={genre.id} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre.name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.buttonsContainer}>
            <Pressable
              style={[
                styles.actionButton,
                inWatchlist && styles.activeButton,
              ]}
              onPress={() => setInWatchlist(!inWatchlist)}
            >
              <Text style={styles.actionButtonText}>
                {inWatchlist ? '✓ ADDED TO WATCHLIST' : '+ WATCHLIST'}
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.actionButton,
                styles.watchedButton,
                watched && styles.activeButton,
              ]}
              onPress={() => setWatched(!watched)}
            >
              <Text style={styles.actionButtonText}>
                {watched ? '✓ WATCHED' : '✓ MARK AS WATCHED'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>OVERVIEW</Text>
            <Text style={styles.overview}>
              {movie.overview || 'No overview available for this movie.'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RELEASE DATE</Text>
            <Text style={styles.detailText}>
              {movie.release_date || 'Not available'}
            </Text>
          </View>

          {movie.status ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>STATUS</Text>
              <Text style={styles.detailText}>{movie.status}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  center: {
    flex: 1,
    backgroundColor: '#09090B',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  loadingText: {
    color: '#A1A1AA',
    marginTop: 15,
    fontSize: 13,
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    color: '#A1A1AA',
    textAlign: 'center',
    marginBottom: 25,
  },
  retryButton: {
    backgroundColor: '#F05A3E',
    paddingHorizontal: 30,
    paddingVertical: 13,
    borderRadius: 10,
    marginBottom: 20,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  backText: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 36,
  },
  headerTitle: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  posterContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  poster: {
    width: '100%',
    height: 430,
    borderRadius: 18,
    backgroundColor: '#18181B',
  },
  noPoster: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPosterText: {
    color: '#71717A',
  },
  content: {
    padding: 20,
  },
  movieTitle: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  originalTitle: {
    color: '#71717A',
    fontSize: 12,
    marginTop: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
    gap: 10,
  },
  infoText: {
    color: '#A1A1AA',
    fontSize: 13,
  },
  dot: {
    color: '#52525B',
  },
  rating: {
    color: '#F5B942',
    fontSize: 14,
    fontWeight: 'bold',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
  },
  genreTag: {
    backgroundColor: '#202024',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  genreText: {
    color: '#D4D4D8',
    fontSize: 11,
  },
  buttonsContainer: {
    gap: 10,
    marginTop: 25,
  },
  actionButton: {
    backgroundColor: '#F05A3E',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  watchedButton: {
    backgroundColor: '#202024',
  },
  activeButton: {
    backgroundColor: '#287A52',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    color: '#F05A3E',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 12,
  },
  overview: {
    color: '#D4D4D8',
    fontSize: 14,
    lineHeight: 24,
  },
  detailText: {
    color: '#D4D4D8',
    fontSize: 14,
  },
});
