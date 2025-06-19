import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

export const LayoutAdmin = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);
  return (
    <div>
      <Outlet />
    </div>
  );
};
