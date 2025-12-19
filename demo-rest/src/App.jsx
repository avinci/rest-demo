import { useState, useEffect, useCallback } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SearchControls from './components/SearchControls';
import RestaurantList from './components/RestaurantList';
import LoadingState from './components/LoadingState';
import ErrorMessage from './components/ErrorMessage';
import useGeolocation from './hooks/useGeolocation';
import useRestaurants from './hooks/useRestaurants';
import { DEFAULT_RADIUS, PAGE_SIZE } from './utils/constants';

function App() {
  const [coordinates, setCoordinates] = useState(null);
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [currentPage, setCurrentPage] = useState(1);
  const [locationSource, setLocationSource] = useState(null); // 'geolocation' or 'manual'

  const {
    coordinates: geoCoordinates,
    error: geoError,
    loading: geoLoading,
    retry: retryGeolocation,
  } = useGeolocation();

  const {
    restaurants,
    loading: restaurantsLoading,
    error: restaurantsError,
    refetch: refetchRestaurants,
  } = useRestaurants(coordinates, radius);

  // Set coordinates from geolocation when available
  useEffect(() => {
    if (geoCoordinates && !coordinates) {
      setCoordinates(geoCoordinates);
      setLocationSource('geolocation');
    }
  }, [geoCoordinates, coordinates]);

  // Reset to page 1 when search parameters change
  useEffect(() => {
    setCurrentPage(1);
  }, [coordinates, radius]);

  const handleLocationChange = useCallback((newCoordinates) => {
    setCoordinates(newCoordinates);
    setLocationSource('manual');
  }, []);

  const handleRadiusChange = useCallback((newRadius) => {
    setRadius(newRadius);
  }, []);

  const handlePageChange = useCallback((event, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Calculate pagination
  const totalResults = restaurants.length;
  const totalPages = Math.ceil(totalResults / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedRestaurants = restaurants.slice(startIndex, startIndex + PAGE_SIZE);

  // Determine if we should show manual input (geolocation denied/unavailable)
  const showManualInput = !geoLoading && (geoError || !geoCoordinates);
  const isInitialLoading = geoLoading && !coordinates;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h1" component="h1" gutterBottom align="center">
        Restaurant Search
      </Typography>

      <Box sx={{ mb: 4 }}>
        <SearchControls
          coordinates={coordinates}
          radius={radius}
          onLocationChange={handleLocationChange}
          onRadiusChange={handleRadiusChange}
          showManualInput={showManualInput}
          locationSource={locationSource}
          geoError={geoError}
          onRetryGeolocation={retryGeolocation}
        />
      </Box>

      {isInitialLoading && (
        <LoadingState message="Getting your location..." />
      )}

      {restaurantsLoading && (
        <LoadingState message="Searching for restaurants..." />
      )}

      {restaurantsError && (
        <ErrorMessage
          message={restaurantsError}
          onRetry={refetchRestaurants}
        />
      )}

      {!restaurantsLoading && !restaurantsError && coordinates && (
        <RestaurantList
          restaurants={paginatedRestaurants}
          totalResults={totalResults}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Container>
  );
}

export default App;
