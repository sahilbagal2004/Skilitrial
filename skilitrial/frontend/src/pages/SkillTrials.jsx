import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CloudUpload, FileVideo, FileAudio, X, PlaySquare, CheckCircle, Upload, Music, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./SkillTrials.css";

function SkillTrials() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || "";

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActive) {
      setIsDragActive(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile) => {
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.type.startsWith('video/') && !selectedFile.type.startsWith('audio/')) {
      alert("Please upload a valid video or audio file.");
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setProgress(0);
    setUploadSuccess(false);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${API}/api/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: (event) => {
            const percent = Math.round(
              (event.loaded * 100) / event.total
            );
            setProgress(percent);
          },
        }
      );

      setUploadSuccess(true);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="skill-page-wrapper">
      <motion.div 
        className="skill-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="skill-header">
          <div className="skill-icon-wrap">
            <Upload className="header-icon" />
          </div>
          <h2>Upload Your Skill Trial</h2>
          <p>Showcase your abilities by uploading a video or audio clip.</p>
        </div>

        {!file && (
          <div 
            className={`drop-zone ${isDragActive ? 'active' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudUpload className="cloud-icon" />
            <h3>Drag & Drop your file here</h3>
            <p className="drop-hint">or click to browse from your device</p>
            <span className="file-types-badge">Video or Audio (Max 50MB)</span>
            
            <input
              type="file"
              accept="video/*,audio/*"
              onChange={handleFileChange}
              className="hidden-input"
              ref={fileInputRef}
            />
          </div>
        )}

        <AnimatePresence>
          {file && (
            <motion.div 
              className="file-preview-section"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="file-info-card">
                <div className="file-icon-container">
                  {file.type.startsWith('video/') ? <FileVideo className="type-icon video" /> : <Music className="type-icon audio" />}
                </div>
                <div className="file-details">
                  <span className="file-name" title={file.name}>{file.name}</span>
                  <span className="file-size">{formatFileSize(file.size)}</span>
                </div>
                {!isUploading && !uploadSuccess && (
                  <button className="remove-btn" onClick={handleRemoveFile} aria-label="Remove file">
                    <X size={18} />
                  </button>
                )}
              </div>

              {preview && file.type.startsWith('video/') && (
                <div className="media-preview-box">
                  <video
                    src={preview}
                    controls
                    className="media-player"
                  />
                </div>
              )}
              
              {preview && file.type.startsWith('audio/') && (
                <div className="media-preview-box audio-preview">
                  <audio
                    src={preview}
                    controls
                    className="media-player audio-player"
                  />
                </div>
              )}

              {isUploading && (
                <div className="progress-container">
                  <div className="progress-header">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <motion.div 
                      className="progress-fill-active"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "linear" }}
                    />
                  </div>
                </div>
              )}

              {uploadSuccess && (
                <motion.div 
                  className="success-message"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CheckCircle className="success-icon" />
                  <span>Skill Trial Uploaded Successfully!</span>
                </motion.div>
              )}

              {!uploadSuccess && (
                <button 
                  className={`action-btn ${isUploading ? 'uploading' : ''}`} 
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="spinner-icon" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <CloudUpload className="btn-icon" />
                      Confirm & Upload
                    </>
                  )}
                </button>
              )}
              
              {uploadSuccess && (
                <button 
                  className="action-btn outline-btn" 
                  onClick={handleRemoveFile}
                >
                  Upload Another File
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default SkillTrials;