// page.js
"use client";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  Container,
  CircularProgress,
  Typography,
  Box,
  IconButton,
  LinearProgress,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import { Modal, Table, Input } from "antd";
import * as XLSX from "xlsx"; // For parsing Excel files

const StyledInput = styled("input")({
  display: "none",
});

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
  const [downloadUrl, setDownloadUrl] = useState(null); 
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(null); // ETA in seconds
  const [taskId, setTaskId] = useState(null);
  const eventSourceRef = useRef(null);

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
    setProgress(0);
    setEta(null);
    setTaskId(null);
    setResultData([]);
    setDownloadUrl(null);
    setProcessingTime("Initializing...");

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

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        } else {
          alert("Error occurred while processing files (Non-JSON).");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      const receivedTaskId = data.task_id;
      setTaskId(receivedTaskId);
      setProcessingTime("Task initiated. Waiting for progress updates...");
    } catch (error) {
      console.error("Fetch error:", error);
      alert("An error occurred while processing files.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      eventSourceRef.current = new EventSource(`http://127.0.0.1:5000/progress/${taskId}`);

      eventSourceRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.error) {
            alert(`Error: ${data.error}`);
            setLoading(false);
            setProgress(100);
            setEta(null);
            eventSourceRef.current.close();
          } else {
            setProgress(Number(data.progress.toFixed(2)));
            setProcessingTime(data.status);

            if (data.eta !== null && data.eta !== undefined && !isNaN(data.eta)) {
              setEta(data.eta);
            } else {
              setEta(null);
            }

            if (data.progress >= 100) {
              if (data.download_url) {
                setDownloadUrl(data.download_url);
                fetchFileAndParse(data.download_url);
              } else {
                setLoading(false);
              }
              eventSourceRef.current.close();
            }
          }
        } catch (err) {
          console.error("Error parsing SSE data:", err);
        }
      };

      eventSourceRef.current.onerror = (err) => {
        console.error("EventSource failed:", err);
        alert("An error occurred while receiving progress updates.");
        setLoading(false);
        setProgress(100);
        setEta(null);
        if (eventSourceRef.current) eventSourceRef.current.close();
      };

      return () => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }
      };
    }
  }, [taskId]);

  const fetchFileAndParse = async (url) => {
    try {
      const excelResponse = await fetch(url);
      const blob = await excelResponse.blob();
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
          setIsModalVisible(true);
          setLoading(false);
          setProcessingTime("Task completed successfully.");
        } catch (parseError) {
          console.error("Excel parse error:", parseError);
          alert("Failed to parse the returned file as Excel.");
          setLoading(false);
        }
      };
      reader.readAsArrayBuffer(blob);
    } catch (err) {
      console.error("Error fetching final Excel file:", err);
      alert("Failed to download the final Excel file.");
      setLoading(false);
    }
  };

  const columns =
    resultData.length > 0
      ? Object.keys(resultData[0]).map((key) => ({
          title: key,
          dataIndex: key,
          key: key,
          sorter: (a, b) => {
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
          render: (text) => text || "",
        }))
      : [];

  const formatEta = (seconds) => {
    if (seconds === null || seconds === undefined) return "Calculating...";
    if (isNaN(seconds)) return "Calculating...";
    if (seconds <= 0) return "Completed";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
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
          SOC Mapper
        </Typography>
        <form onSubmit={handleSubmit}>
          <label htmlFor="socFile">
            <StyledInput
              accept=".pdf"
              id="socFile"
              type="file"
              onChange={(e) => handleFileChange(e, setSocFile)}
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

          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <Typography variant="body2" sx={{ mr: 1 }}>
                Page Numbers
              </Typography>
              <Tooltip
                title="Kindly input the start and end page of the table content in the SOC Report to be mapped."
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
                required
                min={1}
              />
              <Input
                placeholder="End Page"
                type="number"
                value={endPage}
                onChange={(e) => setEndPage(e.target.value)}
                style={{ width: "45%" }}
                required
                min={1}
              />
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Input
                placeholder="Control ID (Eg. CC 1.2)"
                value={controlId}
                onChange={(e) => setControlId(e.target.value)}
                style={{ width: "100%" }}
                required
              />
              <Tooltip title="Provide any control ID from the SOC2 Report.">
                <InfoIcon sx={{ cursor: "pointer" }} />
              </Tooltip>
            </Box>
          </Box>

          <label htmlFor="frameworkFile">
            <StyledInput
              accept=".xlsx,.csv"
              id="frameworkFile"
              type="file"
              onChange={(e) => handleFileChange(e, setFrameworkFile)}
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
              Upload Framework
            </Button>
          </label>
          {frameworkFile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="body2">{frameworkFile.name}</Typography>
              <IconButton onClick={() => handleDeleteFile(setFrameworkFile)}>
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
            {loading ? <CircularProgress size={24} color="inherit" /> : "Process"}
          </Button>
        </form>

        {taskId && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="body1" gutterBottom>
              Status: {processingTime}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: '15px',
                borderRadius: '5px',
                backgroundColor: '#555555',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#FFD700',
                },
              }}
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Progress: {progress}%
            </Typography>
            {eta !== null && (
              <Typography variant="body2" color="textSecondary">
                ETA: {formatEta(eta)}
              </Typography>
            )}
          </Box>
        )}
      </Container>

      <Modal
        title={`Processing Complete`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width="100%"
        style={{
          top: 20,
          maxWidth: "90vw",
          margin: "0 auto",
        }}
        footer={[
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
