import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { RADIUS_OPTIONS } from '../utils/constants';

function RadiusDropdown({ value, onChange }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="radius-select-label">Radius</InputLabel>
      <Select
        labelId="radius-select-label"
        id="radius-select"
        value={value}
        label="Radius"
        onChange={handleChange}
      >
        {RADIUS_OPTIONS.map((radius) => (
          <MenuItem key={radius} value={radius}>
            {radius} mile{radius !== 1 ? 's' : ''}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default RadiusDropdown;
