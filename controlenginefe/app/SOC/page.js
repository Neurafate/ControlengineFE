"use client";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { useState } from "react";
=======

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
>>>>>>> Stashed changes
=======

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
>>>>>>> Stashed changes
import {
  Button,
  Container,
  CircularProgress,
  Typography,
  Box,
  IconButton,
<<<<<<< Updated upstream
=======
  LinearProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  Tooltip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
} from "@mui/material";
import { styled } from "@mui/system";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // For the reopen modal button
import { Modal, Table, Input } from "antd";
import * as XLSX from "xlsx";

// ------------------- Styled Components -------------------
const StyledInput = styled("input")({
  display: "none",
});

const YellowRadio = styled(Radio)({
  color: "#FFD700",
  "&.Mui-checked": {
    color: "#FFD700",
  },
});
>>>>>>> Stashed changes

=======
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // For the reopen modal button
import { Modal, Table, Input } from "antd";
import * as XLSX from "xlsx";

// ------------------- Styled Components -------------------
const StyledInput = styled("input")({
  display: "none",
});

const YellowRadio = styled(Radio)({
  color: "#FFD700",
  "&.Mui-checked": {
    color: "#FFD700",
  },
});

>>>>>>> Stashed changes
// ------------------- Reusable Components -------------------
/**
 * FileUpload Component
 * Displays only an upload icon.
 * Clicking the icon opens the file dialog.
 * Shows file name and a delete icon once a file is chosen.
 */
const FileUpload = ({ accept, file, setFile }) => {
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDelete = () => {
    setFile(null);
  };

  return (
    <Box>
      <label>
        <StyledInput accept={accept} type="file" onChange={handleFileChange} required />
        <IconButton
          color="primary"
          component="span"
          sx={{
            border: "1px solid #333333",
            borderRadius: "4px",
            padding: "8px",
            "&:hover": {
              backgroundColor: "#f7f7f7",
            },
          }}
        >
          <UploadIcon />
        </IconButton>
      </label>

      {/* If a file is selected, display its name and a delete icon */}
      {file && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            mt: 1,
          }}
        >
          <Typography variant="body2" sx={{ mr: 1 }}>
            {file.name}
          </Typography>
          <IconButton onClick={handleDelete} size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

/**
 * ModelSelection Component
 * Renders radio buttons for selecting the AI model.
 */
const ModelSelection = ({ modelName, setModelName }) => (
  <Box>
    <RadioGroup
      aria-label="model-selection"
      value={modelName}
      onChange={(e) => setModelName(e.target.value)}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 1.5,
      }}
    >
      <FormControlLabel value="llama3.1" control={<YellowRadio />} label="Llama 3.1" />
      <FormControlLabel value="phi4" control={<YellowRadio />} label="Phi 4" />
    </RadioGroup>
  </Box>
);

/**
 * HowItWorks Component
 * Provides a brief explanation of the SOC Engine's workflow.
 */
const HowItWorks = () => (
  <Box>
    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
      How It Works
    </Typography>
    <Typography variant="body2" sx={{ mb: 2 }}>
      The SOC Engine processes your SOC 2 Type 2 report by mapping it against your internal controls framework. Here's how it works:
    </Typography>
    <ol>
      <li>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Upload Documents:</strong> Please upload your SOC2 Type2 Audit Report in PDF Format.
        </Typography>
      </li>
      <li>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Enter Page Numbers:</strong> Please specify the start and end page numbers of Section IV of the SOC2 Type2 Report.
        </Typography>
      </li>
      <li>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Specify Control ID:</strong> Please enter an example Control ID from the Section IV of your SOC2 Type2 Report.
        </Typography>
      </li>
      <li>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Select AI Model:</strong> Choose between Llama 3.1 for faster performance or Phi 4 for more accurate and nuanced responses.
        </Typography>
      </li>
      <li>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Click Process</strong> Initiate the processing, monitor progress, and review the mapping results upon completion.
        </Typography>
      </li>
    </ol>
  </Box>
);

