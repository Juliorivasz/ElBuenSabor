import { ArrowBackOutlined } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backTo?: string;
  gradient?: string;
  children?: React.ReactNode;
  breadcrumbs?: {
    label: string;
    href?: string;
  }[];
}

export const PageHeader = ({
  title,
  subtitle,
  showBackButton = false,
  backTo = "/",
  gradient = "from-orange-600 via-red-600 to-yellow-600",
  children,
  breadcrumbs = [],
}: PageHeaderProps) => {
  return (
    <div className="relative bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-20 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showBackButton && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6">
            <Link
              to={backTo}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors group">
              <ArrowBackOutlined className="group-hover:scale-110 transition-transform" />
              <span>Volver</span>
            </Link>
          </motion.div>
        )}

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="mb-4 text-sm text-gray-500">
            <ol className="list-reset flex flex-wrap items-center">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {crumb.href ? (
                    <Link to={crumb.href} className="text-orange-600 hover:underline">
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center">
          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {title}
          </h1>
          {subtitle && <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>}
          {children}
        </motion.div>
      </div>
    </div>
  );
};
