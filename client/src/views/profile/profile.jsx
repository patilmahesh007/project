import React, { useState } from "react";
import axios from "axios";

function Profile() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  // Handle file input change event
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Upload image to Cloudinary
  const uploadImage = async () => {
    if (!image) {
      alert("Please select an image file to upload.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "<YOUR_UPLOAD_PRESET>"); // Replace with your upload preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/<YOUR_CLOUD_NAME>/image/upload", // Replace with your Cloudinary cloud name
        formData
      );
      setUploadedUrl(response.data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-page" style={styles.page}>
      <h2 style={styles.heading}>User Profile</h2>
      <div className="profile-image" style={styles.imageContainer}>
        {uploadedUrl ? (
          <img src={uploadedUrl} alt="Profile" style={styles.image} />
        ) : (
          <p style={styles.noImageText}>No image uploaded</p>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={styles.fileInput}
      />
      <button onClick={uploadImage} disabled={uploading} style={styles.button}>
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
}

// Optional inline styles
const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    background: "#f5f5f5",
    minHeight: "100vh",
  },
  heading: {
    marginBottom: "1.5rem",
    color: "#333",
  },
  imageContainer: {
    width: "200px",
    height: "200px",
    border: "2px dashed #ccc",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1rem",
    overflow: "hidden",
    background: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  noImageText: {
    color: "#999",
  },
  fileInput: {
    marginBottom: "1rem",
  },
  button: {
    padding: "0.5rem 1rem",
    background: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Profile;
