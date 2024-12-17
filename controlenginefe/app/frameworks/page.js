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
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";

export default function Tool1Page() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [resultData, setResultData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [processingTime, setProcessingTime] = useState("");
  const [topKValue, setTopKValue] = useState(5);

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
    formData.append("top_k", topKValue);

    try {
      const response = await fetch("http://127.0.0.1:5000/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error occurred while processing files");
      }

      const result = await response.json();
      // result should contain { data: [...], processing_time: "X.XX seconds" }
      setResultData(result.data || []);
      setProcessingTime(result.processing_time || "");
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "http://127.0.0.1:5000/download/framework1_with_results.xlsx";
    link.setAttribute("download", "framework1_with_results.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const StyledInput = styled("input")({
    display: "none",
  });

  const columns = [
    {
      title: "Sr No.",
      dataIndex: "Sr No.",
      key: "Sr No.",
      sorter: (a, b) => (a["Sr No."] || 0) - (b["Sr No."] || 0),
    },
    {
      title: "User Org Domain",
      dataIndex: "User Org Domain",
      key: "User Org Domain",
      filters: [
        ...new Set(resultData.map((item) => item["User Org Domain"] || "")),
      ]
        .filter((domain) => domain)
        .map((domain) => ({
          text: domain,
          value: domain,
        })),
      onFilter: (value, record) => record["User Org Domain"] === value,
      filterSearch: true,
    },
    {
      title: "User Org Sub-Domain",
      dataIndex: "User Org Sub-Domain",
      key: "User Org Sub-Domain",
      filters: [
        ...new Set(resultData.map((item) => item["User Org Sub-Domain"] || "")),
      ]
        .filter((sub) => sub)
        .map((sub) => ({
          text: sub,
          value: sub,
        })),
      onFilter: (value, record) => record["User Org Sub-Domain"] === value,
      filterSearch: true,
    },
    {
      title: "User Org Control Statement",
      dataIndex: "User Org Control Statement",
      key: "User Org Control Statement",
    },
    {
      title: "Matched Control from Service Org Framework",
      dataIndex: "Matched Control from Service Org Framework",
      key: "Matched Control from Service Org Framework",
    },
    {
      title: "Similarity Score",
      dataIndex: "Similarity Score",
      key: "Similarity Score",
      sorter: (a, b) =>
        parseFloat(a["Similarity Score"] || 0) -
        parseFloat(b["Similarity Score"] || 0),
      defaultSortOrder: "descend",
    },
  ];

  const handleTopKIncrease = () => {
    setTopKValue((prev) => Math.min(prev + 1, 100));
  };

  const handleTopKDecrease = () => {
    setTopKValue((prev) => Math.max(prev - 1, 1));
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
            <StyledInput
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
            <StyledInput
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
            <Typography variant="subtitle1">Top-K Value:</Typography>
            <Tooltip
              title={
                <>
                  Higher value shows more potential matches but might include
                  less relevant ones.
                  <br />
                  Lower value focuses on more relevant matches.
                </>
              }
            >
              <InfoIcon sx={{ cursor: "pointer" }} />
            </Tooltip>
            <Button
              variant="contained"
              onClick={handleTopKDecrease}
              sx={{
                backgroundColor: "#333333",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#FFE600",
                  color: "black",
                  transform: "scale(1.05)",
                },
                padding: "0",
              }}
            >
              -
            </Button>
            <Typography variant="h6">{topKValue}</Typography>
            <Button
              variant="contained"
              onClick={handleTopKIncrease}
              sx={{
                backgroundColor: "#333333",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#FFE600",
                  color: "black",
                  transform: "scale(1.05)",
                },
                padding: "0",
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
              Download Excel
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
            rowKey={(record, index) => index}
            scroll={{ y: "calc(100vh - 200px)" }}
            onChange={(pagination, filters, sorter) => {
              console.log("Table parameters:", { filters, sorter });
            }}
          />
        </Modal>
      </Container>
    </Box>
  );
}
