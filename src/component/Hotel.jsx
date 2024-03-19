import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardMedia, CardContent, Typography, Box, Rating } from '@mui/material';

function Hotel({ name, photo, description, rating, location }) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        title={name}
        subheader={location}
      />
      <CardMedia
        component="img"
        height="194"
        image={photo}
        alt={name}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Box component="fieldset" borderColor="transparent">
          <Typography component="legend">Rating</Typography>
          <Rating name="read-only" value={rating} readOnly />
        </Box>
      </CardContent>
    </Card>
  );
}

Hotel.propTypes = {
  name: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  location: PropTypes.string.isRequired,
};

export default Hotel;
