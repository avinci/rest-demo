# Restaurant Search Web App - Implementation Plan

**Project:** demo-rest  
**Spec:** demo-rest-spec.md  
**Created:** 2025-01-21  
**Status:** Draft

---

## Context

### Overview
Build a React web app that displays restaurants within a configurable radius of the user's location. Uses Google Places API for data, Material UI for styling, and supports geolocation with manual address fallback.

### Key Requirements
- FR-001 to FR-013: Geolocation, manual address, Google Places API, radius dropdown, pagination (50/page), expandable restaurant details, loading/error states

### Acceptance Criteria Summary
- Default to current location, fall back to manual address entry
- Radius dropdown: 1, 5, 10, 25 miles (default 5)
- Display: name, address, distance, cuisine, rating, price level
- Sort by distance, paginate at 50 results
- Accordion expand for details (hours, phone, photos, reviews)

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Build | Vite | Fast dev server, optimized builds |
| Framework | React 18 | UI components |
| UI Library | Material UI v5 | Pre-built components, theming |
| HTTP Client | fetch | API calls (native, no extra deps) |
| Geolocation | Browser API | Get user coordinates |
| API | Google Places API | Restaurant data |
| Geocoding | Google Geocoding API | Address to coordinates |

---

## Architecture

### Project Structure

```
demo-rest/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── .gitignore
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── theme.js
│   ├── components/
│   │   ├── SearchControls.jsx
│   │   ├── LocationInput.jsx
│   │   ├── RadiusDropdown.jsx
│   │   ├── RestaurantList.jsx
│   │   ├── RestaurantCard.jsx
│   │   ├── RestaurantDetails.jsx
│   │   ├── Pagination.jsx
│   │   ├── LoadingState.jsx
│   │   └── ErrorMessage.jsx
│   ├── hooks/
│   │   ├── useGeolocation.js
│   │   ├── useRestaurants.js
│   │   └── useGeocode.js
│   ├── services/
│   │   ├── placesApi.js
│   │   └── geocodingApi.js
│   └── utils/
│       ├── distance.js
│       └── constants.js
```

### Data Flow

1. App loads → request geolocation
2. Location obtained → fetch restaurants via Google Places API
3. Results returned → calculate distances, sort, paginate
4. User interacts → update state, refetch as needed

### Key Patterns

- **Custom hooks** for data fetching and geolocation logic
- **Service layer** to isolate API calls
- **Controlled components** for form inputs
- **Lifting state** to App.jsx for shared state (location, radius, results)

---

## Implementation Phases

### Phase 1: Project Setup & Foundation

**Goal:** Scaffold project, configure tooling, establish base structure

**Tasks:**
1. Initialize Vite React project
2. Install dependencies: `@mui/material @mui/icons-material @emotion/react @emotion/styled`
3. Create folder structure (components, hooks, services, utils)
4. Configure Material UI theme (theme.js)
5. Set up environment variables (.env.example with VITE_GOOGLE_API_KEY)
6. Create App.jsx shell with MUI ThemeProvider
7. Add .gitignore (node_modules, .env, dist)

**Files:**
- `package.json`
- `vite.config.js`
- `.env.example`
- `.gitignore`
- `src/main.jsx`
- `src/App.jsx`
- `src/theme.js`

**Acceptance:** App runs with `npm run dev`, displays "Restaurant Search" heading

---

### Phase 2: Geolocation & Location Input (US-1, US-3)

**Goal:** Get user's location via browser API or manual address entry

**Tasks:**
1. Create `useGeolocation` hook
   - Request browser geolocation on mount
   - Return: `{ coordinates, error, loading, retry }`
   - Handle permission denied, timeout, unavailable
2. Create `useGeocode` hook
   - Convert address string to coordinates via Google Geocoding API
   - Return: `{ geocode, coordinates, error, loading }`
3. Create `geocodingApi.js` service
   - `geocodeAddress(address, apiKey)` → `{ lat, lng }`
