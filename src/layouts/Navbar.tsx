"use client";

import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MenuOutlined, CloseOutlined } from "@mui/icons-material";

import { Logo } from "../components/shared/Logo";
import { MobileMenu } from "../components/header/MobileMenu";
import { NavigationItems } from "../components/header/NavigationItems";
import { AuthButtons } from "../components/header/AuthButtons";
import { CartButton } from "../components/header/CartButton";
import { UserProfileMenu } from "../components/header/UserProfileMenu";
import { useNavigation } from "../hooks/useNavigation";

export const NavBar: React.FC = () => {
  const {
    isMenuOpen,
    isScrolled,
    isLoading,
    isAuthenticated,
    user,
    cartItemsCount,
    cartAnimation,
    navItems,
    userMenuItems,
    toggleMenu,
    closeMenus,
    handleLogin,
    handleRegister,
    handleLogout,
    location,
  } = useNavigation();

  if (isLoading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16 sm:h-20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full animate-pulse"></div>
              <div className="w-24 h-4 bg-gradient-to-r from-orange-200 to-red-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-xl border-b border-orange-100/50"
            : "bg-white/80 backdrop-blur-md"
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex-shrink-0">
              <Logo
                size="md"
                showText={true}
                linkTo="/"
              />
            </motion.div>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavigationItems
                items={navItems}
                currentPath={location.pathname}
              />
            </div>

            {/* Desktop Right Section - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Cart Button */}
              <CartButton
                cartItemsCount={cartItemsCount}
                cartAnimation={cartAnimation}
              />

              {/* Auth Section */}
              {isAuthenticated ? (
                <UserProfileMenu
                  user={user}
                  userMenuItems={userMenuItems}
                  onLogout={handleLogout}
                />
              ) : (
                <AuthButtons
                  onLogin={handleLogin}
                  onRegister={handleRegister}
                />
              )}
            </div>

            {/* Mobile Menu Button - Only visible on mobile */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                console.log("Menu button clicked!");
                toggleMenu();
              }}
              className="relative p-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 lg:hidden"
              aria-label="Toggle menu"
              type="button">
              {/* Cart Counter Badge - Mobile only */}
              <AnimatePresence>
                {cartItemsCount > 0 && (
                  <motion.div
                    key="cart-badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: cartAnimation ? [1, 1.3, 1] : 1,
                      opacity: 1,
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      duration: cartAnimation ? 0.3 : 0.2,
                      ease: "easeOut",
                    }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center shadow-lg border-2 border-white">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Menu Icon */}
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}>
                    <CloseOutlined sx={{ fontSize: 24 }} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}>
                    <MenuOutlined sx={{ fontSize: 24 }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Only renders on mobile screens */}
      <div className="lg:hidden">
        <MobileMenu
          isMenuOpen={isMenuOpen}
          isAuthenticated={isAuthenticated}
          user={user}
          cartItemsCount={cartItemsCount}
          location={location}
          onClose={closeMenus}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onLogout={handleLogout}
        />
      </div>
    </>
  );
};
