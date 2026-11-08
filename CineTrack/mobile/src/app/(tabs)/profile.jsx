import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import useAuthStore from '../../store/auth-store';
import { getUserMovies } from '../../services/user-movies';
import {
  getMovieDetails,
  getMoviePoster,
} from '../../services/movie-service';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [watched, setWatched] = useState([]);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [error, setError] = useState(false);

  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || 'M';

  const loadProfile = useCallback(async () => {
    try {
      setError(false);

      const [watchedMovies, watchlistMovies] = await Promise.all([
        getUserMovies('watched'),
        getUserMovies('watchlist'),
      ]);

      setWatchlistCount(watchlistMovies.length);

      const recentMovies = [...watchedMovies]
        .sort((a, b) => {
          return new Date(b.watched_at || b.created_at) -
            new Date(a.watched_at || a.created_at);
        })
        .slice(0, 5);

      const details = await Promise.all(
        recentMovies.map(async (savedMovie) => {
          try {
            const movie = await getMovieDetails(savedMovie.movie_id);

            return {
              ...movie,
              rating: savedMovie.rating,
              review: savedMovie.review,
            };
          } catch (err) {
            console.log('Profile movie error:', err.message);
            return null;
          }
        })
      );

      setWatched(details.filter(Boolean));
    } catch (err) {
      console.log('Profile loading error:', err.response?.data || err.message);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const onRefresh = () => {
    setRefreshing(true);
    loadProfile();
  };

  const totalReviews = watched.filter(
    (movie) => movie.rating !== null && movie.rating !== undefined ||
      movie.review?.trim()
  ).length;

  const ratedMovies = watched.filter(
    (movie) => movie.rating !== null && movie.rating !== undefined
  );

  const averageRating = ratedMovies.length
    ? (
        ratedMovies.reduce(
          (total, movie) => total + Number(movie.rating),
          0
        ) / ratedMovies.length
      ).toFixed(1)
    : '—';

  const handleLogout = () => {
    Alert.alert(
      'Sign out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: async () => {
            try {
              setLogoutLoading(true);
              await logout();
              router.replace('/(auth)/login');
            } finally {
              setLogoutLoading(false);
            }
          },
        },
      ]
    );
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

        <Text style={styles.title}>Your Profile</Text>

        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>

          <Text style={styles.name}>{user?.name || 'Movie Lover'}</Text>
          <Text style={styles.email}>
            {user?.email || 'No email available'}
          </Text>
          <Text style={styles.memberLabel}>CINETRACK MEMBER</Text>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#F05A3E" />
            <Text style={styles.message}>Loading your statistics...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>
              Could not load your profile statistics.
            </Text>
            <Pressable style={styles.retryButton} onPress={loadProfile}>
              <Text style={styles.retryText}>TRY AGAIN</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.number}>{watched.length}</Text>
                <Text style={styles.label}>WATCHED</Text>
              </View>

              <View style={styles.separator} />

              <View style={styles.stat}>
                <Text style={styles.number}>{totalReviews}</Text>
                <Text style={styles.label}>REVIEWS</Text>
              </View>

              <View style={styles.separator} />

              <View style={styles.stat}>
                <Text style={styles.number}>{watchlistCount}</Text>
                <Text style={styles.label}>WATCHLIST</Text>
              </View>
            </View>

            <View style={styles.averageCard}>
              <Text style={styles.averageNumber}>
                {averageRating}
                <Text style={styles.averageOutOf}> / 5</Text>
              </Text>
              <Text style={styles.averageLabel}>YOUR AVERAGE RATING</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>RECENTLY WATCHED</Text>

              {watched.length === 0 ? (
                <Text style={styles.emptyText}>
                  No movies watched yet. Start building your diary!
                </Text>
              ) : (
                <View style={styles.movieList}>
                  {watched.map((movie) => (
                    <Pressable
                      key={movie.id}
                      style={styles.movieItem}
                      onPress={() =>
                        router.push(`/movie/${movie.id}`)
                      }
                    >
                      <Image
                        source={{ uri: getMoviePoster(movie.poster_path) }}
                        style={styles.poster}
                        contentFit="cover"
                        transition={200}
                      />

                      <View style={styles.movieInfo}>
                        <Text style={styles.movieTitle} numberOfLines={2}>
                          {movie.title}
                        </Text>

                        <Text style={styles.movieYear}>
                          {movie.release_date
                            ? movie.release_date.slice(0, 4)
                            : 'Unknown year'}
                        </Text>

                        {movie.rating !== null &&
                        movie.rating !== undefined ? (
                          <Text style={styles.movieRating}>
                            ★ {Number(movie.rating).toFixed(1)} / 5
                          </Text>
                        ) : null}
                      </View>

                      <Text style={styles.arrow}>›</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </>
        )}

        <Pressable
          style={[
            styles.logoutButton,
            logoutLoading && styles.disabled,
          ]}
          onPress={handleLogout}
          disabled={logoutLoading}
        >
          {logoutLoading ? (
            <ActivityIndicator color="#F05A3E" />
          ) : (
            <Text style={styles.logoutText}>SIGN OUT</Text>
          )}
        </Pressable>

        <Text style={styles.version}>CineTrack • Your movie diary</Text>
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
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 15,
  },
  orange: {
    color: '#F05A3E',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    marginTop: 35,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 28,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#29201F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F05A3E',
  },
  avatarText: {
    color: '#F05A3E',
    fontSize: 35,
    fontWeight: '900',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 15,
  },
  email: {
    color: '#85858D',
    fontSize: 13,
    marginTop: 5,
  },
  memberLabel: {
    color: '#F05A3E',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 12,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: '#17171C',
    borderRadius: 15,
    paddingVertical: 22,
    marginTop: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  number: {
    color: '#F05A3E',
    fontSize: 24,
    fontWeight: '900',
  },
  label: {
    color: '#85858D',
    fontSize: 9,
    marginTop: 7,
    letterSpacing: 1,
  },
  separator: {
    width: 1,
    height: 30,
    backgroundColor: '#333338',
  },
  averageCard: {
    backgroundColor: '#17171C',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginTop: 14,
  },
  averageNumber: {
    color: '#F05A3E',
    fontSize: 30,
    fontWeight: '900',
  },
  averageOutOf: {
    color: '#85858D',
    fontSize: 15,
  },
  averageLabel: {
    color: '#85858D',
    fontSize: 10,
    letterSpacing: 1.5,
    marginTop: 5,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 18,
  },
  movieList: {
    gap: 14,
  },
  movieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17171C',
    borderRadius: 12,
    padding: 10,
  },
  poster: {
    width: 58,
    height: 82,
    borderRadius: 7,
    backgroundColor: '#29292E',
  },
  movieInfo: {
    flex: 1,
    marginLeft: 13,
  },
  movieTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  movieYear: {
    color: '#85858D',
    fontSize: 12,
    marginTop: 5,
  },
  movieRating: {
    color: '#F05A3E',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 7,
  },
  arrow: {
    color: '#85858D',
    fontSize: 25,
    paddingHorizontal: 8,
  },
  emptyText: {
    color: '#85858D',
    fontSize: 13,
    lineHeight: 21,
    backgroundColor: '#17171C',
    padding: 16,
    borderRadius: 12,
  },
  center: {
    alignItems: 'center',
    paddingVertical: 35,
  },
  message: {
    color: '#85858D',
    marginTop: 12,
    fontSize: 12,
  },
  errorCard: {
    backgroundColor: '#17171C',
    padding: 18,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#F87171',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#F05A3E',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 9,
    marginTop: 15,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  logoutButton: {
    width: '100%',
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F05A3E',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
  },
  logoutText: {
    color: '#F05A3E',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  disabled: {
    opacity: 0.6,
  },
  version: {
    color: '#52525B',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 25,
  },
});
