# Restaurant Search Web App - Code Review #2

**Project:** demo-rest  
**Date:** 2025-01-21  
**Reviewer:** Claude  
**Scope:** Post-fix review of all source files

---

## Summary

| Severity | Count |
|----------|-------|
| Blocker | 0 |
| Major | 0 |
| Minor | 2 |
| Nitpick | 2 |

---

## Previous Fixes Verified

| Finding | Status |
|---------|--------|
| M-2: Race condition in useRestaurants | ✅ Fixed - fetchIdRef pattern implemented correctly |
| m-2: Place details not cached | ✅ Fixed - detailsCache added |
| N-1: Price level 0 = 'Free' | ✅ Fixed - removed |
| N-2: disableRipple | ✅ Fixed - removed |
| N-3: Missing Roboto font | ✅ Fixed - Google Fonts added |

---

## Findings

### Minor

#### m-1: Unused `useState` import in RestaurantCard

**File:** `src/components/RestaurantCard.jsx:1`

**Issue:** `useState` is imported but not used in the component.

**Suggested Fix:**
```jsx
// Before
import { useState } from 'react';

// After
// Remove the import entirely
```

---

#### m-2: Details cache grows unbounded

**File:** `src/services/placesApi.js:11`

**Issue:** `detailsCache` has no TTL or size limit. Over a long session, it could grow indefinitely.

**Suggested Fix:**
```javascript
// Option A: Add TTL similar to search cache
function getCachedDetails(placeId) {
  const cached = detailsCache.get(placeId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  detailsCache.delete(placeId);
  return null;
}

// Option B: Add max size limit
const MAX_DETAILS_CACHE_SIZE = 100;
if (detailsCache.size > MAX_DETAILS_CACHE_SIZE) {
  const firstKey = detailsCache.keys().next().value;
  detailsCache.delete(firstKey);
}
```

**Impact:** Memory usage in long sessions. Low priority for typical usage.

---

### Nitpick

#### N-1: Inconsistent null checks for rating

**File:** `src/components/RestaurantCard.jsx:76`

**Issue:** Rating check uses `!== null` but rating can also be `undefined` from the API.

**Current:**
```jsx
{rating !== null ? (
```

**Suggested:**
```jsx
{rating != null ? (  // Handles both null and undefined
```

---

#### N-2: Console will show React key warning for hours list

**File:** `src/components/RestaurantDetails.jsx:117-120`

**Issue:** Using array index as key is technically fine here since hours don't reorder, but could use the day string as a more stable key.

**Current:**
```jsx
{hours.map((day, index) => (
  <Typography key={index} ...>
```

**Suggested:**
```jsx
{hours.map((day) => (
  <Typography key={day} ...>
```

---

## Overall Assessment

**Status: Ready for use** ✅

The codebase is clean and well-structured. Previous issues have been properly addressed:

- Race condition fix is correctly implemented
- Caching is working for both search results and place details
- Font loading is properly configured
- UI feedback (ripple) is restored

**Remaining items are low priority:**
- m-1 (unused import) - cosmetic, no runtime impact
- m-2 (unbounded cache) - only matters for very long sessions
- N-1, N-2 - nitpicks with minimal impact

**Strengths:**
- Clean separation of concerns (hooks, services, components)
- Good error handling throughout
- Proper cleanup in useEffect (mounted flag in RestaurantDetails)
- Accessible (aria-labels, keyboard support)
- Responsive layout

**Code is production-ready for an MVP.**
