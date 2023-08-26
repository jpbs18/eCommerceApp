import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { registerControls, countries } from "../utils/constants";
import { UserContext } from "../context/UserContext";

const Register = () => {
  const [message, setMessage] = useState("");
  const { setCurrentUser, setIsLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    email: [],
    password: [],
    fullName: [],
    dateOfBirth: [],
    gender: [],
    country: [],
  });

  const [dirty, setDirty] = useState({
    email: false,
    password: false,
    fullName: false,
    dateOfBirth: false,
    gender: false,
    country: false,
  });

  const [state, setState] = useState({
    email: "",
    password: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    country: "",
    receiveNewsLetters: false,
  });

  const handleInput = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });

  const handleInputCheckbox = (e) =>
    setState({ ...state, [e.target.name]: e.target.checked });

  const handleBlur = (e) => {
    setDirty({ ...dirty, [e.target.name]: true });
    validate();
  };

  const validate = () => {
    const emailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15})/;

    let errors = {};

    registerControls.forEach((control) => {
      errors[control] = [];

      switch (control) {
        case "email":
          if (!state[control]) {
            errors[control].push("Email can't be blank");
          }

          if (state[control]) {
            if (!emailRegex.test(state[control])) {
              errors[control].push("Proper email address is expected");
            }
          }
          break;

        case "password":
          if (!state[control]) {
            errors[control].push("Password can't be blank");
          }

          if (state[control]) {
            if (!passwordRegex.test(state[control])) {
              errors[control].push(
                "Password should be between 6 to 15 characters long, with at least one uppercase, one lowercase and one digit"
              );
            }
          }
          break;

        case "fullName":
          if (!state[control]) {
            errors[control].push("Full name can't be blank");
          }
          break;

        case "dateOfBirth":
          if (!state[control]) {
            errors[control].push("Date can't be blank");
          }

          if (state[control]) {
            const dob = new Date(state[control]).getTime();
            const today = new Date().getTime();
            const adultAge = 18 * 365.25 * 24 * 60 * 60 * 1000;

            if (today - adultAge < dob) {
              errors[control].push("Minimum age is 18");
            }
          }
          break;

        case "gender":
          if (!state[control]) {
            errors[control].push("Gender can't be blank");
          }
          break;

        case "country":
          if (!state[control]) {
            errors[control].push("A country must be selected");
          }
          break;

        default:
          break;
      }
    });

    setErrors(errors);
  };

  const onRegister = async (e) => {
    e.preventDefault();
    const dirtyData = dirty;

    Object.keys(dirty).forEach((control) => (dirtyData[control] = true));
    setDirty(dirtyData);
    validate();

    const validForm = Object.values(errors).every(
      (control) => control.length === 0
    );

    if (validForm) {
      const response = await fetch("http://localhost:9000/users", {
        method: "POST",
        body: JSON.stringify(state),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const json = await response.json();
    
        setCurrentUser(json);
        setIsLoggedIn(true);
        navigate("/dashboard");
      }
    } else {
      setMessage(<span className="text-danger">Something went wrong</span>);
    }
  };

  useEffect(() => validate(), [state]);

  return (
    <div className="row">
      <div className="col-lg-6 cold-md-7 mx-auto">
        <div className="card border-primary shadow-lg my-2">
          <div className="card-header border-bottom border-primary">
            <h4
              style={{ fontSize: "40px" }}
              className="text-primary text-center"
            >
              Register
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
                  id="email"
                  type="email"
                  className="form-control form-control-sm"
                  name="email"
                  value={state.email}
                  onChange={(e) => handleInput(e)}
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
                  id="password"
                  type="password"
                  className="form-control form-control-sm"
                  name="password"
                  value={state.password}
                  onChange={(e) => handleInput(e)}
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

          <div className="card-body border-bottom">
            <div className="form-group row">
              <label
                className="col-sm-3 col-form-label col-form-label-m"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <div className="col-sm-8">
                <input
                  id="fullName"
                  type="text"
                  className="form-control form-control-sm"
                  name="fullName"
                  value={state.fullName}
                  onChange={(e) => handleInput(e)}
                  onBlur={(e) => handleBlur(e)}
                />
                <span className="text-danger">
                  {errors.fullName.length && dirty.fullName
                    ? errors.fullName[0]
                    : null}
                </span>
              </div>
            </div>
          </div>

          <div className="card-body border-bottom">
            <div className="form-group row">
              <label
                className="col-sm-3 col-form-label col-form-label-m"
                htmlFor="dateOfBirth"
              >
                Date of Birth
              </label>
              <div className="col-sm-8">
                <input
                  id="dateOfBirth"
                  type="date"
                  className="form-control form-control-sm"
                  name="dateOfBirth"
                  value={state.dateOfBirth}
                  onChange={(e) => handleInput(e)}
                  onBlur={(e) => handleBlur(e)}
                />
                <span className="text-danger">
                  {errors.dateOfBirth.length && dirty.dateOfBirth
                    ? errors.dateOfBirth[0]
                    : null}
                </span>
              </div>
            </div>
          </div>

          <div className="card-body border-bottom">
            <div className="form-group row">
              <label className="col-lg-3">Gender</label>
              <div className="col-lg-8">
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    name="gender"
                    value="male"
                    id="male"
                    checked={state.gender === "male"}
                    onChange={(e) => handleInput(e)}
                  />
                  <label htmlFor="male" className="custom-control-label">
                    Male
                  </label>

                  <div className="custom-control custom-radio custom-control-inline"></div>
                  <input
                    type="radio"
                    className="custom-control-input"
                    name="gender"
                    value="female"
                    id="female"
                    checked={state.gender === "female"}
                    onChange={(e) => handleInput(e)}
                  />
                  <label htmlFor="female" className="custom-control-label">
                    Female
                  </label>
                </div>
                <span className="text-danger">
                  {errors.gender.length && dirty.gender
                    ? errors.gender[0]
                    : null}
                </span>
              </div>
            </div>
          </div>

          <div className="card-body border-bottom">
            <div className="form-group row">
              <label
                className="col-sm-3 col-form-label col-form-label-m"
                htmlFor="country"
              >
                Country
              </label>
              <div className="col-sm-8">
                <select
                  id="country"
                  type="text"
                  className="form-control form-control-sm"
                  name="country"
                  value={state.country}
                  onChange={(e) => handleInput(e)}
                  onBlur={(e) => handleBlur(e)}
                >
                  <option value="">Please select a country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.countryName}>
                      {country.countryName}
                    </option>
                  ))}
                </select>
                <span className="text-danger">
                  {errors.country.length && dirty.country
                    ? errors.country[0]
                    : null}
                </span>
              </div>
            </div>
          </div>

          <div className="card-body border-bottom">
            <div className="form-group row">
              <label className="col-lg-3" htmlFor="receivedNewsLetters">
                Receive News Letters
              </label>
              <div className="col-lg-8">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="receiveNewsLetters"
                    id="receiveNewsLetters"
                    checked={state.receiveNewsLetters}
                    onChange={(e) => handleInputCheckbox(e)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card-footer text-center">
            <div className="m-1">{message}</div>
            <button
              className="btn btn-success m-2"
              onClick={(e) => onRegister(e)}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
