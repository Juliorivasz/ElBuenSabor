//
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavigationItemsProps {
  items: NavigationItem[];
  currentPath: string;
  isMobile?: boolean;
  onNavigate?: (path: string) => void;
}

export const NavigationItems: React.FC<NavigationItemsProps> = ({
  items,
  currentPath,
  isMobile = false,
  onNavigate,
}) => {
  const handleClick = (path: string) => {
    if (isMobile && onNavigate) {
      onNavigate(path);
    }
  };

  if (isMobile) {
    return (
      <nav className="space-y-2">
        {items.map((item, index) => {
          const isActive = currentPath === item.path;

          return (
            <motion.button
              key={item.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => handleClick(item.path)}
              className={`w-full p-3 rounded-xl text-left transition-all duration-300 flex items-center space-x-3 group ${
                isActive
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100 hover:text-orange-600"
              }`}>
              <item.icon className="group-hover:scale-110 transition-transform" />
              <span className="font-medium">{item.name}</span>
            </motion.button>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="hidden lg:flex items-center space-x-1">
      {items.map((item, index) => {
        const isActive = currentPath === item.path;

        return (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}>
            <Link
              to={item.path}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 group relative ${
                isActive
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                  : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              }`}>
              <item.icon className="group-hover:scale-110 transition-transform duration-200" />
              <span>{item.name}</span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};
