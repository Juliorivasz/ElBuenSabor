// src/hooks/useNavigation.ts
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react"; // Necesitas este para las funciones de autenticación y el estado inicial
import { useCartStore } from "../store/cart/useCartStore";
import { useAuth0Store } from "../store/auth/useAuth0Store"; // Importa tu store de Zustand para el usuario
import {
  HomeOutlined,
  RestaurantMenuOutlined,
  InfoOutlined,
  PhoneOutlined,
  AccountCircleOutlined,
  LocationOnOutlined,
  HistoryOutlined,
} from "@mui/icons-material";
import { IUser } from "../store/auth/types/user";
import { ClienteProfileResponse, fetchUserProfile } from "../services/clienteServicio";

// Define una interfaz para los ítems de navegación y de menú de usuario
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

  const {
    isLoading: auth0Loading, // Renombrado para evitar conflicto
    isAuthenticated: auth0Authenticated, // Renombrado
    loginWithRedirect,
    logout,
  } = useAuth0();

  // 2. Obtener estado del store de Zustand
  const {
    user: zustandUser,
    isTokenReady,
    setUser,
    isProfileComplete,
    setIsProfileComplete,
    setProfileData,
  } = useAuth0Store();

  // 3. Determinar el estado final de autenticación y el objeto de usuario para la UI
  const isAuthenticated = auth0Authenticated && isTokenReady;
  const isLoading = auth0Loading || !isTokenReady || isProfileDataLoading;
  const user: IUser | undefined = isAuthenticated ? zustandUser ?? undefined : undefined;

  const userMenuRef = useRef<HTMLDivElement>(null);
  const hasFetchedProfileRef = useRef(false);

  // Get cart items count from store
  const cartItems = useCartStore((state) => state.items);
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const prevCartCount = useRef(cartItemsCount);

  useEffect(() => {
    const loadAndMergeProfileData = async () => {
      // Solo procedemos si el usuario está autenticado, el token está listo
      // y aún no hemos intentado cargar el perfil del backend para esta sesión.
      if (isAuthenticated && !hasFetchedProfileRef.current) {
        // Optimización: Solo buscar si los campos adicionales aún no están en Zustand
        const needsBackendData =
          !zustandUser?.apellido ||
          !zustandUser?.telefono ||
          !zustandUser?.name ||
          !zustandUser?.picture ||
          (zustandUser?.roles && zustandUser.roles.length === 0); // Considerar también los roles si están vacíos

        // Si ya tenemos un usuario en Zustand y isProfileComplete es true,
        // no necesitamos volver a buscar el perfil del backend a menos que faltaran datos.
        if (isProfileComplete && !needsBackendData) {
          console.log("[useNavigation] Perfil ya completo y con datos en Zustand. No se busca en backend.");
          hasFetchedProfileRef.current = true;
          return; // Salir de la función si el perfil ya está completo y no necesita datos
        }

        // Si se necesita buscar o el perfil no está completo
        setIsProfileDataLoading(true);
        try {
          const backendProfile: ClienteProfileResponse = await fetchUserProfile();

          console.log("[useNavigation] Perfil de cliente encontrado en backend:", backendProfile);

          // ¡Usar setProfileData del store para actualizar el usuario y el estado de completitud!
          setProfileData({
            apellido: backendProfile.apellido,
            telefono: backendProfile.telefono,
            imagen: backendProfile.imagen,
            roles: backendProfile.roles,
            email: backendProfile.email, // Incluirlos por si setProfileData los usa para fusionar
            name: backendProfile.nombre,
            id: backendProfile.idAuth0,
            picture: backendProfile.imagen ?? undefined, // Mapeo de imagen a picture, convierte null a undefined
          });

          // `setIsProfileComplete(true)` se llama automáticamente dentro de setProfileData ahora
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
              // Si el backend responde 404, significa que el perfil no está creado en la DB
              // y el usuario necesita completar su perfil.
              // Aseguramos que isProfileComplete sea false en el store.
              setIsProfileComplete(false);
            } else {
              // Otros errores, podríamos manejar de otra forma o simplemente asegurar que no se marque como completo
              setIsProfileComplete(false);
            }
          } else {
            setIsProfileComplete(false);
          }
        } finally {
          setIsProfileDataLoading(false);
          hasFetchedProfileRef.current = true; // Marcar que ya se intentó la búsqueda para esta sesión
        }
      } else if (!isAuthenticated) {
        // Si el usuario no está autenticado, resetear los flags para la próxima sesión
        hasFetchedProfileRef.current = false;
        setIsProfileComplete(false); // Resetear en el store
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
    isProfileComplete, // Dependencia para re-ejecutar si el estado de completitud cambia en el store
    setUser, // Solo si setUser se usa directamente para algo más aquí, si no, se puede quitar
    setIsProfileComplete, // Asegurarse de que el efecto se re-ejecute si la acción se usa
    setProfileData, // ¡Crucial! Para que el efecto se re-ejecute si la acción cambia (aunque rara vez lo hará)
  ]);

  // Navigation items configuration - DINÁMICO según autenticación
  const navItems: NavItem[] = isAuthenticated
    ? [{ name: "Inicio", path: "/catalog", icon: RestaurantMenuOutlined }]
    : [
        { name: "Inicio", path: "/", icon: HomeOutlined },
        { name: "Catálogo", path: "/catalog", icon: RestaurantMenuOutlined },
        { name: "Sobre Nosotros", path: "/about", icon: InfoOutlined },
        { name: "Contacto", path: "/contact", icon: PhoneOutlined },
      ];

  // User menu items - CON ICONOS
  const userMenuItems: NavItem[] = [
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
    isLoading, // Este es el isLoading derivado
    isAuthenticated, // Este es el isAuthenticated derivado
    user, // Este es el user derivado (preferencia Zustand)
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
