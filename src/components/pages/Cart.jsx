import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { cartService } from "@/services/api/cartService";
import { courseService } from "@/services/api/courseService";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [cartData, coursesData] = await Promise.all([
        cartService.getAll(),
        courseService.getAll()
      ]);
      
      setCartItems(cartData);
      setCourses(coursesData);
    } catch (error) {
      console.error("Error loading cart data:", error);
      setError("Failed to load cart data");
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
      toast.success("Course removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove course from cart");
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const getTotalSavings = () => {
    // Mock savings calculation
    return getTotalPrice() * 0.2; // 20% discount
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCartData} />;
  }

  const cartCourses = getCartCourses();

  if (cartCourses.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-display font-bold text-gradient mb-8">
          Shopping Cart
        </h1>
        <Empty
          title="Your cart is empty"
          description="Add some courses to your cart to get started"
          actionText="Browse Courses"
          actionLink="/"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-gradient mb-4">
          Shopping Cart
        </h1>
        <p className="text-gray-600 text-lg">
          {cartCourses.length} course{cartCourses.length !== 1 ? "s" : ""} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartCourses.map((item) => (
            <Card key={item.Id} className="p-6">
              <div className="flex gap-4">
                <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.course.thumbnail}
                    alt={item.course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <Link to={`/course/${item.course.Id}`}>
                    <h3 className="font-display font-semibold text-lg mb-2 hover:text-primary transition-colors">
                      {item.course.title}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    by {item.course.instructor.name}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <ApperIcon name="Clock" size={14} />
                      {item.course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <ApperIcon name="BarChart" size={14} />
                      {item.course.level}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        ${item.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${(item.price * 1.2).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.courseId)}
                        className="text-error hover:text-error"
                      >
                        <ApperIcon name="Trash2" size={16} />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h3 className="font-display font-semibold text-xl mb-4">
              Order Summary
            </h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-success">
                <span>Discount:</span>
                <span>-${getTotalSavings().toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">
                    ${(getTotalPrice() - getTotalSavings()).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link to="/checkout">
                <Button variant="primary" size="lg" className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>
              
              <Link to="/">
                <Button variant="outline" size="lg" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="Shield" size={16} className="text-success" />
                <span className="font-medium text-sm">30-Day Money-Back Guarantee</span>
              </div>
              <p className="text-xs text-gray-600">
                Full refund if you're not satisfied with your purchase
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;