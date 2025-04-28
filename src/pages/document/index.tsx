import React, { useState } from "react";
import axios from "axios";

function UploadContract() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8080/upload-contract",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Uploaded to DocuPanda:", res.data);
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload}>Upload Contract</button>
    </div>
  );
}

export default UploadContract;
