import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cartService } from "@/services/api/cartService";
import { courseService } from "@/services/api/courseService";

const CartDropdown = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadCartData();
    }
  }, [isOpen]);

  const loadCartData = async () => {
    try {
      setLoading(true);
      const [cartData, coursesData] = await Promise.all([
        cartService.getAll(),
        courseService.getAll()
      ]);
      
      setCartItems(cartData);
      setCourses(coursesData);
    } catch (error) {
      console.error("Error loading cart data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCartCourses = () => {
    return cartItems.map(item => {
      const course = courses.find(c => c.Id === parseInt(item.courseId));
      return { ...item, course };
    }).filter(item => item.course);
  };

  const handleRemoveItem = async (courseId) => {
    try {
      await cartService.removeItem(courseId);
      setCartItems(prev => prev.filter(item => item.courseId !== courseId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-96 z-50">
      <Card className="p-4 bg-white border shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg">Shopping Cart</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex gap-3">
                  <div className="w-16 h-12 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : getCartCourses().length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="ShoppingCart" size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link to="/" onClick={onClose}>
              <Button variant="primary">Browse Courses</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="max-h-64 overflow-y-auto space-y-3">
              {getCartCourses().map((item) => (
                <div key={item.Id} className="flex items-center gap-3 p-2 border rounded">
                  <img
                    src={item.course.thumbnail}
                    alt={item.course.title}
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">{item.course.title}</h4>
                    <p className="text-xs text-gray-600">{item.course.instructor.name}</p>
                    <span className="text-primary font-semibold">${item.price}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.courseId)}
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold text-primary">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              <div className="space-y-2">
                <Link to="/cart" onClick={onClose}>
                  <Button variant="outline" className="w-full">
                    View Cart
                  </Button>
                </Link>
                <Link to="/checkout" onClick={onClose}>
                  <Button variant="primary" className="w-full">
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CartDropdown;