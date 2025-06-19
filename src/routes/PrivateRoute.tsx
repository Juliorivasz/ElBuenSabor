"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth0Store } from "../store/auth/useAuth0Store";

interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: string[];
}

export const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0();
  const [tokenLoading, setTokenLoading] = useState(true);

  const setUser = useAuth0Store((state) => state.setUser);

  useEffect(() => {
    const handleToken = async () => {
      if (!isAuthenticated || !user) {
        setTokenLoading(false);
        return;
      }

      try {
        setTokenLoading(true);
        const token = await getAccessTokenSilently();

        if (user) {
          const roles = user?.["https://apiback/roles"];
          if (roles) {
            setUser({ token, roles });
          }
        }
      } catch (error) {
        console.error("Error getting token:", error);
      } finally {
        setTokenLoading(false);
      }
    };

    handleToken();
  }, [getAccessTokenSilently, setUser, user, isAuthenticated]);

  if (isLoading || tokenLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-4xl text-black">Verificando autenticación...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // If no specific role is required, just check authentication
  if (!requiredRole || requiredRole.length === 0) {
    return <>{children}</>;
  }

  // Get user role from Auth0 custom claims
  const userRoles = user?.["https://apiback/roles"];

  // Check if user has any of the required roles
  if (!userRoles || !requiredRole.some((required) => userRoles.includes(required.toUpperCase()))) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <>{children}</>;
};
