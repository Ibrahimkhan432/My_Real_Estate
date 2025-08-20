import { set } from "mongoose";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (!res.ok) {
        setLoading(false);
        setError(data.message);
        console.error("Signup error:", data.message);
        return;
      }
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl">Sign Up</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            onChange={handleChange}
            id="userName"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray border-solid rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your Name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            onChange={handleChange}
            id="email"
            type="email"
            className="mt-1 block w-full px-3 py-2 border border-gray border-solid rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            onChange={handleChange}
            id="password"
            type="password"
            className="mt-1 block w-full px-3 py-2 border border-gray border-solid rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your password"
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <button
          type="button"
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600 mt-2"
        >
          Continue with Google
        </button>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
