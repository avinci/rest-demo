import { getGeocoder } from './googleMaps';

export async function geocodeAddress(address) {
  const geocoder = await getGeocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng(),
          formattedAddress: results[0].formatted_address,
        });
      } else if (status === 'ZERO_RESULTS') {
        reject(new Error('Address not found. Please try a different address.'));
      } else if (status === 'OVER_QUERY_LIMIT') {
        reject(new Error('Too many requests. Please try again later.'));
      } else if (status === 'REQUEST_DENIED') {
        reject(new Error('Geocoding request denied. Please check your API key.'));
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
}
