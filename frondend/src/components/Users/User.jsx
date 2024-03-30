import React, { useState } from 'react';
import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, ListItemIcon, MenuItem, Button, Modal, TextField, Typography, IconButton, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { Edit, Delete, Close } from '@mui/icons-material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { data } from './usersData';

const User = () => {
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
        id: 'users',
        header: 'Users',
        columns: [
          {
            accessorFn: (row) => `${row.firstName} ${row.lastName}`,
            id: 'name',
            header: 'Name',
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
                  src={row.original.avatar}
                  loading="lazy"
                  style={{ borderRadius: '50%' }}
                />
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          {
            accessorKey: 'username',
            header: 'Username',
            size: 200,
          },
          {
            accessorKey: 'email',
            enableClickToCopy: true,
            filterVariant: 'autocomplete',
            header: 'Email',
            size: 300,
          },
          {
            accessorKey: 'isAdmin',
            header: 'Is Admin',
            size: 50,
            Cell: ({ cell }) => (
              <Box
                component="span"
                sx={(theme) => ({
                  backgroundColor: cell.getValue() ? theme.palette.success.main : theme.palette.error.main,
                  color: '#fff',
                  borderRadius: '0.25rem',
                  padding: '0.25rem',
                  fontWeight: 'bold',
                })}
              >
                {cell.getValue() ? 'Yes' : 'No'}
              </Box>
            ),
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
          src={row.original.avatar}
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
    firstName: '',
    lastName: '',
    email: '',
    avatar: '',
    isAdmin: 'no',
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    avatar: Yup.string().url('Invalid URL').required('Avatar URL is required'),
    isAdmin: Yup.string().required('Please select Admin status'),
  });

  return (
    <Box position="relative">
      <Button
        variant="contained"
        color="primary"
        style={{ position: 'relative', top: 0, left: '86%', zIndex: 1 }}
        onClick={handleOpen}
      >
        Create User
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-user-modal"
        aria-describedby="create-user-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, maxWidth: '90%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={handleClose} aria-label="close">
              <Close />
            </IconButton>
          </Box>
          <Typography variant="h5" component="div" gutterBottom>
            Create User
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
                  name="firstName"
                  as={TextField}
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.firstName && !!errors.firstName}
                  helperText={touched.firstName && errors.firstName}
                />
                <Field
                  name="lastName"
                  as={TextField}
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.lastName && !!errors.lastName}
                  helperText={touched.lastName && errors.lastName}
                />
                <Field
                  name="email"
                  as={TextField}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
                <Field
                  name="avatar"
                  as={TextField}
                  label="Avatar"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.avatar && !!errors.avatar}
                  helperText={touched.avatar && errors.avatar}
                />

                  <Typography >IsAdmin</Typography>
                <Field name="isAdmin">
                  {({ field }) => (
                   <RadioGroup
                      {...field}
                      row
                     
                      aria-label="isAdmin"
                      name="isAdmin"
                      error={touched.isAdmin && !!errors.isAdmin}
                    >
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  )}
                </Field>
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                  Create User
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

export default User;