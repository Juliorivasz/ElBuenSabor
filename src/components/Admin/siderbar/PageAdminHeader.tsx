import type React from "react";

interface PageAdminHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const PageAdminHeader = ({ title, subtitle, children }: PageAdminHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
        {children && <div className="flex flex-col sm:flex-row gap-2">{children}</div>}
      </div>
    </div>
  );
};
