"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useCartStore } from "../store/cart/useCartStore";
import { useAuth0Store } from "../store/auth/useAuth0Store";
import {
  HomeOutlined,
  RestaurantMenuOutlined,
  InfoOutlined,
  PhoneOutlined,
  AccountCircleOutlined,
  LocationOnOutlined,
  HistoryOutlined,
} from "@mui/icons-material";
import type { IUser } from "../store/auth/types/user";
import { type ClienteProfileResponse, fetchUserProfile } from "../services/clienteServicio";

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string; sx?: object }>;
}

export const useNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartAnimation, setCartAnimation] = useState(false);
  const [isProfileDataLoading, setIsProfileDataLoading] = useState(false);

  const location = useLocation();

  const { isLoading: auth0Loading, isAuthenticated: auth0Authenticated, loginWithRedirect, logout } = useAuth0();

  const {
    user: zustandUser,
    isTokenReady,
    setUser,
    isProfileComplete,
    setIsProfileComplete,
    setProfileData,
  } = useAuth0Store();

  const isAuthenticated = auth0Authenticated && isTokenReady;
  const isLoading = auth0Loading || !isTokenReady || isProfileDataLoading;
  const user: IUser | undefined = isAuthenticated ? zustandUser ?? undefined : undefined;

  const userMenuRef = useRef<HTMLDivElement>(null);
  const hasFetchedProfileRef = useRef(false);

  const cartItems = useCartStore((state) => state.items);
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const prevCartCount = useRef(cartItemsCount);

  useEffect(() => {
    const loadAndMergeProfileData = async () => {
      if (isAuthenticated && !hasFetchedProfileRef.current) {
        const userRoles = zustandUser?.roles || [];

        // Si es administrador o empleado, NO buscar perfil en backend
        const isAdminOrEmployee = userRoles.some((role) =>
          ["administrador", "cocinero", "repartidor", "cajero"].includes(role.toLowerCase()),
        );

        if (isAdminOrEmployee) {
          console.log("[useNavigation] Usuario es admin/empleado, marcando perfil como completo");
          setIsProfileComplete(true);
          hasFetchedProfileRef.current = true;
          return;
        }

        // Solo para clientes: buscar perfil en backend
        const needsBackendData =
          !zustandUser?.apellido ||
          !zustandUser?.telefono ||
          !zustandUser?.name ||
          !zustandUser?.picture ||
          (zustandUser?.roles && zustandUser.roles.length === 0);

        if (isProfileComplete && !needsBackendData) {
          console.log("[useNavigation] Perfil ya completo y con datos en Zustand. No se busca en backend.");
          hasFetchedProfileRef.current = true;
          return;
        }

        setIsProfileDataLoading(true);
        try {
          const backendProfile: ClienteProfileResponse = await fetchUserProfile();

          console.log("[useNavigation] Perfil de cliente encontrado en backend:", backendProfile);

          setProfileData({
            apellido: backendProfile.apellido,
            telefono: backendProfile.telefono,
            imagen: backendProfile.imagen,
            roles: backendProfile.roles,
            email: backendProfile.email,
            name: backendProfile.nombre,
            id: backendProfile.auth0Id,
            picture: backendProfile.imagen ?? undefined,
          });
        } catch (error: unknown) {
          console.error("[useNavigation] Error al cargar datos del perfil del backend:", error);
          if (
            typeof error === "object" &&
            error !== null &&
            "response" in error &&
            typeof (error as { response?: { status?: number } }).response === "object" &&
            (error as { response?: { status?: number } }).response !== null &&
            "status" in (error as { response?: { status?: number } }).response!
          ) {
            const status = (error as { response?: { status?: number } }).response?.status;
            if (status === 404) {
              setIsProfileComplete(false);
            } else {
              setIsProfileComplete(false);
            }
          } else {
            setIsProfileComplete(false);
          }
        } finally {
          setIsProfileDataLoading(false);
          hasFetchedProfileRef.current = true;
        }
      } else if (!isAuthenticated) {
        hasFetchedProfileRef.current = false;
        setIsProfileComplete(false);
      }
    };

    loadAndMergeProfileData();
  }, [
    isAuthenticated,
    zustandUser?.apellido,
    zustandUser?.telefono,
    zustandUser?.name,
    zustandUser?.picture,
    zustandUser?.roles,
    isProfileComplete,
    setUser,
    setIsProfileComplete,
    setProfileData,
  ]);

  const userRoles = user?.roles || [];
  const isAdminOrEmployee = userRoles.some((role) =>
    ["administrador", "cocinero", "repartidor", "cajero"].includes(role.toLowerCase()),
  );

  const navItems: NavItem[] =
    isAuthenticated && !isAdminOrEmployee
      ? [{ name: "Inicio", path: "/catalog", icon: RestaurantMenuOutlined }]
      : [
          { name: "Inicio", path: "/", icon: HomeOutlined },
          { name: "Catálogo", path: "/catalog", icon: RestaurantMenuOutlined },
          { name: "Sobre Nosotros", path: "/about", icon: InfoOutlined },
          { name: "Contacto", path: "/contact", icon: PhoneOutlined },
        ];

  const userMenuItems: NavItem[] = !isAdminOrEmployee
    ? [
        { name: "Mi Perfil", path: "/profile", icon: AccountCircleOutlined },
        { name: "Mis Direcciones", path: "/address", icon: LocationOnOutlined },
        { name: "Historial de Pedidos", path: "/orders", icon: HistoryOutlined },
      ]
    : [];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (cartItemsCount > prevCartCount.current) {
      setCartAnimation(true);
      setTimeout(() => setCartAnimation(false), 600);
    }
    prevCartCount.current = cartItemsCount;
  }, [cartItemsCount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    isAdminOrEmployee,
    navItems,
    userMenuItems,
    toggleMenu,
    toggleUserMenu,
    closeMenus,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
