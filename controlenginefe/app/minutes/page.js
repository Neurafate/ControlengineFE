"use client";
import { useState } from "react";
import {
  Button,
  Container,
  CircularProgress,
  Typography,
  Box,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";
import ReactMarkdown from "react-markdown";
import { Modal } from "antd";

const StyledInput = styled("input")({
  display: "none",
});

export default function MinutesGenerator() {
  const [file, setFile] = useState(null);

  // The user can choose:
  // 'transcription', 'concise_minutes', 'detailed_minutes', 'concise_summary', 'detailed_summary'
  const [option, setOption] = useState("transcription");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult("");
    setError("");
  };

  const handleDeleteFile = () => {
    setFile(null);
    setResult("");
    setError("");
  };

  const handleOptionChange = (e) => {
    setOption(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a file.");
      return;
    }

    setLoading(true);
    setResult("");
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("option", option);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "An error occurred while processing.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setResult(data.result);
      setLoading(false);
      setIsModalVisible(true);
    } catch (err) {
      console.error("Error:", err);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <Container
        sx={{
          backgroundColor: "#ffffff",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          maxWidth: "600px",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Automated Meeting Processor
        </Typography>
        <form onSubmit={handleSubmit}>
          <label htmlFor="uploadFile">
            <StyledInput
              accept=".mp4,.wav,.m4a,.mov,.avi"
              id="uploadFile"
              type="file"
              onChange={handleFileChange}
              required
            />
            <Button
              startIcon={<UploadIcon />}
              variant="outlined"
              component="span"
              sx={{
                marginBottom: "1rem",
                width: "100%",
                color: "#333333",
                borderColor: "#333333",
                "&:hover": { borderColor: "#333333" },
              }}
            >
              Upload Recording
            </Button>
          </label>

          {file && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                padding: "0 1rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <Typography variant="body2">{file.name}</Typography>
              <IconButton onClick={handleDeleteFile}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )}

          {/* Radio Group for the 5 possible options */}
          <Box sx={{ mb: 2, textAlign: "left" }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Choose an Option</FormLabel>
              <RadioGroup
                row
                aria-label="processing-option"
                name="processing-option-group"
                value={option}
                onChange={handleOptionChange}
              >
                <FormControlLabel
                  value="transcription"
                  control={<Radio />}
                  label="Transcription"
                />
                <FormControlLabel
                  value="concise_minutes"
                  control={<Radio />}
                  label="Concise Minutes"
                />
                <FormControlLabel
                  value="detailed_minutes"
                  control={<Radio />}
                  label="Detailed Minutes"
                />
                <FormControlLabel
                  value="concise_summary"
                  control={<Radio />}
                  label="Concise Summary"
                />
                <FormControlLabel
                  value="detailed_summary"
                  control={<Radio />}
                  label="Detailed Summary"
                />
              </RadioGroup>
            </FormControl>
          </Box>

          <Button
            type="submit"
            variant="contained"
            sx={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#333333",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#555555",
                transform: "scale(1.05)",
              },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Process Recording"}
          </Button>
        </form>

        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Container>

      <Modal
        title="Processing Result"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width="80%"
      >
        {result ? (
          // Using ReactMarkdown to display either transcript or summary
          <ReactMarkdown>{result}</ReactMarkdown>
        ) : (
          <Typography>No result to display.</Typography>
        )}
      </Modal>
    </Box>
  );
}