4. Create `LocationInput.jsx` component
   - Text field for address entry
   - Submit button
   - Show current location indicator when using geolocation
5. Create `ErrorMessage.jsx` component
   - Reusable error display with retry button
6. Integrate in App.jsx
   - Try geolocation first
   - Fall back to manual input if denied/unavailable
   - Store final coordinates in state

**Files:**
- `src/hooks/useGeolocation.js`
- `src/hooks/useGeocode.js`
- `src/services/geocodingApi.js`
- `src/components/LocationInput.jsx`
- `src/components/ErrorMessage.jsx`
- `src/App.jsx` (update)

**Acceptance:** 
- App requests location permission on load
- Denied permission shows address input
- Valid address converts to coordinates
- Invalid address shows error

---

### Phase 3: Google Places API Integration (US-1, US-4)

**Goal:** Fetch restaurants from Google Places API based on location and radius

**Tasks:**
1. Create `placesApi.js` service
   - `searchRestaurants(lat, lng, radiusMeters, apiKey)` → restaurants array
   - `getPlaceDetails(placeId, apiKey)` → full details
   - Handle API errors, rate limits
2. Create `useRestaurants` hook
   - Accepts coordinates and radius
   - Fetches and caches results
   - Returns: `{ restaurants, loading, error, refetch }`
3. Create `distance.js` utility
   - `calculateDistance(lat1, lng1, lat2, lng2)` → miles
   - `milesToMeters(miles)` → meters (for API)
4. Create `constants.js`
   - `RADIUS_OPTIONS = [1, 5, 10, 25]`
   - `DEFAULT_RADIUS = 5`
   - `PAGE_SIZE = 50`
5. Process API response
   - Map to normalized restaurant objects
   - Calculate distance from search location
   - Sort by distance ascending

**Files:**
- `src/services/placesApi.js`
- `src/hooks/useRestaurants.js`
- `src/utils/distance.js`
- `src/utils/constants.js`

**Acceptance:**
- Valid coordinates fetch restaurant data
- Results include name, address, distance, cuisine, rating, price
- API errors display user-friendly message

---

### Phase 4: Restaurant List Display (US-4)

**Goal:** Display paginated list of restaurants with key details

**Tasks:**
1. Create `RestaurantCard.jsx` component
   - Display: name, address, distance, cuisine type, rating (stars), price level
   - Handle missing data (show "N/A" or omit)
   - Clickable for expansion
   - Use MUI Card, Typography, Rating components
2. Create `RestaurantList.jsx` component
   - Receives restaurants array and pagination state
   - Maps over current page items
   - Handles empty state ("No restaurants found")
3. Create `LoadingState.jsx` component
   - MUI CircularProgress with message
4. Integrate in App.jsx
   - Pass restaurants to RestaurantList
   - Show loading state during fetch
   - Show error state on failure

**Files:**
- `src/components/RestaurantCard.jsx`
- `src/components/RestaurantList.jsx`
- `src/components/LoadingState.jsx`
- `src/App.jsx` (update)

**Acceptance:**
- Restaurants display in card format
- Missing data handled gracefully
- Loading spinner shows during fetch
- Empty results show message

---

### Phase 5: Search Controls & Radius (US-2)

**Goal:** Allow user to change search radius and re-search

**Tasks:**
1. Create `RadiusDropdown.jsx` component
   - MUI Select with options: 1, 5, 10, 25 miles
   - Default selected: 5 miles
   - onChange triggers new search
2. Create `SearchControls.jsx` component
   - Contains LocationInput and RadiusDropdown
   - Horizontal layout on desktop, stacked on mobile
3. Update App.jsx
   - Lift radius state
   - Refetch restaurants when radius changes
   - Show current search parameters

**Files:**
- `src/components/RadiusDropdown.jsx`
- `src/components/SearchControls.jsx`
- `src/App.jsx` (update)

**Acceptance:**
- Dropdown shows all radius options
- Changing radius triggers new search
- Results update to match new radius

---

### Phase 6: Pagination (US-5)

