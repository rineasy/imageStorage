"use client";

import React, { useEffect, useState } from "react";

interface Image {
  _id: string;
  url: string;
  userId: string;
}

const Gallery: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login"; // Redirect to login if not authenticated
      return;
    }

    const fetchImages = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/upload/images", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setImages(data);
        } else {
          console.error("Failed to fetch images:", response.statusText);
        }
      } catch (err) {
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Your Uploaded Images</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {images.map((image) => (
          <div key={image._id} className="border p-2 rounded shadow">
            <img
              src={image.url}
              alt="Uploaded"
              className="w-full h-auto object-cover rounded"
            />
          </div>
        ))}
      </div>
      {images.length === 0 && (
        <p className="text-gray-500 mt-4">You haven't uploaded any images yet.</p>
      )}
    </div>
  );
};

export default Gallery;
