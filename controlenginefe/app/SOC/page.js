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
import { Modal, Table, Input, Tooltip as AntTooltip } from "antd";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import * as XLSX from "xlsx"; // For parsing Excel files

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
  const [downloadUrl, setDownloadUrl] = useState(null); // Store Excel download URL

  const StyledInput = styled("input")({
    display: "none",
  });

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
    formData.append("pdf_file", socFile);
    formData.append("excel_file", frameworkFile);
    formData.append("start_page", startPage);
    formData.append("end_page", endPage);
    formData.append("control_id", controlId);

    try {
      const response = await fetch("http://127.0.0.1:5000/process_all", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      console.log("Response Content-Type:", contentType);

      if (!response.ok) {
        // If response is not OK, it might be JSON error or something else
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        } else {
          alert("Error occurred while processing files (Non-JSON).");
        }
        return;
      }

      // Response is OK. Check if it's Excel
      if (
        contentType &&
        contentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      ) {
        const blob = await response.blob();

        // Create a download URL for the blob
        const fileUrl = URL.createObjectURL(blob);
        setDownloadUrl(fileUrl);

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            setResultData(jsonData);
            setProcessingTime("Processing completed successfully");
            setIsModalVisible(true);
          } catch (parseError) {
            console.error("Excel parse error:", parseError);
            alert("Failed to parse the returned file as Excel.");
          }
        };
        reader.readAsArrayBuffer(blob);
      } else if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      } else {
        console.log("Unexpected content type:", contentType);
        alert("Unexpected response format, not Excel or JSON.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("An error occurred while processing files.");
    } finally {
      setLoading(false);
    }
  };

  // Dynamically generate columns based on the returned data keys
  const columns =
    resultData.length > 0
      ? Object.keys(resultData[0]).map((key) => ({
          title: key,
          dataIndex: key,
          key: key,
          sorter: (a, b) => {
            // Attempt a basic sort
            if (typeof a[key] === "number" && typeof b[key] === "number") {
              return a[key] - b[key];
            } else if (
              typeof a[key] === "string" &&
              typeof b[key] === "string"
            ) {
              return a[key].localeCompare(b[key]);
            }
            return 0;
          },
          render: (text) => text || "", // Ensure empty strings don't cause issues
        }))
      : [];

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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="body2">{socFile.name}</Typography>
              <IconButton onClick={() => handleDeleteFile(setSocFile)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )}

          {/* Page Inputs */}
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}
            >
              <Typography variant="body2" sx={{ mr: 1 }}>
                Page Numbers
              </Typography>
              <Tooltip
                title={
                  <>
                    Kindly input the start and end page of the table content in the SOC Report
                    to be mapped.
                  </>
                }
              >
                <InfoIcon sx={{ cursor: "pointer" }} />
              </Tooltip>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
              <Input
                placeholder="Start Page"
                type="number"
                value={startPage}
                onChange={(e) => setStartPage(e.target.value)}
                style={{ width: "45%" }}
              />
              <Input
                placeholder="End Page"
                type="number"
                value={endPage}
                onChange={(e) => setEndPage(e.target.value)}
                style={{ width: "45%" }}
              />
            </Box>
          </Box>

          {/* Control ID Input */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Input
                placeholder="Control ID (Eg. CC 1.2)"
                value={controlId}
                onChange={(e) => setControlId(e.target.value)}
                style={{ width: "100%" }}
              />
              <AntTooltip title="Provide any control ID from the SOC2 Report. The system will generate the regex automatically.">
                <InfoIcon sx={{ cursor: "pointer" }} />
              </AntTooltip>
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
            <Box
              sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}
            >
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

      {/* Modal with AntD Table */}
      <Modal
        title={`Results processed in ${processingTime}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width="100%"
        style={{
          top: 20,
          maxWidth: "90vw",
          margin: "0 auto",
        }}
        footer={[
          // Download button
          downloadUrl && (
            <Button
              key="download"
              variant="contained"
              color="primary"
              component="a"
              href={downloadUrl}
              download="Final_Control_Status.xlsx"
              sx={{ mr: 2 }}
            >
              Download Excel
            </Button>
          ),
          <Button key="close" variant="contained" color="error" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <Table
          dataSource={resultData}
          columns={columns}
          pagination={false}
          rowKey={(record, index) => index}
          scroll={{ y: "calc(100vh - 250px)", x: true }}
        />
      </Modal>
    </Box>
  );
}
