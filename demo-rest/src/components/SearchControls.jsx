import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationInput from './LocationInput';
import RadiusDropdown from './RadiusDropdown';

function SearchControls({
  coordinates,
  radius,
  onLocationChange,
  onRadiusChange,
  showManualInput,
  locationSource,
  geoError,
  onRetryGeolocation,
}) {
  return (
    <Paper sx={{ p: 2 }}>
      {/* Geolocation error alert */}
      {geoError && (
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={onRetryGeolocation}>
              Try Again
            </Button>
          }
        >
          {geoError}
        </Alert>
      )}

      {/* Current location indicator */}
      {locationSource === 'geolocation' && coordinates && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            icon={<MyLocationIcon />}
            label="Using your current location"
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>
      )}

      {/* Search controls */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', sm: 'flex-start' },
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <LocationInput
            onLocationChange={onLocationChange}
            currentLocationActive={locationSource === 'geolocation'}
          />
          {(showManualInput || locationSource === 'manual') && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Search for a location to find nearby restaurants
            </Typography>
          )}
        </Box>

        <RadiusDropdown value={radius} onChange={onRadiusChange} />
      </Box>
    </Paper>
  );
}

export default SearchControls;