**Goal:** Paginate results at 50 per page with navigation controls

**Tasks:**
1. Create `Pagination.jsx` component
   - MUI Pagination component
   - Shows page numbers and prev/next
   - Disabled states for first/last page
   - Shows "Page X of Y" and total results count
2. Add pagination state to App.jsx
   - `currentPage`, `setCurrentPage`
   - Calculate `totalPages` from results length
   - Slice results for current page
3. Reset to page 1 when search parameters change

**Files:**
- `src/components/Pagination.jsx`
- `src/App.jsx` (update)

**Acceptance:**
- Results paginated at 50 per page
- Navigation works correctly
- Page resets on new search
- Hidden when ≤50 results

---

### Phase 7: Expandable Details (US-6)

**Goal:** Click restaurant to expand and show additional details

**Tasks:**
1. Create `RestaurantDetails.jsx` component
   - Display: hours, phone, photos (if available), reviews preview
   - Fetch additional details on expand (Place Details API)
   - Loading state while fetching details
2. Update `RestaurantCard.jsx`
   - Add expanded state
   - Accordion behavior (MUI Accordion or custom)
   - Collapse animation
3. Update `RestaurantList.jsx`
   - Track which restaurant is expanded
   - Collapse previous when new one expands

**Files:**
- `src/components/RestaurantDetails.jsx`
- `src/components/RestaurantCard.jsx` (update)
- `src/components/RestaurantList.jsx` (update)

**Acceptance:**
- Click expands restaurant to show details
- Only one expanded at a time
- Details fetch on demand
- Missing details handled gracefully

---

### Phase 8: Polish & Error Handling

**Goal:** Handle all edge cases, improve UX, ensure responsiveness

**Tasks:**
1. Implement all edge cases (EC-001 to EC-009)
   - Geolocation denied/unavailable → manual input prompt
   - No results → friendly message
   - API errors → error message with retry
   - Invalid address → validation error
   - Rate limit → friendly message
   - Timeout (30s) → timeout error
   - Missing data → N/A or omit
2. Add responsive styles
   - Mobile-first layout
   - Stack controls on small screens
   - Readable card layout on all sizes
3. Keyboard accessibility
   - All interactive elements focusable
   - Enter to submit address
   - Arrow keys for pagination
4. Add loading states for all async operations
5. Verify success criteria (SC-001 to SC-006)

**Files:**
- All components (updates)
- `src/App.jsx` (updates)

**Acceptance:**
- All edge cases handled without crashes
- Responsive on mobile and desktop
- Keyboard navigation works
- Loading states visible for all operations

---

## API Reference

### Google Places Nearby Search
```
GET https://maps.googleapis.com/maps/api/place/nearbysearch/json
  ?location={lat},{lng}
  &radius={meters}
  &type=restaurant
  &key={API_KEY}
```

### Google Place Details
```
GET https://maps.googleapis.com/maps/api/place/details/json
  ?place_id={place_id}
  &fields=formatted_phone_number,opening_hours,photos,reviews
  &key={API_KEY}
```

### Google Geocoding
```
GET https://maps.googleapis.com/maps/api/geocode/json
  ?address={encoded_address}
  &key={API_KEY}
```

**Note:** These APIs require a Google Cloud project with Places API and Geocoding API enabled. Calls from browser require CORS handling (may need a proxy or use client-side libraries).

---

## Technical Decisions

| Item | Decision |
|------|----------|
| CORS | Use `@googlemaps/js-api-loader` + Places Library (official Google client-side SDK, no proxy needed) |
| API Costs | Aggressive caching (5 min TTL for same location/radius) + lazy detail loading (fetch only on expand) + limit detail fields |
| Cuisine Type | Map first relevant type from `types[]` to human-readable string (e.g., `italian_restaurant` → "Italian"), fall back to "Restaurant" |

---

## Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@mui/material": "^5.15.0",
    "@mui/icons-material": "^5.15.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "@googlemaps/js-api-loader": "^1.16.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```
