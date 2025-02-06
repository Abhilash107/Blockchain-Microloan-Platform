import axios from "axios";  // Import axios to make HTTP requests

export const verifyAadhaar = async (req, res) => {
  try {
    const { file } = req;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const formData = new FormData();
    formData.append("image", file.buffer, file.originalname);

    // Send the file to Python API (assuming Python server is running on port 5001)
    const response = await axios.post("http://localhost:5001/verify-aadhaar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.json(response.data);  // Return data from Python API to the frontend
  } catch (error) {
    console.error("Error verifying Aadhaar:", error);
    res.status(500).json({ error: "Aadhaar verification failed" });
  }
};
