import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const RedirectByRole = () => {
  const { user, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading || !user) return;

    const roles = user["https://apiback/roles"];

    if (roles?.includes("ADMINISTRADOR")) {
      navigate("/admin/dashboard");
    } else if (roles?.includes("CLIENTE")) {
      navigate("/catalog");
    } else {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  return null;
};
