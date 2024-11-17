"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

// Define the structure of your token
interface DecodedToken {
  exp: number; // Expiration time in seconds (UNIX timestamp)
  [key: string]: any; // Include additional properties if needed
}

const Dashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Redirect to login if no token found
      router.push("/login");
      return;
    }

    try {
      // Decode the token and check its expiry
      const decodedToken = jwtDecode<DecodedToken>(token); // Decode with type
      const currentTime = Date.now() / 1000; // Current time in seconds

      if (decodedToken.exp && decodedToken.exp < currentTime) {
        // Token expired; redirect to login
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }
    } catch (err) {
      console.error("Error decoding token:", err);
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }

    // Validate token with the backend
    fetch("http://localhost:8080/api/auth/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          // Token invalid or expired; redirect to login
          localStorage.removeItem("token");
          router.push("/login");
        }
      })
      .catch((err) => {
        console.error("Error validating token:", err);
        router.push("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Display loading state while validating token
  }

  return <div>Welcome to the Dashboard!</div>;
};

export default Dashboard;
