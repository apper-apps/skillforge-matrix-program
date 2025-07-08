import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Browse from "@/components/pages/Browse";
import CourseDetail from "@/components/pages/CourseDetail";
import VideoPlayer from "@/components/pages/VideoPlayer";
import MyLearning from "@/components/pages/MyLearning";
import Cart from "@/components/pages/Cart";
import Checkout from "@/components/pages/Checkout";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Browse />} />
          <Route path="course/:id" element={<CourseDetail />} />
          <Route path="course/:id/learn" element={<VideoPlayer />} />
          <Route path="my-learning" element={<MyLearning />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="toast-container"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;