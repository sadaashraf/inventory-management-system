import React from "react";
import Hotel from "./Hotel";
import { Box, Typography, Container, Grid } from "@mui/material"; // Import Box, Typography, and Grid for layout

function HotelList({ data }) {
  // Check if data is undefined or not an array
  if (!data || !Array.isArray(data)) {
    // Return null or display an error message
    return null; // You can also display an error message here
  }

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Hotels
      </Typography>
      <Grid container spacing={2}> {/* Grid container with spacing between items */}
        {data.map((hotel, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}> {/* Adjust layout based on screen size */}
            <Box sx={{ margin: 1 }}> {/* Add margin around each hotel */}
              <Hotel
                name={hotel.name}
                photo={hotel.photo}
                description={hotel.description}
                rating={hotel.rating}
                location={hotel.location}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default HotelList;
