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
import { Modal, Table, Input } from "antd";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
export default function Tool2Page() {
  const [socFile, setSocFile] = useState(null);
  const [frameworkFile, setFrameworkFile] = useState(null);
  const [startPage, setStartPage] = useState("");
  const [endPage, setEndPage] = useState("");
  const [controlId, setControlId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [processingTime, setProcessingTime] = useState("");
  const [resultData, setResultData] = useState([]);

  // Dummy data for testing
  const dummyData = [
    {
      "Control ID": "CC 1.1",
      "Control Description": "The entity defines and communicates its security requirements for vendors and business partners.",
      "Evidence Found": "Section 3.2 - Vendor Management: The organization maintains a comprehensive vendor management program that includes security requirements...",
      "Page Number": 15,
      "Confidence Score": 0.89
    },
    {
      "Control ID": "CC 2.3",
      "Control Description": "Security policies and procedures are established and maintained.",
      "Evidence Found": "Section 4.1 - Security Policies: Company XYZ maintains documented security policies that are reviewed annually...",
      "Page Number": 22,
      "Confidence Score": 0.95
    },
    {
      "Control ID": "CC 3.1",
      "Control Description": "Access to systems and data is restricted to authorized personnel.",
      "Evidence Found": "Section 5.3 - Access Control: Access to systems and data is restricted through role-based access controls...",
      "Page Number": 30,
      "Confidence Score": 0.92
    }
  ];

  const columns = [
    {
      title: "Control ID",
      dataIndex: "Control ID",
      key: "Control ID",
      sorter: (a, b) => a["Control ID"].localeCompare(b["Control ID"])
    },
    {
      title: "Control Description",
      dataIndex: "Control Description",
      key: "Control Description"
    },
    {
      title: "Evidence Found",
      dataIndex: "Evidence Found",
      key: "Evidence Found"
    },
    {
      title: "Page Number",
      dataIndex: "Page Number",
      key: "Page Number",
      sorter: (a, b) => a["Page Number"] - b["Page Number"]
    },
    {
      title: "Confidence Score",
      dataIndex: "Confidence Score",
      key: "Confidence Score",
      sorter: (a, b) => a["Confidence Score"] - b["Confidence Score"],
      render: (score) => `${(score * 100).toFixed(1)}%`
    }
  ];

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleDeleteFile = (setFile) => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!socFile || !frameworkFile) {
      alert("Please upload both files");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("soc", socFile);
    formData.append("framework", frameworkFile);
    formData.append("startPage", startPage);
    formData.append("endPage", endPage);
    formData.append("controlId", controlId);

    try {
      const response = await fetch("http://127.0.0.1:5000/process-rag", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error occurred while processing files");
      }

      const result = await response.json();
      console.log(result);
      // Handle the result as needed
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }

    // Simulate API call delay
    setTimeout(() => {
      setResultData(dummyData);
      setProcessingTime("2.3 seconds");
      setIsModalVisible(true);
      setLoading(false);
    }, 2000);
  };

  const StyledInput = styled("input")({
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
          SOC Mapper
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* SOC Upload */}
          <label htmlFor="socFile">
            <StyledInput
              accept=".pdf"
              id="socFile"
              type="file"
              onChange={(e) => handleFileChange(e, setSocFile)}
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
              Upload SOC
            </Button>
          </label>
          {socFile && (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body2">{socFile.name}</Typography>
              <IconButton onClick={() => handleDeleteFile(setSocFile)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
   
          {/* Page Inputs */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ mr: 1 }}>Page Numbers</Typography>
              <Tooltip
                title={
                  <>
                   Kindly input the start and end page of the table content in the SOC Report to be mapped.
                    
                  </>
                }
              >
                <InfoIcon sx={{ cursor: "pointer" }} />
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              <Input
                placeholder="Start Page"
                type="number"
                value={startPage}
                onChange={(e) => setStartPage(e.target.value)}
                style={{ width: '45%' }}
              />
              <Input
                placeholder="End Page"
                type="number"
                value={endPage}
                onChange={(e) => setEndPage(e.target.value)}
                style={{ width: '45%' }}
              />
            </Box>
          </Box>

          {/* Control ID Input */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Input
                placeholder="Control ID (Eg. CC 1.2)"
                value={controlId}
                onChange={(e) => setControlId(e.target.value)}
                style={{ width: '100%' }}
              />
              <Tooltip
                title={
                  <>
                    Kindly provide any control ID in the Section 4 of the SOC2 Report to be mapped.
                  </>
                }
              >
                <InfoIcon sx={{ cursor: "pointer" }} />
              </Tooltip>
            </Box>
          </Box>

          {/* Framework Upload */}
          <label htmlFor="frameworkFile">
            <StyledInput
              accept=".xlsx,.csv"
              id="frameworkFile"
              type="file"
              onChange={(e) => handleFileChange(e, setFrameworkFile)}
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
              Upload Framework
            </Button>
          </label>
          {frameworkFile && (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body2">{frameworkFile.name}</Typography>
              <IconButton onClick={() => handleDeleteFile(setFrameworkFile)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )}

          {/* Process Button */}
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
            {loading ? <CircularProgress size={24} /> : "Process"}
          </Button>
        </form>
      </Container>
      <Modal
        title={`Results processed in ${processingTime}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width="100%"
        style={{
          top: 20,
          maxWidth: '90vw',
          margin: '0 auto'
        }}
        footer={[
          <Button
            key="close"
            variant="contained"
            color="error"
            onClick={() => setIsModalVisible(false)}
          >
            Close
          </Button>
        ]}
      >
        <Table
          dataSource={resultData}
          columns={columns}
          pagination={false}
          rowKey={(record, index) => index}
          scroll={{ y: 'calc(100vh - 250px)', x: true }}
        />
      </Modal>
    </Box>
  );
}