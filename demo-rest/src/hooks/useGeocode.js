import { useState, useCallback } from 'react';
import { geocodeAddress } from '../services/geocodingApi';

function useGeocode() {
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const geocode = useCallback(async (address) => {
    if (!address || !address.trim()) {
      setError('Please enter an address');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await geocodeAddress(address);
      setCoordinates(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setCoordinates(null);
      setLoading(false);
      return null;
    }
  }, []);

  return {
    geocode,
    coordinates,
    error,
    loading,
  };
}

export default useGeocode;
