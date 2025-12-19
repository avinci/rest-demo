import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RestaurantDetails from './RestaurantDetails';
import { formatDistance } from '../utils/distance';

function RestaurantCard({ restaurant, expanded, onToggleExpand }) {
  const {
    id,
    name,
    address,
    distance,
    cuisineType,
    rating,
    userRatingsTotal,
    priceLevel,
  } = restaurant;

  return (
    <Card 
      sx={{ 
        mb: 2,
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea onClick={() => onToggleExpand(id)}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flexGrow: 1, mr: 2 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                {name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {address}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, alignItems: 'center' }}>
                <Chip
                  label={formatDistance(distance)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                
                <Chip
                  label={cuisineType}
                  size="small"
                  variant="outlined"
                />
                
                {priceLevel && (
                  <Chip
                    label={priceLevel}
                    size="small"
                    variant="outlined"
                    color="secondary"
                  />
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 100 }}>
              {rating !== null ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Rating value={rating} precision={0.1} size="small" readOnly />
                  <Typography variant="body2" color="text.secondary">
                    ({userRatingsTotal})
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No rating
                </Typography>
              )}
              
              <Box sx={{ mt: 1 }}>
                {expanded ? <ExpandLessIcon color="action" /> : <ExpandMoreIcon color="action" />}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <RestaurantDetails placeId={id} />
      </Collapse>
    </Card>
  );
}

export default RestaurantCard;