// ------------------- Main Component -------------------
export default function Tool2Page() {
  // ----------------- State Variables -----------------
  const [socFile, setSocFile] = useState(null);
  const [frameworkFile, setFrameworkFile] = useState(null);

  // Page fields
  const [startPage, setStartPage] = useState("");
  const [endPage, setEndPage] = useState("");

  // Control ID field
  const [controlId, setControlId] = useState("");

  // Loading, Progress, and Task Tracking
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [processingTime, setProcessingTime] = useState("");

  // ----------------- New State Variables -----------------
  const [startTime, setStartTime] = useState(null); // To track when the task starts
  const [totalTime, setTotalTime] = useState(null); // To store total time taken

  // SSE & Data
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(true); // For the overlay
  const [resultData, setResultData] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);

  // AI Model
  const [modelName, setModelName] = useState("llama3.1");

  // SSE connection reference
  const eventSourceRef = useRef(null);

  // ------------------- Helper Functions -------------------
  const formatEta = useCallback((seconds) => {
    if (seconds === null || seconds === undefined || isNaN(seconds)) return "Calculating...";
    if (seconds <= 0) return "Completed";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60); // Ensures secs is an integer
    return `${mins}m ${secs}s`;
  }, []);

  // Columns for AntD Table
  const columns = useMemo(() => {
    if (resultData.length === 0) return [];
    return Object.keys(resultData[0]).map((key) => ({
      title: key,
      dataIndex: key,
      key,
      sorter: (a, b) => {
        if (typeof a[key] === "number" && typeof b[key] === "number") {
          return a[key] - b[key];
        } else if (typeof a[key] === "string" && typeof b[key] === "string") {
          return a[key].localeCompare(b[key]);
        }
        return 0;
      },
      render: (text) => text || "",
    }));
  }, [resultData]);

  // ------------------- Form Submission -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!socFile || !frameworkFile) {
      alert("Please upload both files.");
      return;
    }

    // Normalize control IDs
    const normalizedControlId = controlId
      .split(",")
      .map((cid) => cid.trim())
      .filter((cid) => cid.length > 0)
      .join(",");

    if (!normalizedControlId) {
      alert("Please provide at least one valid Control ID.");
      return;
    }

    // Reset states before sending the request
    setLoading(true);
<<<<<<< Updated upstream
=======
    setProgress(0);
    setEta(null);
    setTaskId(null);
    setResultData([]);
    setDownloadUrl(null);
    setProcessingTime("Initializing...");
    setTotalTime(null); // Reset total time
    setStartTime(Date.now()); // Set the start time
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

    // Build form data
    const formData = new FormData();
