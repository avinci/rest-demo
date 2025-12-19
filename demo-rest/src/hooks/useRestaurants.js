import { useState, useEffect, useCallback, useRef } from 'react';
import { searchRestaurants } from '../services/placesApi';
import { API_TIMEOUT_MS } from '../utils/constants';

function useRestaurants(coordinates, radiusMiles) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchIdRef = useRef(0);

  const fetchRestaurants = useCallback(async () => {
    if (!coordinates) {
      return;
    }

    // Increment fetch ID to track this specific request
    const currentFetchId = ++fetchIdRef.current;

    setLoading(true);
    setError(null);

    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out. Please try again.'));
      }, API_TIMEOUT_MS);
    });

    try {
      const results = await Promise.race([
        searchRestaurants(coordinates.lat, coordinates.lng, radiusMiles),
        timeoutPromise,
      ]);
      
      // Only update state if this is still the latest fetch
      if (currentFetchId === fetchIdRef.current) {
        setRestaurants(results);
        setLoading(false);
      }
    } catch (err) {
      // Only update state if this is still the latest fetch
      if (currentFetchId === fetchIdRef.current) {
        setError(err.message);
        setRestaurants([]);
        setLoading(false);
      }
    }
  }, [coordinates, radiusMiles]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  return {
    restaurants,
    loading,
    error,
    refetch: fetchRestaurants,
  };
}

export default useRestaurants;
