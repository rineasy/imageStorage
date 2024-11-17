"use client";
import React, { useState } from "react";
import Swal from "sweetalert2"; // For alerts

const Login = () => {
  const [email, setEmail] = useState<string>(""); // Email state
  const [password, setPassword] = useState<string>(""); // Password state

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = { email, password };

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token); 
        console.log("Login data:", data);
        Swal.fire({
          title: "Success!",
          text: "Login successful!",
          icon: "success",
          confirmButtonText: "Okay",
        });

        window.location.href = "./dashboard";
      } else {
        const error = await response.json();
        Swal.fire({
          title: "Error!",
          text: error.message || "Login failed. Please try again.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Oops!",
        text: "An error occurred. Please try again later.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col">
        <div className="text-center lg:text-left flex flex-col items-center">
          <h1 className="text-5xl text-center font-bold">Login now!</h1>
          <p className="py-6 sm:w-96">
            Securely store, organize, and access your images anytime, anywhere.
            Experience fast uploads, reliable cloud storage, and effortless
            sharing with our platform.
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="label">
                <a href="/#register" className="label-text-alt link link-hover">
                  Create an Account?
                </a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
