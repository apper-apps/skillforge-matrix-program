import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import CartDropdown from "@/components/molecules/CartDropdown";
import ApperIcon from "@/components/ApperIcon";
import { cartService } from "@/services/api/cartService";

const Header = ({ onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    loadCartCount();
  }, []);

  const loadCartCount = async () => {
    try {
      const cartItems = await cartService.getAll();
      setCartCount(cartItems.length);
    } catch (error) {
      console.error("Error loading cart count:", error);
    }
  };

  const navItems = [
    { path: "/", label: "Browse", icon: "BookOpen" },
    { path: "/my-learning", label: "My Learning", icon: "GraduationCap" }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={20} className="text-white" />
            </div>
            <span className="text-xl font-display font-bold text-gradient">
              SkillForge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? "text-primary bg-purple-50"
                    : "text-gray-700 hover:text-primary hover:bg-gray-50"
                }`}
              >
                <ApperIcon name={item.icon} size={18} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <SearchBar onSearch={onSearch} />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative"
              >
                <ApperIcon name="ShoppingCart" size={20} />
                {cartCount > 0 && (
                  <Badge
                    variant="accent"
                    className="absolute -top-2 -right-2 min-w-[20px] h-5 rounded-full text-xs animate-bounce-badge"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
              <CartDropdown
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            <ApperIcon name={isMenuOpen ? "X" : "Menu"} size={24} />
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <SearchBar onSearch={onSearch} />
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden border-t bg-white py-4"
          >
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    isActive(item.path)
                      ? "text-primary bg-purple-50"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  <ApperIcon name={item.icon} size={18} />
                  {item.label}
                </Link>
              ))}
              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50"
              >
                <ApperIcon name="ShoppingCart" size={18} />
                Cart ({cartCount})
              </Link>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;