import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginControls } from "../utils/constants";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [dirty, setDirty] = useState({ email: false, password: false });
  const [errors, setErrors] = useState({ email: [], password: [] });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setCurrentUser, setIsLoggedIn } = useContext(UserContext);

  const validate = () => {
    const emailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15})/;

    let errors = {};

    loginControls.forEach((control) => {
      errors[control] = [];

      switch (control) {
        case "email":
          if (!credentials[control]) {
            errors[control].push("Email can't be blank");
          }

          if (credentials[control]) {
            if (!emailRegex.test(credentials[control])) {
              errors[control].push("Proper email address is expected");
            }
          }
          break;

        case "password":
          if (!credentials[control]) {
            errors[control].push("Password can't be blank");
          }

          if (credentials[control]) {
            if (!passwordRegex.test(credentials[control])) {
              errors[control].push(
                "Password should be between 6 to 15 characters long, with at least one uppercase, one lowercase and one digit"
              );
            }
          }
          break;

        default:
          break;
      }
    });

    setErrors(errors);
  };

  const handleBlur = (e) => {
    setDirty({ ...dirty, [e.target.name]: true });
    validate();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const dirtyData = dirty;

    Object.keys(dirty).forEach((control) => (dirtyData[control] = true));
    setDirty(dirtyData);
    validate();

    const validForm = Object.values(errors).every(
      (control) => control.length === 0
    );

    if (validForm) {
      const response = await fetch(
        `http://localhost:9000/users?email=${credentials.email}&password=${credentials.password}`,
        { method: "GET" }
      );

      if (response.ok) {
        const json = await response.json();

        if (json.length > 0) {
          setCurrentUser(json[0]);
          setIsLoggedIn(true);
          navigate("/dashboard");
        } else {
          setMessage(<span className="text-danger">Invalid Login</span>);
        }
      } else {
        setMessage(
          <span className="text-danger">Unable to connect with the server</span>
        );
      }
    }
  };

  useEffect(() => validate(), [credentials]);

  return (
    <div className="row">
      <div className="col-lg-6 col-md-7 mx-auto">
        <div className="card border-primary shadow-lg my-2">
          <div className="card-header border-bottom border-primary">
            <h4
              style={{ fontSize: "40px" }}
              className="text-primary text-center"
            >
              Login
            </h4>
          </div>

          <div className="card-body border-bottom">
            <div className="form-group row">
              <label
                className="col-sm-3 col-form-label col-form-label-m"
                htmlFor="email"
              >
                Email
              </label>
              <div className="col-sm-8">
                <input
                  name="email"
                  type="email"
                  className="form-control form-control-sm"
                  id="email"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  onBlur={(e) => handleBlur(e)}
                />
                <span className="text-danger">
                  {errors.email.length && dirty.email ? errors.email[0] : null}
                </span>
              </div>
            </div>
          </div>
          <div className="card-body border-bottom">
            <div className="form-group row">
              <label
                className="col-sm-3 col-form-label col-form-label-m"
                htmlFor="password"
              >
                Password
              </label>
              <div className="col-sm-8">
                <input
                  name="password"
                  type="password"
                  className="form-control form-control-sm"
                  id="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  onBlur={(e) => handleBlur(e)}
                />
                <span className="text-danger">
                  {errors.password.length && dirty.password
                    ? errors.password[0]
                    : null}
                </span>
              </div>
            </div>
          </div>

          <div className="card-footer text-center">
            <div className="m-1">{message}</div>
            <button
              className="btn btn-success m-2"
              onClick={(e) => handleLogin(e)}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
