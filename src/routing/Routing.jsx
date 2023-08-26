import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register, Login, Dashboard, PageNotFound } from "../pages/index";
import { Navbar } from "../components";

const Routing = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container-fluid">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Routing;
