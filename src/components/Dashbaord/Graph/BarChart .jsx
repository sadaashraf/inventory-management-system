import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { BarChart as MuiBarChart } from '@mui/x-charts';

export default function BarChart() {
  const [seriesNb, setSeriesNb] = React.useState(2);
  const [itemNb, setItemNb] = React.useState(5);
  const [skipAnimation, setSkipAnimation] = React.useState(false);

  const handleItemNbChange = (event, newValue) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setItemNb(newValue);
  };

  const handleSeriesNbChange = (event, newValue) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setSeriesNb(newValue);
  };

  const series = [
    {
      label: 'series 1',
      data: [
        2423, 2210, 764, 1879, 1478, 1373, 1891, 2171, 620, 1269, 724, 1707, 1188,
        1879, 626, 1635, 2177, 516, 1793, 1598,
      ],
    },
    {
      label: 'series 2',
      data: [
        2362, 2254, 1962, 1336, 586, 1069, 2194, 1629, 2173, 2031, 1757, 862, 2446,
        910, 2430, 2300, 805, 1835, 1684, 2197,
      ],
    },
    {
      label: 'series 3',
      data: [
        2362, 2254, 1962, 1336, 586, 1069, 2194, 1629, 2173, 2031, 1757, 862, 2446,
        910, 2430, 2300, 805, 1835, 1684, 2197,
      ],
    },
    // Add more series as needed
  ];

  return (
    <Box sx={{ width: '1000px'  }}>
      <MuiBarChart
        height={300}
        series={series.slice(0, seriesNb).map(s => ({ ...s, data: s.data.slice(0, itemNb) }))}
        skipAnimation={skipAnimation}
        sx={{ width: '100%' }} // Full width
      />
      <FormControlLabel
        checked={skipAnimation}
        control={<Checkbox onChange={(event) => setSkipAnimation(event.target.checked)} />}
        label="skipAnimation"
        labelPlacement="end"
      />
      <Typography id="input-item-number" gutterBottom>
        Number of items
      </Typography>
      <Slider
        value={itemNb}
        onChange={handleItemNbChange}
        valueLabelDisplay="auto"
        min={1}
        max={20}
        aria-labelledby="input-item-number"
      />
      <Typography id="input-series-number" gutterBottom>
        Number of series
      </Typography>
      <Slider
        value={seriesNb}
        onChange={handleSeriesNbChange}
        valueLabelDisplay="auto"
        min={1}
        max={10}
        aria-labelledby="input-series-number"
      />
    </Box>
  );
}