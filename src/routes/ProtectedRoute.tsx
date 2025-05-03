import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/store";
import { ReactElement } from "react";

type ProtectedRouteProps = {
  element: ReactElement;
  allowedRoles: string[];
};

export default function ProtectedRoute({ element, allowedRoles }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (!user)
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  if (!allowedRoles.includes(user.role))
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );

  return element;
}
