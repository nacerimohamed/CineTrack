import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StatusBar,
  Alert,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import {
  getMovieDetails,
  getMoviePoster,
} from '../../services/movie-service';

import {
  getUserMovies,
  addUserMovie,
  removeUserMovie,
  updateUserMovie,
} from '../../services/user-movies';

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [movieStatus, setMovieStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviewSaving, setReviewSaving] = useState(false);

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

  const loadSavedStatus = async () => {
    try {
      const movies = await getUserMovies();

      const savedMovie = movies.find(
        (item) => Number(item.movie_id) === Number(id)
      );

      setMovieStatus(savedMovie ? savedMovie.status : null);
      setRating(savedMovie?.rating ? Number(savedMovie.rating) : 0);
      setReview(savedMovie?.review || '');
    } catch (err) {
      console.log('Saved movie loading error:', err.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMovie();
      loadSavedStatus();
    }
  }, [id]);

  const handleMovieStatus = async (status) => {
    if (saving) return;

    try {
      setSaving(true);

      if (movieStatus === status) {
        await removeUserMovie(Number(id));
        setMovieStatus(null);
      } else {
        await addUserMovie(Number(id), status);
        setMovieStatus(status);
      }
    } catch (err) {
      console.log(
        'Movie status error:',
        err.response?.data || err.message
      );

      Alert.alert(
        'Action failed',
        err.response?.status === 401
          ? 'Please log in to save movies.'
          : 'Could not save this movie. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveReview = async () => {
    if (movieStatus !== 'watched') {
      Alert.alert(
        'Mark as watched',
        'Add this movie to Watched before rating or reviewing it.'
      );
      return;
    }

    if (rating === 0 && !review.trim()) {
      Alert.alert('Empty review', 'Choose a rating or write a review.');
      return;
    }

    try {
      setReviewSaving(true);

      await updateUserMovie(Number(id), {
        rating: rating || null,
        review: review.trim() || null,
      });

      Alert.alert('Saved', 'Your rating and review have been saved.');
    } catch (err) {
      console.log('Review saving error:', err.response?.data || err.message);
      Alert.alert('Error', 'Could not save your review. Please try again.');
    } finally {
      setReviewSaving(false);
    }
  };

  const handleDeleteReview = () => {
    Alert.alert(
      'Delete review',
      'Are you sure you want to delete your rating and review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setReviewSaving(true);

              await updateUserMovie(Number(id), {
                rating: null,
                review: null,
              });

              setRating(0);
              setReview('');

              Alert.alert('Deleted', 'Your review has been deleted.');
            } catch (err) {
              console.log('Delete review error:', err.response?.data || err.message);
              Alert.alert('Error', 'Could not delete your review.');
            } finally {
              setReviewSaving(false);
            }
          },
        },
      ]
    );
  };

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
            <Text style={styles.backButtonText}>ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹</Text>
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
            <Text style={styles.dot}>ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢</Text>

            <Text style={styles.infoText}>
              {formatRuntime(movie.runtime)}
            </Text>

            <Text style={styles.dot}>ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢</Text>

            <Text style={styles.rating}>
              ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¹ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦ {Number(movie.vote_average || 0).toFixed(1)}
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
              disabled={saving}
              style={[
                styles.actionButton,
                movieStatus === 'watchlist' && styles.activeButton,
                saving && { opacity: 0.6 },
              ]}
              onPress={() => handleMovieStatus('watchlist')}
            >
              <Text style={styles.actionButtonText}>
                {saving
                  ? 'SAVING...'
                  : movieStatus === 'watchlist'
                    ? 'ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ ADDED TO WATCHLIST'
                    : '+ WATCHLIST'}
              </Text>
            </Pressable>

            <Pressable
              disabled={saving}
              style={[
                styles.actionButton,
                styles.watchedButton,
                movieStatus === 'watched' && styles.activeButton,
                saving && { opacity: 0.6 },
              ]}
              onPress={() => handleMovieStatus('watched')}
            >
              <Text style={styles.actionButtonText}>
                {saving
                  ? 'SAVING...'
                  : movieStatus === 'watched'
                    ? 'ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ WATCHED'
                    : 'ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ MARK AS WATCHED'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>YOUR RATING & REVIEW</Text>

            <Text style={styles.detailText}>Choose your rating (out of 5)</Text>

            <View style={styles.ratingOptions}>
              {Array.from({ length: 10 }, (_, index) => {
                const value = (index + 1) / 2;
                return (
                  <Pressable
                    key={value}
                    style={[
                      styles.ratingOption,
                      rating === value && styles.selectedRatingOption,
                    ]}
                    onPress={() => setRating(value)}
                  >
                    <Text style={[
                      styles.ratingOptionText,
                      rating === value && styles.selectedRatingOptionText,
                    ]}>
                      {value}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <TextInput
              style={styles.reviewInput}
              placeholder="Write your thoughts about this movie..."
              placeholderTextColor="#71717A"
              value={review}
              onChangeText={setReview}
              multiline
              maxLength={2000}
              textAlignVertical="top"
            />

            <Pressable
              style={[styles.saveReviewButton, reviewSaving && { opacity: 0.6 }]}
              onPress={handleSaveReview}
              disabled={reviewSaving}
            >
              <Text style={styles.saveReviewButtonText}>
                {reviewSaving ? 'SAVING...' : (rating > 0 || review.trim() ? 'UPDATE RATING & REVIEW' : 'SAVE RATING & REVIEW')}
              </Text>
            </Pressable>
            {(rating > 0 || review.trim().length > 0) ? (
              <Pressable
                style={styles.deleteReviewButton}
                onPress={handleDeleteReview}
                disabled={reviewSaving}
              >
                <Text style={styles.deleteReviewButtonText}>
                  DELETE RATING & REVIEW
                </Text>
              </Pressable>
            ) : null}
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
  ratingOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
    marginBottom: 18,
  },
  ratingOption: {
    width: 48,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#202024',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333338',
  },
  selectedRatingOption: {
    backgroundColor: '#F05A3E',
    borderColor: '#F05A3E',
  },
  ratingOptionText: {
    color: '#D4D4D8',
    fontSize: 13,
    fontWeight: 'bold',
  },
  selectedRatingOptionText: {
    color: '#FFFFFF',
  },
  reviewInput: {
    minHeight: 130,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#333338',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 22,
  },
  saveReviewButton: {
    backgroundColor: '#F05A3E',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  deleteReviewButton: {
    backgroundColor: '#202024',
    borderWidth: 1,
    borderColor: '#7F1D1D',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteReviewButtonText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  saveReviewButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
