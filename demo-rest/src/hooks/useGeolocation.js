import { useState, useEffect, useCallback } from 'react';

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000, // 5 minutes cache
};

function useGeolocation() {
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        let errorMessage;
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enter an address manually.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please enter an address manually.';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out. Please enter an address manually.';
            break;
          default:
            errorMessage = 'An unknown error occurred getting your location.';
        }
        setError(errorMessage);
        setLoading(false);
      },
      GEOLOCATION_OPTIONS
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return {
    coordinates,
    error,
    loading,
    retry: getLocation,
  };
}

export default useGeolocation;
