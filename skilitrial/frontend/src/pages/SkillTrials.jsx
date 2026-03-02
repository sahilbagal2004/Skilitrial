import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SkillTrials.css";

function SkillTrials() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${API}/api/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (event) => {
            const percent = Math.round(
              (event.loaded * 100) / event.total
            );
            setProgress(percent);
          },
        }
      );

      alert("Skill Trial Uploaded Successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="skill-container">
      <h2>Upload Your Skill Trial</h2>

      <input
        type="file"
        accept="video/*,audio/*"
        onChange={handleFileChange}
        className="file-input"
      />

      {preview && (
        <div className="preview-box">
          <video
            src={preview}
            controls
            width="100%"
            style={{ borderRadius: "10px" }}
          />
        </div>
      )}

      {progress > 0 && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <button className="upload-btn" onClick={handleUpload}>
        Upload Trial
      </button>
    </div>
  );
}

export default SkillTrials;