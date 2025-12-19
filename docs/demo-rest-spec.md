# Restaurant Search Web App

**Project:** demo-rest  
**Created:** 2025-01-21  
**Status:** Draft

---

## Overview

A web-based search tool that displays restaurants within a configurable radius of the user's location. The app defaults to the user's current location (via browser geolocation) and allows manual address entry. Results are displayed in a paginated list with expandable details.

---

## Discovery Log

| Question | Decision |
|----------|----------|
| Search radius input | Dropdown with preset options: 1, 5, 10, 25 miles |
| Restaurant info displayed | Name, address, distance, cuisine type, rating, price level |
| Data source | Google Places API (user provides own key) |
| Filtering/sorting | Sort by distance only (nearest first) |
| Location input | Current location default + manual address entry |
| Results display | List only (no map) |
| Restaurant click action | Expand in place to show more details |
| Tech stack | React (Vite) + Material UI |
| Pagination | 50 restaurants per page |

---

## User Stories

### US-1: View Restaurants Near Current Location

**As a** user  
**I want to** see restaurants near my current location  
**So that** I can find nearby places to eat

**Acceptance Criteria:**

- **Given** I open the app for the first time
- **When** I grant location permission
- **Then** the app displays a paginated list of up to 50 restaurants within the default radius (5 miles), sorted by distance (nearest first)

- **Given** I open the app
- **When** I deny location permission
- **Then** I see a prompt to enter an address manually

---

### US-2: Change Search Radius

**As a** user  
**I want to** change the search radius  
**So that** I can find restaurants closer or farther from my location

**Acceptance Criteria:**

- **Given** I am viewing search results
- **When** I select a different radius from the dropdown (1, 5, 10, or 25 miles)
- **Then** the results refresh to show restaurants within the new radius

- **Given** I change the radius
- **When** fewer than 50 restaurants exist within that radius
- **Then** only the available restaurants are shown

---

### US-3: Enter Location Manually

**As a** user  
**I want to** enter an address or city manually  
**So that** I can search for restaurants in a different area

**Acceptance Criteria:**

- **Given** I am on the app
- **When** I enter an address in the location input field and submit
- **Then** the results update to show restaurants near that address

- **Given** I enter an invalid or unrecognized address
- **When** I submit
- **Then** I see an error message prompting me to try a different address

---

### US-4: View Restaurant List

**As a** user  
**I want to** see a list of restaurants with key details  
**So that** I can quickly scan my options

**Acceptance Criteria:**

- **Given** a search has completed
- **When** I view the results list
- **Then** each restaurant displays: name, address, distance from location, cuisine type, rating (stars), and price level ($ to $$$$)

- **Given** a restaurant is missing some data (e.g., no rating)
- **When** I view it in the list
- **Then** that field shows "N/A" or is omitted gracefully

---

### US-5: Paginate Results

**As a** user  
**I want to** navigate through pages of results  
**So that** I can see all available restaurants

**Acceptance Criteria:**

- **Given** more than 50 restaurants match the search
- **When** I view the results
- **Then** I see pagination controls (next/previous or page numbers)

- **Given** I am on page 2 or later
- **When** I click "Previous" or a previous page number
- **Then** I see the previous 50 results

- **Given** I am on the last page
- **When** I view the pagination controls
- **Then** the "Next" button is disabled

---

### US-6: Expand Restaurant Details

**As a** user  
**I want to** click on a restaurant to see more information  
**So that** I can decide if I want to go there

**Acceptance Criteria:**

- **Given** I am viewing the restaurant list
- **When** I click on a restaurant row
- **Then** it expands in place to show additional details (hours, phone number, photos if available, reviews preview)

- **Given** a restaurant is expanded
- **When** I click on it again
- **Then** it collapses back to the summary view

- **Given** I expand a restaurant
- **When** I expand a different restaurant
- **Then** the previously expanded one collapses (accordion behavior)

---

## Requirements

| ID | Requirement |
|----|-------------|
| FR-001 | App shall request browser geolocation on load |
| FR-002 | App shall provide manual address entry as fallback/override |
| FR-003 | App shall fetch restaurant data from Google Places API |
| FR-004 | App shall display radius dropdown with options: 1, 5, 10, 25 miles |
| FR-005 | App shall default to 5-mile radius |
| FR-006 | App shall display 50 results per page |
| FR-007 | App shall sort results by distance (nearest first) |
| FR-008 | App shall display: name, address, distance, cuisine, rating, price level |
| FR-009 | App shall support pagination controls |
| FR-010 | App shall expand restaurant row on click to show details |
| FR-011 | App shall handle missing restaurant data gracefully |
| FR-012 | App shall display loading state during API calls |
| FR-013 | App shall display error messages for API failures |

---

## Edge Cases

| ID | Scenario | Expected Behavior |
|----|----------|-------------------|
| EC-001 | User denies geolocation permission | Show manual address input prompt |
| EC-002 | No restaurants found within radius | Display "No restaurants found" message |
| EC-003 | Google Places API returns error | Display error message with retry option |
| EC-004 | Invalid address entered | Display validation error, prompt to re-enter |
| EC-005 | API rate limit exceeded | Display friendly error, suggest trying later |
| EC-006 | Slow network / API response | Show loading spinner, timeout after 30s with error |
| EC-007 | Restaurant missing rating/price/cuisine | Display "N/A" or omit field |
| EC-008 | Fewer than 50 results total | Hide pagination or show single page |
| EC-009 | Browser doesn't support geolocation | Fall back to manual address entry |

---

## Success Criteria

| ID | Metric |
|----|--------|
| SC-001 | App loads and requests location within 2 seconds |
| SC-002 | Search results display within 3 seconds of location confirmation |
| SC-003 | Pagination navigation updates results within 1 second |
| SC-004 | App is responsive on mobile and desktop viewports |
| SC-005 | All interactive elements are keyboard accessible |
| SC-006 | App handles all edge cases without crashing |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite) |
| UI Framework | Material UI |
| API | Google Places API |
| Geolocation | Browser Geolocation API |
| Geocoding | Google Geocoding API (for address to coordinates) |

---

## Out of Scope

- User accounts / authentication
- Saving favorite restaurants
- Map view
- Filtering by cuisine, price, or open now
- Restaurant reservations or ordering
- Mobile native app

---

## Assumptions

1. User has a modern browser with geolocation support
2. User will provide their own Google Places API key
3. Google Places API provides cuisine type, rating, and price level data
4. Internet connection is available

---

## Risks

| Risk | Mitigation |
|------|------------|
| Google Places API costs | Document API pricing; user provides own key |
| API rate limits | Implement caching; show friendly error on limit |
| Incomplete restaurant data | Graceful handling of missing fields |
| Geolocation inaccuracy | Allow manual address override |
