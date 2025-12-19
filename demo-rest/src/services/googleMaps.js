// Uses Google Maps loaded via script tag in index.html

let placesService = null;
let autocompleteService = null;
let geocoder = null;
let hiddenMap = null;

async function waitForGoogle() {
  // Wait for google.maps.importLibrary to be available
  let attempts = 0;
  while (!window.google?.maps?.importLibrary && attempts < 50) {
    await new Promise(resolve => setTimeout(resolve, 100));
    attempts++;
  }
  
  if (!window.google?.maps?.importLibrary) {
    throw new Error('Google Maps failed to load');
  }
  
  // Import required libraries
  await google.maps.importLibrary('places');
  await google.maps.importLibrary('maps');
  
  console.log('Google Maps libraries loaded');
}

export async function getAutocompleteService() {
  await waitForGoogle();
  if (!autocompleteService) {
    autocompleteService = new google.maps.places.AutocompleteService();
    console.log('AutocompleteService created');
  }
  return autocompleteService;
}

export async function getPlacesService() {
  await waitForGoogle();
  if (!placesService) {
    // Create hidden map for PlacesService
    if (!hiddenMap) {
      const mapDiv = document.createElement('div');
      mapDiv.style.display = 'none';
      document.body.appendChild(mapDiv);
      hiddenMap = new google.maps.Map(mapDiv, {
        center: { lat: 0, lng: 0 },
        zoom: 1,
      });
      console.log('Hidden map created');
    }
    placesService = new google.maps.places.PlacesService(hiddenMap);
    console.log('PlacesService created');
  }
  return placesService;
}

export async function getGeocoder() {
  await waitForGoogle();
  if (!geocoder) {
    geocoder = new google.maps.Geocoder();
    console.log('Geocoder created');
  }
  return geocoder;
}