<<<<<<< Updated upstream
    formData.append("soc", socFile);
    formData.append("framework", frameworkFile);
    formData.append("startPage", startPage);
    formData.append("endPage", endPage);
    formData.append("controlId", controlId);

    try {
      const response = await fetch("http://127.0.0.1:5000/process-rag", {
=======
    formData.append("pdf_file", socFile);
    formData.append("excel_file", frameworkFile);
    formData.append("start_page", startPage);
    formData.append("end_page", endPage);
    formData.append("control_id", normalizedControlId);
    formData.append("model_name", modelName);

    try {
      // Send POST request
      const response = await fetch("http://127.0.0.1:5000/process_all", {
>>>>>>> Stashed changes
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
<<<<<<< Updated upstream
        throw new Error("Error occurred while processing files");
      }

      const result = await response.json();
      console.log(result);
      // Handle the result as needed
=======
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        } else {
          alert("Error occurred while processing files.");
        }
        setLoading(false);
        setStartTime(null); // Reset start time on error
        return;
      }

      // Get the task ID for SSE updates
      const data = await response.json();
      const receivedTaskId = data.task_id;
      setTaskId(receivedTaskId);
      setProcessingTime("Task initiated. Waiting for progress updates...");
>>>>>>> Stashed changes
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setStartTime(null); // Reset start time on error
    }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
    // Simulate API call delay
    setTimeout(() => {
      setResultData(dummyData);
      setProcessingTime("2.3 seconds");
      setIsModalVisible(true);
=======
=======
>>>>>>> Stashed changes
  // ------------------- SSE for Progress Updates -------------------
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
            setStartTime(null); // Reset start time on error
            eventSourceRef.current.close();
          } else if (data.cancelled) {
            alert(`Task was cancelled.`);
            setLoading(false);
            setProgress(0);
            setEta(null);
            setStartTime(null); // Reset start time on cancel
            eventSourceRef.current.close();
          } else {
            setProgress(Number(data.progress.toFixed(2)));
            setProcessingTime(data.status);

            if (data.eta !== null && data.eta !== undefined && !isNaN(data.eta)) {
              setEta(data.eta);
            } else {
              setEta(null);
            }

            if (data.download_url) {
              setDownloadUrl(data.download_url);
              parseXlsxFile(data.download_url);
              setLoading(false);

              // Calculate total time taken
              if (startTime) {
                const endTime = Date.now();
                const durationInSeconds = Math.floor((endTime - startTime) / 1000);
                setTotalTime(durationInSeconds);
              }

              eventSourceRef.current.close();
            }
          }
        } catch (err) {
          console.error("Error parsing SSE data:", err);
          alert("An error occurred while receiving progress updates.");
          setLoading(false);
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
          }
        }
      };

      eventSourceRef.current.onerror = (err) => {
        console.error("EventSource failed:", err);
        alert("An error occurred while receiving progress updates.");
        setLoading(false);
        setProgress(100);
        setEta(null);
        setStartTime(null); // Reset start time on error
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }
      };

      return () => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }
      };
    }
  }, [taskId, formatEta, startTime]);

  // ------------------- Parse Returned .xlsx File -------------------
  const parseXlsxFile = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch the file: ${response.statusText}`);
      }
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });

      // Possible sheets to display
      const possibleSheetNames = ["Control Assessment", "Executive Summary"];

      let targetSheetName = null;
      for (let name of possibleSheetNames) {
        const sheet = workbook.Sheets[name];
        if (sheet && XLSX.utils.sheet_to_json(sheet).length > 0) {
          targetSheetName = name;
          break;
        }
      }

      // Fallback: first sheet with data
      if (!targetSheetName) {
        for (let name of workbook.SheetNames) {
          const sheet = workbook.Sheets[name];
          if (sheet && XLSX.utils.sheet_to_json(sheet).length > 0) {
            targetSheetName = name;
            break;
          }
        }
      }

      if (!targetSheetName) {
        alert(
          `No sheets with data found in the Excel file. Available sheets: ${workbook.SheetNames.join(
            ", "
          )}`
        );
        setLoading(false);
        return;
      }

      // Convert sheet to JSON
      const worksheet = workbook.Sheets[targetSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setResultData(jsonData);
      setIsModalVisible(true);
      setProcessingTime("Task completed successfully.");
    } catch (error) {
      console.error("Excel parse error:", error);
      alert(
        "Task finished, but could not parse the returned .xlsx. Please open it in Excel."
      );
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      setLoading(false);
    }, 2000);
  };

<<<<<<< Updated upstream
  const StyledInput = styled("input")({
    display: "none",
  });
=======
  // ------------------- Handle Cancel -------------------
  const handleCancel = async () => {
    if (!taskId) return; // Ensure we have a valid taskId

    try {
      const response = await fetch(`http://127.0.0.1:5000/cancel_task/${taskId}`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error cancelling task: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error cancelling the task:", error);
      alert("An error occurred while cancelling the task.");
    }

    // Locally reset state on the frontend
    setLoading(false);
    setProgress(0);
    setEta(null);
    setTaskId(null);
    setProcessingTime("Task cancelled.");
    setDownloadUrl(null);
    setResultData([]);
    setTotalTime(null); // Reset total time on cancel
    setStartTime(null); // Reset start time on cancel
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
  };
>>>>>>> Stashed changes

<<<<<<< Updated upstream
=======
  // ------------------- Handle Cancel -------------------
  const handleCancel = async () => {
    if (!taskId) return; // Ensure we have a valid taskId

    try {
      const response = await fetch(`http://127.0.0.1:5000/cancel_task/${taskId}`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error cancelling task: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error cancelling the task:", error);
      alert("An error occurred while cancelling the task.");
    }

    // Locally reset state on the frontend
    setLoading(false);
    setProgress(0);
    setEta(null);
    setTaskId(null);
    setProcessingTime("Task cancelled.");
    setDownloadUrl(null);
    setResultData([]);
    setTotalTime(null); // Reset total time on cancel
    setStartTime(null); // Reset start time on cancel
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
  };

>>>>>>> Stashed changes
  // ------------------- Render -------------------
  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative", // To position the background and content layers
        overflow: "hidden",
      }}
    >
      {/* Background Layer */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url('/BackgroundSE.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.3, // Set the opacity of the background image
          zIndex: 1, // Ensure the background is behind the content
        }}
      />

      {/* Content Layer */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2, // Ensure the content is above the background
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingY: "2rem",
        }}
      >
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
        <Container
