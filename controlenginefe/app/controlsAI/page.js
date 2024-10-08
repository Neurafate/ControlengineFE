"use client";
import { useState } from "react";
import {
  Button,
  Container,
  CircularProgress,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";

export default function Tool1Page() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleDeleteFile = (setFile) => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file1 || !file2) {
      alert("Please upload both files");
      return;
    }

    setLoading(true);

    // Create a form data object to send the files
    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);

    try {
      const response = await fetch("/api/process-files", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data.message); // Assuming the API returns a 'message'
    } catch (error) {
      console.error("Error:", error);
      setResult("An error occurred while processing the files.");
    } finally {
      setLoading(false);
    }
  };

  const Input = styled("input")({
    display: "none",
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        sx={{
          backgroundColor: "#cccccc",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
        maxWidth="sm"
      >
        <Typography variant="h4" gutterBottom>
          Controls Engine
        </Typography>
        <form onSubmit={handleSubmit}>
          <label htmlFor="file1">
            <Input
              accept=".xlsx"
              id="file1"
              type="file"
              onChange={(e) => handleFileChange(e, setFile1)}
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
                "&:hover": {
                  borderColor: "#333333",
                },
              }}
            >
              Upload User Org Framework
            </Button>
          </label>
          {file1 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <Typography variant="body2">{file1.name}</Typography>
              <IconButton onClick={() => handleDeleteFile(setFile1)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )}

          <label htmlFor="file2">
            <Input
              accept=".xlsx"
              id="file2"
              type="file"
              onChange={(e) => handleFileChange(e, setFile2)}
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
                "&:hover": {
                  borderColor: "#333333",
                },
              }}
            >
              Upload Service Org Framework
            </Button>
          </label>
          {file2 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <Typography variant="body2">{file2.name}</Typography>
              <IconButton onClick={() => handleDeleteFile(setFile2)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            sx={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#333333",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#FFE600",
                color: "black",
                transform: "scale(1.05)",
              },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </form>
        {result && (
          <Typography variant="body1" sx={{ marginTop: "1.5rem" }}>
            {result}
          </Typography>
        )}
      </Container>
    </Box>
  );
}
