import { getPlacesService } from './googleMaps';
import { CUISINE_TYPE_MAP, PRICE_LEVEL_MAP, CACHE_TTL_MS } from '../utils/constants';
import { calculateDistance } from '../utils/distance';

// Simple in-memory cache
const cache = new Map();
const detailsCache = new Map();

function getCacheKey(lat, lng, radius) {
  return `${lat.toFixed(4)}_${lng.toFixed(4)}_${radius}`;
}

function getCachedResult(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCachedResult(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

function extractCuisineType(types) {
  if (!types || !Array.isArray(types)) {
    return 'Restaurant';
  }

  for (const type of types) {
    if (CUISINE_TYPE_MAP[type]) {
      return CUISINE_TYPE_MAP[type];
    }
  }

  return 'Restaurant';
}

function formatPriceLevel(priceLevel) {
  if (priceLevel === undefined || priceLevel === null) {
    return null;
  }
  return PRICE_LEVEL_MAP[priceLevel] || null;
}

function normalizeRestaurant(place, searchLat, searchLng) {
  const location = place.geometry?.location;
  const lat = location?.lat();
  const lng = location?.lng();

  return {
    id: place.place_id,
    name: place.name || 'Unknown Restaurant',
    address: place.vicinity || place.formatted_address || 'Address not available',
    distance: lat && lng ? calculateDistance(searchLat, searchLng, lat, lng) : null,
    cuisineType: extractCuisineType(place.types),
    rating: place.rating || null,
    userRatingsTotal: place.user_ratings_total || 0,
    priceLevel: formatPriceLevel(place.price_level),
    photos: place.photos || [],
    location: lat && lng ? { lat, lng } : null,
    isOpen: place.opening_hours?.isOpen?.() ?? null,
  };
}

export async function searchRestaurants(lat, lng, radiusMiles) {
  const cacheKey = getCacheKey(lat, lng, radiusMiles);
  const cached = getCachedResult(cacheKey);
  
  if (cached) {
    console.log('Returning cached results');
    return cached;
  }

  console.log('Fetching restaurants for:', { lat, lng, radiusMiles });
  const service = await getPlacesService();
  const radiusMeters = radiusMiles * 1609.34; // Convert miles to meters

  const request = {
    location: new google.maps.LatLng(lat, lng),
    radius: radiusMeters,
    query: 'restaurants',
  };
  console.log('Using textSearch with request:', request);

  return new Promise((resolve, reject) => {
    const allResults = [];

    function handleResults(results, status, pagination) {
      console.log('textSearch status:', status);
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const normalized = results.map((place) => normalizeRestaurant(place, lat, lng));
        allResults.push(...normalized);

        // Fetch more results if available (up to 60 total from Google)
        if (pagination && pagination.hasNextPage) {
          // Small delay required by Google API
          setTimeout(() => {
            pagination.nextPage();
          }, 200);
        } else {
          // Sort by distance and cache
          allResults.sort((a, b) => (a.distance || 999) - (b.distance || 999));
          setCachedResult(cacheKey, allResults);
          resolve(allResults);
        }
      } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        resolve([]);
      } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
        reject(new Error('API rate limit exceeded. Please try again later.'));
      } else if (status === google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
        reject(new Error('Places request denied. Please check your API key and ensure Places API is enabled.'));
      } else {
        reject(new Error(`Failed to fetch restaurants: ${status}`));
      }
    }

    service.textSearch(request, handleResults);
  });
}

export async function getPlaceDetails(placeId) {
  // Check cache first
  if (detailsCache.has(placeId)) {
    return detailsCache.get(placeId);
  }

  const service = await getPlacesService();

  const request = {
    placeId,
    fields: [
      'formatted_phone_number',
      'opening_hours',
      'photos',
      'reviews',
      'website',
      'url',
    ],
  };

  return new Promise((resolve, reject) => {
    service.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const details = {
          phone: place.formatted_phone_number || null,
          hours: place.opening_hours?.weekday_text || null,
          isOpen: place.opening_hours?.isOpen?.() ?? null,
          photos: place.photos?.slice(0, 5).map((photo) => ({
            url: photo.getUrl({ maxWidth: 400 }),
            attribution: photo.html_attributions?.[0] || '',
          })) || [],
          reviews: place.reviews?.slice(0, 3).map((review) => ({
            author: review.author_name,
            rating: review.rating,
            text: review.text,
            time: review.relative_time_description,
          })) || [],
          website: place.website || null,
          googleMapsUrl: place.url || null,
        };
        // Cache the result
        detailsCache.set(placeId, details);
        resolve(details);
      } else {
        reject(new Error(`Failed to fetch details: ${status}`));
      }
    });
  });
}