>>>>>>> Stashed changes
=======
        <Container
>>>>>>> Stashed changes
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.95)", // Slightly transparent to blend with background
              marginTop: "15rem", // Add top margin to avoid overlapping with navbar
              paddingTop: "3rem",
              paddingLeft: "3rem",
              paddingRight: "3rem",
              paddingBottom: "3rem",
              borderRadius: "12px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              maxWidth: "900px",
            }}
        >
          {/* Heading Box */}
          <Box
            sx={{
              backgroundColor: "#FFD700",
              padding: "1.5rem",
              borderRadius: "8px",
              mb: 2,
              textAlign: "center",
            }}
          >
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
=======
>>>>>>> Stashed changes
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#333333" }}>
              SOC Engine
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* Upload SOC2 Type2 Report */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "left" }}>
                  Upload SOC2 Type2 Report
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FileUpload accept=".pdf" file={socFile} setFile={setSocFile} />
              </Grid>

              {/* Start Page */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "left" }}>
                  Start Page
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  placeholder="Start Page"
                  type="number"
                  value={startPage}
                  onChange={(e) => setStartPage(e.target.value)}
                  required
                  inputProps={{ min: 1 }}
                  style={{
                    width: "100%",
                    border: "1px solid #333333",
                    borderRadius: "4px",
                    padding: "8px",
                  }}
                />
              </Grid>

              {/* End Page */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "left" }}>
                  End Page
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  placeholder="End Page"
                  type="number"
                  value={endPage}
                  onChange={(e) => setEndPage(e.target.value)}
                  required
                  inputProps={{ min: 1 }}
                  style={{
                    width: "100%",
                    border: "1px solid #333333",
                    borderRadius: "4px",
                    padding: "8px",
                  }}
                />
              </Grid>

              {/* Control ID */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "left" }}>
                  Control ID
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Input
                    placeholder='e.g., "1.0, A2., CC 2.1."'
                    value={controlId}
                    onChange={(e) => setControlId(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      border: "1px solid #333333",
                      borderRadius: "4px",
                      padding: "8px",
                    }}
                  />
                </Box>
              </Grid>

              {/* Choose AI Model */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "left" }}>
                  Choose AI Model
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ModelSelection modelName={modelName} setModelName={setModelName} />
              </Grid>

              {/* Upload Framework */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "left" }}>
                  Upload Framework
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FileUpload accept=".xlsx, .xls" file={frameworkFile} setFile={setFrameworkFile} />
              </Grid>

              {/* Help Button at the Bottom of the Left Column */}
              <Grid item xs={12} sm={6}>
                {/* Empty to align the help button at the bottom */}
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                >
                  <Tooltip title="Need help? Reopen the information overlay.">
                    <IconButton
                      onClick={() => setIsInfoModalOpen(true)}
                      sx={{
                        backgroundColor: "#FFD700",
                        color: "#333333",
                        "&:hover": {
                          backgroundColor: "#f7f7f7",
                        },
                        alignSelf: "flex-start",
                      }}
                    >
                      <HelpOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>

              {/* Process and Cancel Buttons */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      flex: 1,
                      padding: "0.75rem",
                      backgroundColor: "#333333",
                      color: "#fff",
                      textTransform: "none",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "#000000",
                        color: "#333333",
                        transform: "scale(1.02)",
                      },
                    }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Process"}
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      flex: 1,
                      padding: "0.75rem",
                      backgroundColor: "#ff4d4f",
                      color: "#fff",
                      textTransform: "none",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "#ff7875",
                        transform: "scale(1.02)",
                      },
                    }}
                    onClick={handleCancel}
                    disabled={!loading}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>

              {/* ---------------- New Reopen Output Modal Button ---------------- */}
              {resultData.length > 0 && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    onClick={() => setIsModalVisible(true)}
                    sx={{
                      padding: "0.75rem",
                      backgroundColor: "#FFD700",
                      color: "#333333",
                      textTransform: "none",
                      fontWeight: "bold",
                      borderColor: "#FFD700",
                      "&:hover": {
                        backgroundColor: "#f7f7f7",
                        borderColor: "#FFD700",
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    Reopen Output Modal
                  </Button>
                </Grid>
              )}
            </Grid>
          </form>

          {/* Progress & Status */}
          {taskId && (
            <Box sx={{ mt: 4, textAlign: "left" }}>
              <Typography variant="body1" gutterBottom sx={{ color: "#333333" }}>
                Status: {processingTime}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: "15px",
                  borderRadius: "5px",
                  backgroundColor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#FFD700",
                  },
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Progress: {progress}%
                </Typography>
                {eta !== null && (
                  <Typography variant="body2" color="textSecondary">
                    ETA: {formatEta(eta)}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Container>

        {/* Modal for Purpose and How It Works */}
        <Dialog
          open={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle sx={{ backgroundColor: "#FFD700", color: "#333333", fontWeight: "bold" }}>
            Welcome to SOC Engine
          </DialogTitle>
          <DialogContent dividers>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Purpose
              </Typography>
              <Typography variant="body2" sx={{ color: "#555555", mb: 4 }}>
                The SOC Engine baselines any SOC 2 Type 2 report against the user organization's internal
                controls framework. It provides the overall compliance and a mapping of Service Organization
                Controls (from the SOC 2 Type 2 report) with the corresponding User Organization Controls
                (from the Internal Controls Framework).
              </Typography>
              <HowItWorks />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIsInfoModalOpen(false)}
              variant="contained"
              sx={{
                backgroundColor: "#333333",
                color: "#fff",
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#FFD700",
                  color: "#333333",
                },
              }}
            >
              I Understand
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reopen Info Modal Button */}
        <IconButton
          onClick={() => setIsInfoModalOpen(true)}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            backgroundColor: "#FFD700",
            color: "#333333",
            "&:hover": {
              backgroundColor: "#f7f7f7",
            },
          }}
        >
          <HelpOutlineIcon />
        </IconButton>

        {/* Modal to display "Control Assessment" Sheet */}
        <Modal
          title="Mapping Process Complete"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width="50%" // Adjust width as needed
          style={{
            top: 50, // Adjust top positioning
            maxWidth: "50vw", // Ensure responsive width
            maxHeight: "80vh", // Set maximum height to 80% of the viewport height
            overflowY: "auto", // Enable vertical scrolling if content overflows
            margin: "0 auto", // Center the modal horizontally
          }}
          footer={[
            downloadUrl && (
              <Button
                key="download"
                variant="contained"
                color="primary"
                component="a"
                href={downloadUrl}
                download="Final_Control_Status_with_Summary.xlsx"
                sx={{ mr: 2, textTransform: "none" }}
              >
                Download Excel
              </Button>
            ),
            <Button
              key="close"
              variant="contained"
              color="error"
              sx={{ textTransform: "none" }}
              onClick={() => setIsModalVisible(false)}
            >
              Close
            </Button>,
          ]}
        >
          <div style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: "8px" }}>
            <Typography variant="body2" sx={{ mb: 3, color: "#555555" }}>
              Below is a preview of the "Control Assessment" sheet from your .xlsx file. To view the detailed
              Workbook, please download the file and open it in Excel.
            </Typography>
            {resultData.length > 0 ? (
              <>
                {/* Display Total Time Taken */}
                {totalTime !== null && (
                  <Typography
                    variant="body2"
                    sx={{ mb: 2, color: "#333333", fontWeight: "bold" }}
                  >
                    Total Time Taken: {Math.floor(totalTime / 60)}m {totalTime % 60}s
                  </Typography>
                )}
                <Table
                  dataSource={resultData}
                  columns={columns}
                  pagination={{ pageSize: 10 }}
                  rowKey={(record, index) => index}
                  scroll={{ y: "calc(70vh - 150px)", x: "100%" }} // Adjust scroll height for a smaller modal
                  bordered
                />
              </>
            ) : (
              <Typography variant="body2" sx={{ color: "#777777" }}>
                No data available to display.
              </Typography>
            )}
          </div>
        </Modal>

      </Box>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    </Box>
  );
}