import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;