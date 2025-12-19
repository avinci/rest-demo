import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { getAutocompleteService, getPlacesService } from '../services/googleMaps';

function LocationInput({ onLocationChange, currentLocationActive }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);
  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);

  // Fetch autocomplete suggestions
  useEffect(() => {
    if (!inputValue || inputValue.length < 2 || selecting) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      console.log('Fetching suggestions for:', inputValue);

      try {
        if (!autocompleteServiceRef.current) {
          autocompleteServiceRef.current = await getAutocompleteService();
        }

        autocompleteServiceRef.current.getPlacePredictions(
          { input: inputValue },
          (predictions, status) => {
            console.log('Autocomplete status:', status);
            setLoading(false);
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
              console.log('Got predictions:', predictions.length);
              setSuggestions(predictions);
              setOpen(true);
            } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              setSuggestions([]);
              setOpen(false);
            } else {
              console.error('Autocomplete error:', status);
              setSuggestions([]);
              setOpen(false);
            }
          }
        );
      } catch (err) {
        console.error('Init error:', err);
        setLoading(false);
        setOpen(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue, selecting]);

  // Handle selection
  const handleSelect = async (suggestion) => {
    console.log('Selected:', suggestion.description);
    // Clear debounce to prevent new fetch
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setSelecting(true);
    setSuggestions([]);
    setOpen(false);
    setInputValue(suggestion.description);
    setLoading(true);

    try {
      if (!placesServiceRef.current) {
        placesServiceRef.current = await getPlacesService();
      }

      placesServiceRef.current.getDetails(
        { placeId: suggestion.place_id, fields: ['geometry'] },
        (place, status) => {
          console.log('Place details status:', status);
          setLoading(false);
          // Keep selecting true - don't re-trigger suggestions
          if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            const coords = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            console.log('Got coordinates:', coords);
            onLocationChange(coords);
          } else {
            console.error('Failed to get place details:', status);
            setSelecting(false);
          }
        }
      );
    } catch (err) {
      console.error('Error getting place details:', err);
      setLoading(false);
      // Only reset selecting on error
      setSelecting(false);
    }
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Box ref={containerRef} sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search for a location..."
        value={inputValue}
        onChange={(e) => {
          const newValue = e.target.value;
          // Only reset selecting if user clears or modifies the input
          if (selecting && newValue !== inputValue) {
            setSelecting(false);
          }
          setInputValue(newValue);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: loading ? (
            <InputAdornment position="end">
              <CircularProgress size={20} />
            </InputAdornment>
          ) : null,
        }}
      />

      {open && suggestions.length > 0 && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: 300,
            overflow: 'auto',
            mt: 0.5,
          }}
          elevation={3}
        >
          <List dense disablePadding>
            {suggestions.map((suggestion) => (
              <ListItemButton
                key={suggestion.place_id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(suggestion)}
              >
                <ListItemText
                  primary={suggestion.structured_formatting?.main_text || suggestion.description}
                  secondary={suggestion.structured_formatting?.secondary_text}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default LocationInput;
