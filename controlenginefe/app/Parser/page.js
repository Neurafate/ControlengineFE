// frontend/pages/parser.js

"use client";

import { useState } from "react";
import {
  Button,
  Container,
  CircularProgress,
  Typography,
  Box,
  IconButton,
  Grid,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";
import { Modal, Input } from "antd";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import * as XLSX from "xlsx"; // For parsing Excel files

export default function ParserPage() {
  // State variables for Form Inputs
  const [pdfFile, setPdfFile] = useState(null);
  const [startPage, setStartPage] = useState("");
  const [endPage, setEndPage] = useState("");
  const [controlID, setControlID] = useState("");

  // State variables for API Interaction
  const [loadingParse, setLoadingParse] = useState(false);
  const [loadingChunk, setLoadingChunk] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // State variables for Results
  const [txtFile, setTxtFile] = useState("");
  const [excelFile, setExcelFile] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [chunkedData, setChunkedData] = useState([]);

  // Modal Control
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(""); // "parse" or "chunk"

  const StyledInput = styled("input")({
    display: "none",
  });

  // Handlers for File Upload
  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleDeleteFile = () => {
    setPdfFile(null);
  };

  // Handler for Parse Button
  const handleParse = async () => {
    // Basic Validation
    if (!pdfFile) {
      alert("Please upload a PDF file.");
      return;
    }
    if (!startPage || !endPage) {
      alert("Please specify both start and end pages.");
      return;
    }

    setLoadingParse(true);
    setErrorMessage("");
    setTxtFile("");
    setExtractedText("");

    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("start_page", startPage);
    formData.append("end_page", endPage);

    try {
      const response = await fetch("http://localhost:5000/parse", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Error during parsing.");
        setLoadingParse(false);
        return;
      }

      setTxtFile(data.txt_file);
      setExtractedText(data.extracted_text);
      setModalContent("parse");
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setLoadingParse(false);
    }
  };

  // Handler for Chunk Button
  const handleChunk = async () => {
    // Basic Validation
    if (!pdfFile) {
      alert("Please upload a PDF file.");
      return;
    }
    if (!startPage || !endPage) {
      alert("Please specify both start and end pages.");
      return;
    }
    if (!controlID) {
      alert("Please provide Control ID(s).");
      return;
    }

    setLoadingChunk(true);
    setErrorMessage("");
    setExcelFile("");
    setChunkedData([]);

    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("start_page", startPage);
    formData.append("end_page", endPage);
    formData.append("control_id", controlID); // Multiple IDs separated by commas

    try {
      const response = await fetch("http://localhost:5000/chunk", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Error during chunking.");
        setLoadingChunk(false);
        return;
      }

      setExcelFile(data.excel_file);

      // Fetch and parse the Excel file to display content
      const excelResponse = await fetch(`http://localhost:5000/uploads/${data.excel_file}`);
      if (!excelResponse.ok) {
        setErrorMessage("Failed to download the Excel file.");
        setLoadingChunk(false);
        return;
      }
      const arrayBuffer = await excelResponse.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setChunkedData(jsonData);

      setModalContent("chunk");
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setLoadingChunk(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff", // Background color
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <Container
        sx={{
          backgroundColor: "#ffffff", // White background
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <Typography variant="h4" gutterBottom align="center" color="#333333">
          PDF Parser Tool
        </Typography>
        <form>
          <Grid container spacing={2}>
            {/* PDF Upload */}
            <Grid item xs={12}>
              <label htmlFor="pdfFile">
                <StyledInput
                  accept=".pdf"
                  id="pdfFile"
                  type="file"
                  onChange={handleFileChange}
                />
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadIcon />}
                  fullWidth
                  sx={{
                    borderColor: "#333333",
                    color: "#333333",
                    "&:hover": {
                      borderColor: "#333333",
                      backgroundColor: "#cccccc",
                      color: "#ffffff",
                    },
                  }}
                >
                  Upload PDF
                </Button>
              </label>
              {pdfFile && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 1,
                    backgroundColor: "#f5f5f5",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    border: "1px solid #cccccc",
                  }}
                >
                  <Typography variant="body2" color="#333333">
                    {pdfFile.name}
                  </Typography>
                  <IconButton onClick={handleDeleteFile} sx={{ color: "#999999" }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Grid>

            {/* Page Numbers Inputs */}
            <Grid item xs={6}>
              <Box sx={{ position: "relative" }}>
                <Input
                  placeholder="Start Page"
                  type="number"
                  value={startPage}
                  onChange={(e) => setStartPage(e.target.value)}
                  fullWidth
                  required
                  sx={{
                    padding: "0.5rem",
                    border: "1px solid #cccccc",
                    borderRadius: "4px",
                    "&:focus": { borderColor: "#ffe600" },
                  }}
                />
                <Tooltip
                  title="Specify the start page number for text extraction."
                  arrow
                  placement="top"
                >
                  <InfoIcon
                    sx={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#999999",
                    }}
                  />
                </Tooltip>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ position: "relative" }}>
                <Input
                  placeholder="End Page"
                  type="number"
                  value={endPage}
                  onChange={(e) => setEndPage(e.target.value)}
                  fullWidth
                  required
                  sx={{
                    padding: "0.5rem",
                    border: "1px solid #cccccc",
                    borderRadius: "4px",
                    "&:focus": { borderColor: "#ffe600" },
                  }}
                />
                <Tooltip
                  title="Specify the end page number for text extraction."
                  arrow
                  placement="top"
                >
                  <InfoIcon
                    sx={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#999999",
                    }}
                  />
                </Tooltip>
              </Box>
            </Grid>

            {/* Control ID Input */}
            <Grid item xs={12}>
              <Box sx={{ position: "relative" }}>
                <Input
                  placeholder="Control ID(s) (e.g., CC 1.2, DD 2.3)"
                  value={controlID}
                  onChange={(e) => setControlID(e.target.value)}
                  fullWidth
                  required
                  sx={{
                    padding: "0.5rem",
                    border: "1px solid #cccccc",
                    borderRadius: "4px",
                    "&:focus": { borderColor: "#ffe600" },
                  }}
                />
                <Tooltip title="Provide Control IDs from the SOC2 Report, separated by commas." arrow placement="top">
                  <InfoIcon
                    sx={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#999999",
                    }}
                  />
                </Tooltip>
              </Box>
            </Grid>

            {/* Buttons */}
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleParse}
                disabled={loadingParse || loadingChunk}
                sx={{
                  backgroundColor: "#333333",
                  color: "#ffffff",
                  padding: "0.75rem",
                  "&:hover": {
                    backgroundColor: "#ffe600",
                    color: "#333333",
                  },
                }}
              >
                {loadingParse ? <CircularProgress size={24} color="inherit" /> : "Parse"}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleChunk}
                disabled={loadingParse || loadingChunk}
                sx={{
                  backgroundColor: "#333333",
                  color: "#ffffff",
                  padding: "0.75rem",
                  "&:hover": {
                    backgroundColor: "#ffe600",
                    color: "#333333",
                  },
                }}
              >
                {loadingChunk ? <CircularProgress size={24} color="inherit" /> : "Chunk"}
              </Button>
            </Grid>

            {/* Error Message */}
            {errorMessage && (
              <Grid item xs={12}>
                <Typography color="#d32f2f" align="center">
                  {errorMessage}
                </Typography>
              </Grid>
            )}
          </Grid>
        </form>
      </Container>

      {/* Modal to Display Results */}
      <Modal
        title={modalContent === "parse" ? "Parse Results" : "Chunk Results"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button
            key="download"
            variant="contained"
            color="primary"
            href={`http://localhost:5000/uploads/${modalContent === "parse" ? txtFile : excelFile}`}
            download={modalContent === "parse" ? txtFile : excelFile}
            sx={{
              backgroundColor: "#333333",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#ffe600",
                color: "#333333",
              },
            }}
          >
            Download {modalContent === "parse" ? "Text" : "Excel"}
          </Button>,
        ]}
      >
        {modalContent === "parse" ? (
          <>
            <Typography variant="h6" gutterBottom color="#333333">
              Extracted Text:
            </Typography>
            <Box
              sx={{
                maxHeight: "40vh",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                backgroundColor: "#f5f5f5",
                padding: "1rem",
                borderRadius: "4px",
                border: "1px solid #cccccc",
              }}
            >
              {extractedText}
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom color="#333333">
              Chunked Data:
            </Typography>
            {chunkedData.length > 0 ? (
              <Box
                sx={{
                  maxHeight: "60vh",
                  overflowY: "auto",
                  backgroundColor: "#f5f5f5",
                  padding: "1rem",
                  borderRadius: "4px",
                  border: "1px solid #cccccc",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {chunkedData[0].map((header, index) => (
                        <th
                          key={index}
                          style={{
                            border: "1px solid #cccccc",
                            padding: "8px",
                            backgroundColor: "#ffe600",
                            color: "#333333",
                            textAlign: "left",
                          }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chunkedData.slice(1).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            style={{
                              border: "1px solid #cccccc",
                              padding: "8px",
                              color: "#333333",
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            ) : (
              <Typography color="#999999">No data available to display.</Typography>
            )}
          </>
        )}
      </Modal>
    </Box>
  );
}
