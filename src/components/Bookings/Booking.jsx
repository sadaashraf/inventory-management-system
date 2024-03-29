import React, { useState } from 'react';
import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, ListItemIcon, MenuItem, Button, Modal, TextField, Typography, IconButton, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { Edit, Delete, Close } from '@mui/icons-material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { data } from './BookingsData';

const Booking = () => {
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
            accessorKey: 'img',
            header: 'Image',
            size: 200,
            Cell: ({ renderedCellValue, row }) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <img
                  alt="avatar"
                  height={30}
                  src={renderedCellValue}
                  loading="lazy"
                  style={{ borderRadius: '50%' }}
                />
              </Box>
            ),
          },
        
          {
            accessorKey: 'AC_NonAC',
            header: 'AC/Non AC',
            size: 200,
          },
          {
            accessorKey: 'Meal',
            header: 'Meal',
            size: 200,
          },
          {
            accessorKey: 'BedCapacity',
            header: 'Bed Capacity',
            size: 200,
          },
          {
            accessorKey: 'Phone',
            header: 'Phone',
            size: 200,
          },
          {
            accessorKey: 'Rent',
            header: 'Rent',
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
        <img
          alt="avatar"
          height={200}
          src={row.original.img}
          loading="lazy"
          style={{ borderRadius: '50%' }}
        />
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
    img: '',
    AC_NonAC: '',
    Meal: '',
    BedCapacity: '',
    Phone: '',
    Rent: '',
  };

  const validationSchema = Yup.object().shape({
    img: Yup.string().url('Invalid URL').required('Image URL is required'),
    AC_NonAC: Yup.string().required('AC/Non AC is required'),
    Meal: Yup.string().required('Meal is required'),
    BedCapacity: Yup.number().required('Bed Capacity is required'),
    Phone: Yup.string().required('Phone is required'),
    Rent: Yup.number().required('Rent is required'),
  });

  return (
    <Box position="relative">
      <Button
        variant="contained"
        color="primary"
        style={{ position: 'relative', top: 0, left: '86%', zIndex: 1 }}
        onClick={handleOpen}
      >
        Create Booking
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-booking-modal"
        aria-describedby="create-booking-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, maxWidth: '90%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={handleClose} aria-label="close">
              <Close />
            </IconButton>
          </Box>
          <Typography variant="h5" component="div" gutterBottom>
            Create Booking
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
                  name="img"
                  as={TextField}
                  label="Image URL"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.img && !!errors.img}
                  helperText={touched.img && errors.img}
                />
               
                <Field
                  name="AC_NonAC"
                  as={TextField}
                  label="AC/Non AC"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.AC_NonAC && !!errors.AC_NonAC}
                  helperText={touched.AC_NonAC && errors.AC_NonAC}
                />
                <Field
                  name="Meal"
                  as={TextField}
                  label="Meal"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.Meal && !!errors.Meal}
                  helperText={touched.Meal && errors.Meal}
                />
                <Field
                  name="BedCapacity"
                  as={TextField}
                  label="Bed Capacity"
                  type="number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.BedCapacity && !!errors.BedCapacity}
                  helperText={touched.BedCapacity && errors.BedCapacity}
                />
                <Field
                  name="Phone"
                  as={TextField}
                  label="Phone"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.Phone && !!errors.Phone}
                  helperText={touched.Phone && errors.Phone}
                />
                <Field
                  name="Rent"
                  as={TextField}
                  label="Rent"
                  type="number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.Rent && !!errors.Rent}
                  helperText={touched.Rent && errors.Rent}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                  Create Booking
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

export default Booking;