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
import { Modal, Table } from "antd";

export default function Tool1Page() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [resultData, setResultData] = useState([]); // Stores result rows
  const [loading, setLoading] = useState(false); // Indicates processing state
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
  const [processingTime, setProcessingTime] = useState(""); // Time taken for processing
  const [topKValue, setTopKValue] = useState(5); // Value for Top-K matching

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

    const formData = new FormData();
    formData.append("frame1", file1);
    formData.append("frame2", file2);
    formData.append("top_k", topKValue); // Send Top-K value

    try {
      const response = await fetch("http://127.0.0.1:5000/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error occurred while processing files");
      }

      const result = await response.json();

      // Update resultData and processing time
      setResultData(result.data);
      setProcessingTime(result.processing_time);
      setIsModalVisible(true); // Show modal with table
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "http://127.0.0.1:5000/download/framework1_with_results.csv";
    link.setAttribute("download", "framework1_with_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const Input = styled("input")({
    display: "none",
  });

  // Define columns explicitly in the correct order
  const columns = [
    { title: "Domain", dataIndex: "Domain", key: "Domain" },
    { title: "Sub-Domain", dataIndex: "Sub-Domain", key: "Sub-Domain" },
    { title: "Control from User Org Framework", dataIndex: "Control", key: "Control" },
    {
      title: "Controls from Service Org that match",
      dataIndex: "Controls from F2 that match",
      key: "Controls from F2 that match",
    },
    {
      title: "Similarity Scores",
      dataIndex: "Similarity Scores",
      key: "Similarity Scores",
      sorter: (a, b) => parseFloat(a["Similarity Scores"] || 0) - parseFloat(b["Similarity Scores"] || 0),
      defaultSortOrder: "descend",
    },
  ];

  const handleTopKIncrease = () => {
    setTopKValue((prev) => Math.min(prev + 1, 100)); // Max value of 100
  };

  const handleTopKDecrease = () => {
    setTopKValue((prev) => Math.max(prev - 1, 1)); // Min value of 1
  };

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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
              gap: "1rem",
            }}
          >
            <Button
              variant="contained"
              onClick={handleTopKDecrease}
              sx={{
                backgroundColor: "yellow",
                color: "black",
                "&:hover": {
                  backgroundColor: "darkyellow",
                },
              }}
            >
              -
            </Button>
            <Typography variant="h6">{topKValue}</Typography>
            <Button
              variant="contained"
              onClick={handleTopKIncrease}
              sx={{
                backgroundColor: "yellow",
                color: "black",
                "&:hover": {
                  backgroundColor: "darkyellow",
                },
              }}
            >
              +
            </Button>
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

        <Modal
          title={`Results processed in ${processingTime}`}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width="100%"
          height="100%"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 10,
            borderRadius: 0,
            overflow: "hidden",
          }}
          footer={[
            <Button key="download" variant="contained" onClick={handleDownload}>
              Download as CSV
            </Button>,
            <Button
              key="close"
              variant="contained"
              color="error"
              onClick={() => setIsModalVisible(false)}
            >
              Close
            </Button>,
          ]}
        >
          <Table
            dataSource={resultData}
            columns={columns}
            pagination={false}
            rowKey={(record, index) => index} // Ensure unique row keys
            scroll={{ y: "calc(100vh - 200px)" }}
          />
        </Modal>
      </Container>
    </Box>
  );
}