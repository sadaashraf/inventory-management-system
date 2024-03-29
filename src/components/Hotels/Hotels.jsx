import React, { useState } from 'react';
import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, ListItemIcon, MenuItem, Button, Modal, TextField, Typography, IconButton, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { Edit, Delete, Close } from '@mui/icons-material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { data } from './HotelsData';

const Hotels = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        id: 'bookings',
        header: 'Bookings',
        columns: [
          {
            accessorKey: 'GuestName', // Change accessorKey to 'GuestName'
            header: 'Guest Name', // Change header to 'Guest Name'
            size: 200,
            // Modify Cell component if needed
          },
          {
            accessorKey: 'Room', // Change accessorKey to 'Room'
            header: 'Room', // Change header to 'Room'
            size: 200,
          },
          {
            accessorKey: 'CheckIn', // Change accessorKey to 'CheckIn'
            header: 'Check-in', // Change header to 'Check-in'
            size: 200,
          },
          {
            accessorKey: 'CheckOut', // Change accessorKey to 'CheckOut'
            header: 'Check-out', // Change header to 'Check-out'
            size: 200,
          },
          {
            accessorKey: 'Price', // Change accessorKey to 'Price'
            header: 'Price', // Change header to 'Price'
            size: 200,
          },
        ],
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
    initialState: {
      showColumnFilters: false,
      showGlobalFilter: true,
      columnPinning: {
        left: ['mrt-row-expand', 'mrt-row-select'],
        right: ['mrt-row-actions'],
      },
    },
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    muiSearchTextFieldProps: {
      size: 'small',
      variant: 'outlined',
    },
    muiPaginationProps: {
      color: 'secondary',
      rowsPerPageOptions: [5, 10, 15, 20, 25, 30],
      shape: 'rounded',
      variant: 'outlined',
    },
    renderDetailPanel: ({ row }) => (
      <Box
        sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-around',
        left: '30px',
        maxWidth: '1000px',
        position: 'sticky',
        width: '100%',
        }}
      >
        {/* Render detail panel if needed */}
      </Box>
    ),
    renderRowActionMenuItems: ({ closeMenu, table }) => [
      <MenuItem
        key="edit"
        onClick={() => {
          // Edit logic...
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Edit />
        </ListItemIcon>
        Edit
      </MenuItem>,
      <MenuItem
        key="delete"
        onClick={() => {
          const selectedRows = table.getSelectedRowModel().flatRows;
          selectedRows.forEach((row) => table.deleteRow(row.id));
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Delete />
        </ListItemIcon>
        Delete
      </MenuItem>,
    ],
  });

  const initialValues = {
    GuestName: '',
    Room: '',
    CheckIn: '',
    CheckOut: '',
    Price: '',
  };

  const validationSchema = Yup.object().shape({
    GuestName: Yup.string().required('Guest Name is required'),
    Room: Yup.string().required('Room is required'),
    CheckIn: Yup.string().required('Check-in date is required'),
    CheckOut: Yup.string().required('Check-out date is required'),
    Price: Yup.number().required('Price is required'),
  });

  return (
    <Box position="relative">
      <Button
        variant="contained"
        color="primary"
        style={{ position: 'relative', top: 0, left: '86%', zIndex: 1 }}
        onClick={handleOpen}
      >
        Create Hotel
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-hotel-modal"
        aria-describedby="create-hotel-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, maxWidth: '90%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={handleClose} aria-label="close">
              <Close />
            </IconButton>
          </Box>
          <Typography variant="h5" component="div" gutterBottom>
            Create Hotel
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              console.log(values);
              resetForm();
              handleClose();
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <Field
                  name="GuestName"
                  as={TextField}
                  label="Guest Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.GuestName && !!errors.GuestName}
                  helperText={touched.GuestName && errors.GuestName}
                />
                <Field
                  name="Room"
                  as={TextField}
                  label="Room"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.Room && !!errors.Room}
                  helperText={touched.Room && errors.Room}
                />
                <Field
                  name="CheckIn"
                  as={TextField}
                  label="Check-in"
                  type="date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.CheckIn && !!errors.CheckIn}
                  helperText={touched.CheckIn && errors.CheckIn}
                />
                <Field
                  name="CheckOut"
                  as={TextField}
                  label="Check-out"
                  type="date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.CheckOut && !!errors.CheckOut}
                  helperText={touched.CheckOut && errors.CheckOut}
                />
                <Field
                  name="Price"
                  as={TextField}
                  label="Price"
                  type="number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.Price && !!errors.Price}
                  helperText={touched.Price && errors.Price}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                  Create Hotel
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default Hotels;