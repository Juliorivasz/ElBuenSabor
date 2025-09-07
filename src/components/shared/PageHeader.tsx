import { ArrowBackOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import type { FC, ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backTo?: string;
  icon?: ReactNode;
  children?: ReactNode;
  breadcrumbs?: {
    label: string;
    href?: string;
  }[];
}

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  backTo = "/",
  icon,
  children,
  breadcrumbs = [],
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          {icon && <div className="text-gray-800">{icon}</div>}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>
        </div>

        {showBackButton && (
          <Link
            to={backTo}
            className="flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors">
            <ArrowBackOutlined
              fontSize="small"
              className="mr-1"
            />
            <span>Volver</span>
          </Link>
        )}
      </div>

      {breadcrumbs.length > 0 && (
        <nav className="mb-4 text-sm text-gray-500">
          <ol className="list-reset flex flex-wrap items-center">
            {breadcrumbs.map((crumb, index) => (
              <li
                key={index}
                className="flex items-center">
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="text-orange-600 hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};
