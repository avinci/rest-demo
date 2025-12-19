import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Link from '@mui/material/Link';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import MapIcon from '@mui/icons-material/Map';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getPlaceDetails } from '../services/placesApi';

function RestaurantDetails({ placeId }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchDetails() {
      try {
        const result = await getPlaceDetails(placeId);
        if (mounted) {
          setDetails(result);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchDetails();

    return () => {
      mounted = false;
    };
  }, [placeId]);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!details) {
    return null;
  }

  const { phone, hours, photos, reviews, website, googleMapsUrl, isOpen } = details;

  return (
    <Box sx={{ p: 2 }}>
      {/* Contact & Links */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        {phone && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PhoneIcon fontSize="small" color="action" />
            <Link href={`tel:${phone}`} underline="hover">
              {phone}
            </Link>
          </Box>
        )}
        
        {website && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LanguageIcon fontSize="small" color="action" />
            <Link href={website} target="_blank" rel="noopener noreferrer" underline="hover">
              Website
            </Link>
          </Box>
        )}
        
        {googleMapsUrl && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <MapIcon fontSize="small" color="action" />
            <Link href={googleMapsUrl} target="_blank" rel="noopener noreferrer" underline="hover">
              View on Maps
            </Link>
          </Box>
        )}
      </Box>

      {/* Hours */}
      {hours && hours.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="subtitle2">Hours</Typography>
            {isOpen !== null && (
              <Chip 
                label={isOpen ? 'Open Now' : 'Closed'} 
                color={isOpen ? 'success' : 'default'} 
                size="small" 
              />
            )}
          </Box>
          <Box sx={{ pl: 3 }}>
            {hours.map((day, index) => (
              <Typography key={index} variant="body2" color="text.secondary">
                {day}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

      {/* Photos */}
      {photos && photos.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Photos
          </Typography>
          <ImageList sx={{ width: '100%', maxHeight: 200 }} cols={3} rowHeight={120}>
            {photos.map((photo, index) => (
              <ImageListItem key={index}>
                <img
                  src={photo.url}
                  alt={`Restaurant photo ${index + 1}`}
                  loading="lazy"
                  style={{ objectFit: 'cover', height: '100%' }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      )}

      {/* Reviews */}
      {reviews && reviews.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Recent Reviews
          </Typography>
          {reviews.map((review, index) => (
            <Box
              key={index}
              sx={{
                p: 1.5,
                mb: 1,
                bgcolor: 'grey.50',
                borderRadius: 1,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="body2" fontWeight="medium">
                  {review.author}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Rating value={review.rating} size="small" readOnly />
                  <Typography variant="caption" color="text.secondary">
                    {review.time}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {review.text.length > 200 ? `${review.text.slice(0, 200)}...` : review.text}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* No additional details */}
      {!phone && !hours && (!photos || photos.length === 0) && (!reviews || reviews.length === 0) && (
        <Typography variant="body2" color="text.secondary">
          No additional details available.
        </Typography>
      )}
    </Box>
  );
}

export default RestaurantDetails;
