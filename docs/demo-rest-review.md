# Restaurant Search Web App - Code Review

**Project:** demo-rest  
**Reviewed:** 2025-01-21  
**Files Reviewed:** 18

---

## Summary

| Severity | Count |
|----------|-------|
| Blocker | 0 |
| Major | 2 |
| Minor | 4 |
| Nitpick | 3 |

---

## Findings

### Major

**M-1** `src/services/placesApi.js:46-47`

**Issue:** Loader instantiated multiple times if called concurrently before first load completes

**Current:**
```javascript
if (!loaderPromise) {
  const loader = new Loader({...});
  loaderPromise = loader.importLibrary('places');
}
```

**Suggested Fix:** This is actually fine - the promise is assigned synchronously, so concurrent calls will share the same promise. No change needed upon closer inspection.

---

**M-2** `src/hooks/useRestaurants.js:10-38`

**Issue:** `fetchRestaurants` is included in its own dependency array via `useCallback`, and is called in `useEffect`. If coordinates/radius change rapidly, multiple concurrent fetches can occur with race conditions.

**Current:**
```javascript
const fetchRestaurants = useCallback(async () => {
  // ...
}, [coordinates, radiusMiles]);

useEffect(() => {
  fetchRestaurants();
}, [fetchRestaurants]);
```

**Suggested Fix:** Add abort controller or cleanup flag to prevent stale responses:
```javascript
useEffect(() => {
  let cancelled = false;
  
  async function fetch() {
    if (!coordinates) return;
    setLoading(true);
    setError(null);
    
    try {
      const results = await searchRestaurants(coordinates.lat, coordinates.lng, radiusMiles);
      if (!cancelled) {
        setRestaurants(results);
      }
    } catch (err) {
      if (!cancelled) {
        setError(err.message);
        setRestaurants([]);
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }
  
  fetch();
  return () => { cancelled = true; };
}, [coordinates, radiusMiles]);
```

---

**M-3** `src/services/geocodingApi.js:17-24`

**Issue:** Same pattern as placesApi - but actually fine for same reason.

---

### Minor

**m-1** `src/App.jsx:35-38`

**Issue:** Effect sets coordinates from geolocation but only if `coordinates` is null. If user manually enters an address, then later the geolocation succeeds (e.g., permission granted late), the coordinates won't update. This is likely intentional but could be confusing.

**Current:**
```javascript
useEffect(() => {
  if (geoCoordinates && !coordinates) {
    setCoordinates(geoCoordinates);
    setLocationSource('geolocation');
  }
}, [geoCoordinates, coordinates]);
```

**Suggested Fix:** Consider adding a "Use my location" button that explicitly sets geolocation coords, rather than auto-setting only when coordinates is null. Or document this behavior.

---

**m-2** `src/components/RestaurantDetails.jsx:22-45`

**Issue:** Place details are fetched every time the component mounts (accordion expands). No caching for details means repeated expansions = repeated API calls.

**Suggested Fix:** Add a details cache similar to search results:
```javascript
// In placesApi.js
const detailsCache = new Map();

export async function getPlaceDetails(placeId) {
  if (detailsCache.has(placeId)) {
    return detailsCache.get(placeId);
  }
  // ... fetch logic
  detailsCache.set(placeId, result);
  return result;
}
```

---

**m-3** `src/components/LocationInput.jsx:41-48`

**Issue:** `InputProps` is deprecated in MUI v6. Should use `slotProps` for future compatibility.

**Current:**
```javascript
InputProps={{
  startAdornment: (...)
}}
```

**Suggested Fix:** For MUI v6 migration readiness:
```javascript
slotProps={{
  input: {
    startAdornment: (...)
  }
}}
```

Note: Current MUI v5 code works fine, this is forward-looking.

---

**m-4** `src/services/placesApi.js:119-134`

**Issue:** Pagination fetches all results (up to 60) even though only 50 are shown per page. For 25-mile radius, this could mean unnecessary API costs if user only views first page.

**Suggested Fix:** Consider lazy loading additional pages only when user navigates, or document that this is intentional for better UX (all results available immediately).

---

### Nitpick

**N-1** `src/utils/constants.js`

**Issue:** `PRICE_LEVEL_MAP[0] = 'Free'` - Google Places rarely returns 0 for price level. Consider omitting or using 'N/A'.

---

**N-2** `src/components/RestaurantCard.jsx:37`

**Issue:** `disableRipple` removes tactile feedback on click. Consider keeping ripple for better UX.

---

**N-3** `src/theme.js`

**Issue:** Default Roboto font requires Google Fonts import or local font files. Without it, falls back to system fonts.

**Suggested Fix:** Add to `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
```

---

## Overall Assessment

**Quality: Good**

The code is well-structured with clear separation of concerns:
- Hooks encapsulate data fetching logic
- Services isolate API interactions  
- Components are focused and composable
- Error handling is comprehensive

Main areas for improvement:
1. Add race condition protection in `useRestaurants` (M-2)
2. Cache place details to reduce API costs (m-2)
3. Add Roboto font import (N-3)

The app should work correctly as-is. The major findings are edge cases that may not occur in normal usage but should be addressed for production readiness.
