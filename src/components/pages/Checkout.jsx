import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { cartService } from "@/services/api/cartService";
import { courseService } from "@/services/api/courseService";
import { enrollmentService } from "@/services/api/enrollmentService";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: "",
    city: "",
    country: "",
    zipCode: ""
  });

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
      
      if (cartData.length === 0) {
        navigate("/cart");
        return;
      }
      
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

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const getTotalSavings = () => {
    return getTotalPrice() * 0.2; // 20% discount
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setProcessing(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create enrollments for all courses
      const enrollmentPromises = cartItems.map(item => 
        enrollmentService.create({
          courseId: item.courseId,
          progress: 0,
          completedLessons: []
        })
      );
      
      await Promise.all(enrollmentPromises);
      
      // Clear cart
      await cartService.clearCart();
      
      toast.success("Payment successful! You're now enrolled in your courses.");
      navigate("/my-learning");
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCartData} />;
  }

  const cartCourses = getCartCourses();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-gradient mb-4">
          Checkout
        </h1>
        <p className="text-gray-600 text-lg">
          Complete your purchase and start learning
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <Card className="p-6">
              <h3 className="font-display font-semibold text-xl mb-4">
                Contact Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Payment Information */}
            <Card className="p-6">
              <h3 className="font-display font-semibold text-xl mb-4">
                Payment Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardholderName">Cardholder Name *</Label>
                  <Input
                    id="cardholderName"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleInputChange}
                    placeholder="Enter cardholder name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Billing Address */}
            <Card className="p-6">
              <h3 className="font-display font-semibold text-xl mb-4">
                Billing Address
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="billingAddress">Address</Label>
                  <Input
                    id="billingAddress"
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </Card>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h3 className="font-display font-semibold text-xl mb-4">
              Order Summary
            </h3>
            
            <div className="space-y-3 mb-6">
              {cartCourses.map((item) => (
                <div key={item.Id} className="flex items-center gap-3">
                  <img
                    src={item.course.thumbnail}
                    alt={item.course.title}
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">
                      {item.course.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {item.course.instructor.name}
                    </p>
                  </div>
                  <span className="font-semibold text-primary">
                    ${item.price}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 mb-6 border-t pt-4">
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
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={processing}
              onClick={handleSubmit}
            >
              {processing ? (
                <>
                  <ApperIcon name="Loader" size={20} className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <ApperIcon name="CreditCard" size={20} className="mr-2" />
                  Complete Purchase
                </>
              )}
            </Button>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="Shield" size={16} className="text-success" />
                <span className="font-medium text-sm">Secure Payment</span>
              </div>
              <p className="text-xs text-gray-600">
                Your payment information is encrypted and secure
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;