/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in miles
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Convert miles to meters
 * @param {number} miles
 * @returns {number} meters
 */
export function milesToMeters(miles) {
  return miles * 1609.34;
}

/**
 * Format distance for display
 * @param {number} miles - Distance in miles
 * @returns {string} Formatted distance string
 */
export function formatDistance(miles) {
  if (miles === null || miles === undefined) {
    return 'N/A';
  }
  
  if (miles < 0.1) {
    const feet = Math.round(miles * 5280);
    return `${feet} ft`;
  }
  
  if (miles < 10) {
    return `${miles.toFixed(1)} mi`;
  }
  
  return `${Math.round(miles)} mi`;
}
