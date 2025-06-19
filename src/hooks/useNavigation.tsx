import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useCartStore } from "../store/cart/useCartStore";
import {
  HomeOutlined,
  RestaurantMenuOutlined,
  InfoOutlined,
  PhoneOutlined,
  AccountCircleOutlined,
  LocationOnOutlined,
  HistoryOutlined,
} from "@mui/icons-material";

export const useNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartAnimation, setCartAnimation] = useState(false);

  const location = useLocation();
  const { isLoading, isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Get cart items count from store
  const cartItems = useCartStore((state) => state.items);
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const prevCartCount = useRef(cartItemsCount);

  // Navigation items configuration - DINÁMICO según autenticación
  const navItems = isAuthenticated
    ? [
        // Solo "Inicio" para usuarios logueados, que los lleva al catálogo
        { name: "Inicio", path: "/catalog", icon: RestaurantMenuOutlined },
      ]
    : [
        // Navegación completa para usuarios no logueados
        { name: "Inicio", path: "/", icon: HomeOutlined },
        { name: "Catálogo", path: "/catalog", icon: RestaurantMenuOutlined },
        { name: "Sobre Nosotros", path: "/about", icon: InfoOutlined },
        { name: "Contacto", path: "/contact", icon: PhoneOutlined },
      ];

  // User menu items - CON ICONOS
  const userMenuItems = [
    { name: "Mi Perfil", path: "/profile", icon: AccountCircleOutlined },
    { name: "Mis Direcciones", path: "/address", icon: LocationOnOutlined },
    { name: "Historial de Pedidos", path: "/orders", icon: HistoryOutlined },
  ];

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cart animation when items are added
  useEffect(() => {
    if (cartItemsCount > prevCartCount.current) {
      setCartAnimation(true);
      setTimeout(() => setCartAnimation(false), 600);
    }
    prevCartCount.current = cartItemsCount;
  }, [cartItemsCount]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigation handlers
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleLogin = () => {
    loginWithRedirect({
      appState: { returnTo: "/redirectRol" },
    });
  };

  const handleRegister = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: "signup",
      },
      appState: { returnTo: "/redirectRol" },
    });
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
    setIsUserMenuOpen(false);
  };

  return {
    // State
    isMenuOpen,
    isUserMenuOpen,
    isScrolled,
    cartAnimation,
    location,
    isLoading,
    isAuthenticated,
    user,
    cartItemsCount,
    userMenuRef,

    // Configuration
    navItems,
    userMenuItems,

    // Handlers
    toggleMenu,
    toggleUserMenu,
    closeMenus,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
