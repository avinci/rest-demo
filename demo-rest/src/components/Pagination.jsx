import Box from '@mui/material/Box';
import MuiPagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { PAGE_SIZE } from '../utils/constants';

function Pagination({ currentPage, totalPages, totalResults, onPageChange }) {
  const startItem = (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, totalResults);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        mt: 4,
        py: 2,
      }}
    >
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={onPageChange}
        color="primary"
        showFirstButton
        showLastButton
        siblingCount={1}
      />
      <Typography variant="body2" color="text.secondary">
        Showing {startItem}-{endItem} of {totalResults} restaurants
      </Typography>
    </Box>
  );
}

export default Pagination;
