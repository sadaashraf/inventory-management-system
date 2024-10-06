import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from '@mui/icons-material/Category';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn"; // New icon for Sale
import StoreIcon from "@mui/icons-material/Store"; // New icon for Stock
import Purchase from "./components/Purchase/Purchase";
import Stock from "./components/Stock/Stock";
import Supplier from "./components/Supplier/Suppliers";
import { GlobalStyles } from "@mui/material";
import SupplierDetail from "./components/Supplier/SupplierDetail";
import Issue from "./components/Issue/Issue";
import Dashboard from "./components/Stock/Dashboard";
import "./App.css";
import PurchaseDetail from "./components/Purchase/PurchaseDetail";
import Departments from "./components/Department/departments";
import DepartmentDetail from "./components/Department/departmentDetail";
import IssueDetail from "./components/Issue/IssueDetail";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import Categories from "./components/Category/Category";
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: "#333",
  color: "#fff",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: "#333",
  color: "#fff",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const menuItems = [
  { title: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { title: "Purchase", icon: <InventoryIcon />, path: "/purchase" },
  { title: "Supplier", icon: <LocalGroceryStoreIcon />, path: "/supplier" },
  { title: "Issue", icon: <ShoppingCartCheckoutIcon />, path: "/issue" },
  { title: "Department", icon: <InventoryIcon />, path: "/departments" },
  { title: "Category", icon: <CategoryIcon />, path: "/category" },

  { title: "Stock", icon: <StoreIcon />, path: "/stock" },
];

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [activePath, setActivePath] = React.useState("/");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenuItemClick = (path) => {
    setActivePath(path);
    setOpen(true);
  };

  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Inventory Management System
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose} sx={{ color: "#fff" }}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider sx={{ backgroundColor: "#fff" }} />
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.title}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    "&:hover": {
                      backgroundColor: "#444",
                    },
                  }}
                  onClick={() => handleMenuItemClick(item.path)}
                  component={Link}
                  to={item.path} // Changed to 'Link' and 'to'
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    sx={{ opacity: open ? 1 : 0, color: "#fff" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/category" element={<Categories />} />

            <Route path="/purchase" element={<Purchase />} />
            <Route path="/purchase-detail/:id" element={<PurchaseDetail />} />
            <Route path="/issue" element={<Issue />} />
            <Route path="/issue-detail/:id" element={<IssueDetail />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/supplier" element={<Supplier />} />
            <Route path="/supplier-detail/:id" element={<SupplierDetail />} />

            <Route path="/departments" element={<Departments />} />
            <Route
              path="/department-detail/:id"
              element={<DepartmentDetail />}
            />
          </Routes>
        </Main>
      </Box>
    </Router>
  );
}
