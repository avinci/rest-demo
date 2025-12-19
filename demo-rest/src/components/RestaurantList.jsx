import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RestaurantCard from './RestaurantCard';
import Pagination from './Pagination';

function RestaurantList({ 
  restaurants, 
  totalResults, 
  currentPage, 
  totalPages, 
  onPageChange 
}) {
  const [expandedId, setExpandedId] = useState(null);

  const handleToggleExpand = useCallback((id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  }, []);

  if (restaurants.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No restaurants found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try increasing the search radius or searching in a different location.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Found {totalResults} restaurant{totalResults !== 1 ? 's' : ''}
      </Typography>

      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          expanded={expandedId === restaurant.id}
          onToggleExpand={handleToggleExpand}
        />
      ))}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          onPageChange={onPageChange}
        />
      )}
    </Box>
  );
}

export default RestaurantList;
