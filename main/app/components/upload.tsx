"use client";

import React, { useState, ChangeEvent } from "react";
import Swal from "sweetalert2";

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null); // File type
  const [uploading, setUploading] = useState<boolean>(false); // Upload state

  // Handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null; // Optional chaining
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "No File Selected",
        text: "Please select a file to upload.",
      });
      return;
    }

    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "You must be logged in to upload files.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", file); // 'image' matches the backend field name

    setUploading(true);

    try {
      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer Token
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        Swal.fire({
          icon: "success",
          title: "Upload Successful",
          text: `Your image URL: ${data.url}`,
          footer: `<a href="${data.url}" target="_blank">View Image</a>`,
        });
      } else {
        const error = await response.json();
        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: error.message || "Something went wrong during the upload.",
        });
      }
    } catch (err) {
      console.error("Error during upload:", err);
      Swal.fire({
        icon: "error",
        title: "Upload Error",
        text: "An error occurred during the upload. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-4">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Pick a file</span>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
            onChange={handleFileChange} // Event handler
            accept="image/*" // Restrict to image files only
          />
        </label>
        <button
          className={`btn btn-primary w-full mt-4 ${
            uploading ? "loading" : ""
          }`}
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default Upload;
