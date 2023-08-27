import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import { logout } from "../context/actions";

const Navbar = () => {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();
  console.log("navbar", state)

  const handleLogout = (e) => {
    e.preventDefault();

    dispatch(logout())
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-style">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/dashboard">
          eCommerce
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {state.isLoggedIn && state.currentUser.role === "user" ? (
              <>
                <li className="nav-item">
                  <NavLink
                    activeClassName="active"
                    className="nav-link"
                    aria-current="page"
                    to="/dashboard"
                  >
                    <i className="fa fa-dashboard"></i> Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    activeClassName="active"
                    className="nav-link"
                    aria-current="page"
                    to="/store"
                  >
                    <i className="fa fa-shopping-bag"></i> Store
                  </NavLink>
                </li>
              </>
            ) : null}

            {state.isLoggedIn && state.currentUser.role === "admin" ? (
                <li className="nav-item">
                  <NavLink
                    activeClassName="active"
                    className="nav-link"
                    aria-current="page"
                    to="/products"
                  >
                    <i className="fa fa-suitcase"></i> Products
                  </NavLink>
                </li>
            ) : null}

            {!state.isLoggedIn && (
              <li className="nav-item">
                <NavLink
                  activeClassName="active"
                  className="nav-link"
                  aria-current="page"
                  to="/"
                >
                  Login
                </NavLink>
              </li>
            )}

            {!state.isLoggedIn && (
              <li className="nav-item">
                <NavLink
                  activeClassName="active"
                  className="nav-link"
                  aria-current="page"
                  to="/register"
                >
                  Register
                </NavLink>
              </li>
            )}
          </ul>

          {state.isLoggedIn && (
            <div style={{ marginRight: "100px" }}>
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <NavLink
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa fa-user-circle"></i>
                    {" " + state.currentUser?.fullName}
                  </NavLink>
                  <div className="dropdown-menu">
                    <NavLink
                      className="dropdown-item"
                      to="/logout"
                      onClick={(e) => handleLogout(e)}
                    >
                      Logout
                    </NavLink>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
