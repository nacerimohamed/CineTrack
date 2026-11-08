import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { getMovieDetails, getMoviePoster } from '../../services/movie-service';
import { getUserMovies } from '../../services/user-movies';

export default function DiaryScreen() {
  const router = useRouter();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const loadDiary = async () => {
    try {
      setError(false);

      const savedMovies = await getUserMovies('watched');

      const details = await Promise.all(
        savedMovies.map(async (savedMovie) => {
          try {
            const movie = await getMovieDetails(savedMovie.movie_id);

            return {
              ...movie,
              watchedAt: savedMovie.watched_at,
              rating: savedMovie.rating,
              review: savedMovie.review,
            };
          } catch (err) {
            console.log('Movie details error:', err);
            return null;
          }
        })
      );

      setMovies(details.filter(Boolean));
    } catch (err) {
      console.log('Diary error:', err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDiary();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDiary();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#F05A3E"
          />
        }
      >
        <Text style={styles.logo}>
          CINE<Text style={styles.orange}>TRACK</Text>
        </Text>

        <Text style={styles.title}>Your Diary</Text>
        <Text style={styles.subtitle}>Every movie has a story.</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#F05A3E" />
            <Text style={styles.message}>Loading your diary...</Text>
          </View>
        ) : error ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Something went wrong</Text>
            <Text style={styles.description}>
              We couldn't load your diary. Pull down to try again.
            </Text>
            <Pressable
              style={styles.retryButton}
              onPress={loadDiary}
            >
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : movies.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.icon}>🎬</Text>
            <Text style={styles.cardTitle}>
              Your movie journey starts here
            </Text>
            <Text style={styles.description}>
              Movies you watch and rate will appear in your diary.
            </Text>
          </View>
        ) : (
          <View style={styles.movieList}>
            <Text style={styles.count}>
              {movies.length} {movies.length === 1 ? 'MOVIE WATCHED' : 'MOVIES WATCHED'}
            </Text>

            {movies.map((movie) => (
              <Pressable
                key={movie.id}
                style={styles.movieCard}
                onPress={() => router.push(`/movie/${movie.id}`)}
              >
                <Image
                  source={{ uri: getMoviePoster(movie.poster_path) }}
                  style={styles.poster}
                  contentFit="cover"
                />

                <View style={styles.movieInfo}>
                  <Text style={styles.movieTitle} numberOfLines={2}>
                    {movie.title}
                  </Text>

                  <Text style={styles.year}>
                    {movie.release_date
                      ? movie.release_date.slice(0, 4)
                      : 'Release date unknown'}
                  </Text>

                  <Text style={styles.movieOverview} numberOfLines={3}>
                    {movie.overview || 'No description available.'}
                  </Text>

                  {movie.rating !== null && movie.rating !== undefined && (
                    <Text style={styles.rating}>
                      ★ {Number(movie.rating).toFixed(1)} / 10
                    </Text>
                  )}

                  <Text style={styles.openDetails}>View details  ›</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
    paddingHorizontal: 22,
  },
  logo: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 15,
  },
  orange: {
    color: '#F05A3E',
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: '900',
    marginTop: 45,
  },
  subtitle: {
    color: '#85858D',
    marginTop: 8,
  },
  center: {
    marginTop: 80,
    alignItems: 'center',
  },
  message: {
    color: '#85858D',
    marginTop: 15,
  },
  card: {
    marginTop: 45,
    padding: 25,
    backgroundColor: '#17171C',
    borderRadius: 15,
    alignItems: 'center',
  },
  icon: {
    fontSize: 45,
    marginBottom: 18,
  },
  cardTitle: {
    color: 'white',
    fontWeight: '800',
    fontSize: 16,
    textAlign: 'center',
  },
  description: {
    color: '#85858D',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 21,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#F05A3E',
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '800',
  },
  movieList: {
    marginTop: 35,
    paddingBottom: 30,
  },
  count: {
    color: '#85858D',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 18,
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: '#17171C',
    borderRadius: 13,
    padding: 12,
    marginBottom: 14,
  },
  poster: {
    width: 105,
    height: 150,
    borderRadius: 9,
    backgroundColor: '#25252B',
  },
  movieInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  movieTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },
  year: {
    color: '#F05A3E',
    fontSize: 12,
    marginTop: 6,
  },
  movieOverview: {
    color: '#85858D',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 9,
  },
  rating: {
    color: '#F5C451',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 8,
  },
  openDetails: {
    color: '#F05A3E',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
  },
});
