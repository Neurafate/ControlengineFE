// "use client";
// import { useState } from "react";
// import {
//   Button,
//   Container,
//   CircularProgress,
//   Typography,
//   Box,
//   IconButton,
// } from "@mui/material";
// import UploadIcon from "@mui/icons-material/Upload";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { styled } from "@mui/system";
// import { Modal, Table } from "antd";
// import InfoIcon from "@mui/icons-material/Info";
// import Tooltip from "@mui/material/Tooltip";

// export default function Tool1Page() {
//   const [file1, setFile1] = useState(null);
//   const [file2, setFile2] = useState(null);
//   const [resultData, setResultData] = useState([]); // Stores result rows
//   const [loading, setLoading] = useState(false); // Indicates processing state
//   const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
//   const [processingTime, setProcessingTime] = useState(""); // Time taken for processing
//   const [topKValue, setTopKValue] = useState(5); // Value for Top-K matching

//   const handleFileChange = (e, setFile) => {
//     setFile(e.target.files[0]);
//   };

//   const handleDeleteFile = (setFile) => {
//     setFile(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file1 || !file2) {
//       alert("Please upload both files");
//       return;
//     }

//     setLoading(true);

//     const formData = new FormData();
//     formData.append("frame1", file1);
//     formData.append("frame2", file2);
//     formData.append("top_k", topKValue); // Send Top-K value

//     try {
//       const response = await fetch("http://127.0.0.1:5000/process", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Error occurred while processing files");
//       }

//       const result = await response.json();

//       // Update resultData and processing time
//       setResultData(result.data);
//       setProcessingTime(result.processing_time);
//       setIsModalVisible(true); // Show modal with table
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = () => {
//     const link = document.createElement("a");
//     link.href = "http://127.0.0.1:5000/download/framework1_with_results.csv";
//     link.setAttribute("download", "framework1_with_results.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const Input = styled("input")({
//     display: "none",
//   });

//   // Define columns explicitly in the correct order
//   const columns = [
//     { title: "Domain", dataIndex: "Domain", key: "Domain" },
//     { title: "Sub-Domain", dataIndex: "Sub-Domain", key: "Sub-Domain" },
//     {
//       title: "Control from User Org Framework",
//       dataIndex: "Control",
//       key: "Control",
//     },
//     {
//       title: "Controls from Service Org that match",
//       dataIndex: "Controls from F2 that match",
//       key: "Controls from F2 that match",
//     },
//     {
//       title: "Similarity Scores",
//       dataIndex: "Similarity Scores",
//       key: "Similarity Scores",
//       sorter: (a, b) =>
//         parseFloat(a["Similarity Scores"] || 0) -
//         parseFloat(b["Similarity Scores"] || 0),
//       defaultSortOrder: "descend",
//     },
//   ];

//   const handleTopKIncrease = () => {
//     setTopKValue((prev) => Math.min(prev + 1, 100)); // Max value of 100
//   };

//   const handleTopKDecrease = () => {
//     setTopKValue((prev) => Math.max(prev - 1, 1)); // Min value of 1
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         backgroundColor: "white",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <Container
//         sx={{
//           backgroundColor: "#cccccc",
//           padding: "2rem",
//           borderRadius: "8px",
//           boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
//           textAlign: "center",
//         }}
//         maxWidth="sm"
//       >
//         <Typography variant="h4" gutterBottom>
//           Controls Engine
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <label htmlFor="file1">
//             <Input
//               accept=".xlsx"
//               id="file1"
//               type="file"
//               onChange={(e) => handleFileChange(e, setFile1)}
//             />
//             <Button
//               startIcon={<UploadIcon />}
//               variant="outlined"
//               component="span"
//               sx={{
//                 marginBottom: "1rem",
//                 width: "100%",
//                 color: "#333333",
//                 borderColor: "#333333",
//                 "&:hover": {
//                   borderColor: "#333333",
//                 },
//               }}
//             >
//               Upload User Org Framework
//             </Button>
//           </label>
//           {file1 && (
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 marginBottom: "1rem",
//               }}
//             >
//               <Typography variant="body2">{file1.name}</Typography>
//               <IconButton onClick={() => handleDeleteFile(setFile1)}>
//                 <DeleteIcon />
//               </IconButton>
//             </Box>
//           )}

//           <label htmlFor="file2">
//             <Input
//               accept=".xlsx"
//               id="file2"
//               type="file"
//               onChange={(e) => handleFileChange(e, setFile2)}
//             />
//             <Button
//               startIcon={<UploadIcon />}
//               variant="outlined"
//               component="span"
//               sx={{
//                 marginBottom: "1rem",
//                 width: "100%",
//                 color: "#333333",
//                 borderColor: "#333333",
//                 "&:hover": {
//                   borderColor: "#333333",
//                 },
//               }}
//             >
//               Upload Service Org Framework
//             </Button>
//           </label>
//           {file2 && (
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 marginBottom: "1rem",
//               }}
//             >
//               <Typography variant="body2">{file2.name}</Typography>
//               <IconButton onClick={() => handleDeleteFile(setFile2)}>
//                 <DeleteIcon />
//               </IconButton>
//             </Box>
//           )}

//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               marginBottom: "1rem",
//               gap: "1rem",
//             }}
//           >
//             <Typography variant="h9">Top-K Value:</Typography>
//             <Tooltip
//               title={
//                 <>
//                   Higher value shows more potential matches but might include
//                   less relevant ones.
//                   <br />
//                   Lower value focuses on more relevant matches.
//                 </>
//               }
//             >
//               <InfoIcon sx={{ cursor: "pointer" }} />
//             </Tooltip>
//             <Button
//               variant="contained"
//               onClick={handleTopKDecrease}
//               sx={{
//                 backgroundColor: "#333333",
//                 color: "#fff",
//                 "&:hover": {
//                   backgroundColor: "#FFE600",
//                   color: "black",
//                   transform: "scale(1.05)",
//                 },
//                 padding: "0",
//                 // Ensures the button is small
//               }}
//             >
//               -
//             </Button>
//             <Typography variant="h6">{topKValue}</Typography>
//             <Button
//               variant="contained"
//               onClick={handleTopKIncrease}
//               sx={{
//                 backgroundColor: "#333333",
//                 color: "#fff",
//                 "&:hover": {
//                   backgroundColor: "#FFE600",
//                   color: "black",
//                   transform: "scale(1.05)",
//                 },
//                 padding: "0",
//                 // Ensures the button is small
//               }}
//             >
//               +
//             </Button>
//           </Box>

//           <Button
//             type="submit"
//             variant="contained"
//             sx={{
//               width: "100%",
//               padding: "0.75rem",
//               backgroundColor: "#333333",
//               color: "#fff",
//               "&:hover": {
//                 backgroundColor: "#FFE600",
//                 color: "black",
//                 transform: "scale(1.05)",
//               },
//             }}
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size={24} /> : "Submit"}
//           </Button>
//         </form>

//         <Modal
//           title={`Results processed in ${processingTime}`}
//           open={isModalVisible}
//           onCancel={() => setIsModalVisible(false)}
//           width="100%"
//           height="100%"
//           style={{
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             margin: 10,
//             borderRadius: 0,
//             overflow: "hidden",
//           }}
//           footer={[
//             <Button key="download" variant="contained" onClick={handleDownload}>
//               Download as CSV
//             </Button>,
//             <Button
//               key="close"
//               variant="contained"
//               color="error"
//               onClick={() => setIsModalVisible(false)}
//             >
//               Close
//             </Button>,
//           ]}
//         >
//           <Table
//             dataSource={resultData}
//             columns={columns}
//             pagination={false}
//             rowKey={(record, index) => index} // Ensure unique row keys
//             scroll={{ y: "calc(100vh - 200px)" }}
//           />
//         </Modal>
//       </Container>
//     </Box>
//   );
// }


"use client";

import React, { useState, useMemo } from "react";
import {
  Button,
  Container,
  CircularProgress,
  Typography,
  Box,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/system";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
<<<<<<< Updated upstream
import { styled } from "@mui/system";
import { Modal, Table } from "antd"; // Removed Input from here
import { Input } from "antd"; // Added separate Input import
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
=======
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // For the reopen modal button
import { Modal, Table } from "antd";
import * as XLSX from "xlsx";
>>>>>>> Stashed changes

// ------------------- Styled Components -------------------
const StyledInput = styled("input")({
  display: "none",
});

// ------------------- Reusable Components -------------------
/**
 * FileUpload Component
 * Displays only an upload icon.
 * Clicking the icon opens the file dialog.
 * Shows file name and a delete icon once a file is chosen.
 */
const FileUpload = ({ accept, file, setFile, label }) => {
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
 * HowItWorks Component
 * Provides a brief explanation of the tool's workflow.
 */
const HowItWorks = () => (
  <Box>
    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
      How It Works
    </Typography>
    <Typography variant="body2" sx={{ mb: 2 }}>
      The Controls Engine processes your framework files by comparing them and providing a similarity analysis. Here's how it works:
    </Typography>
    <ol>
      <li>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Upload Files:</strong> Please provide the User Org Framework and Service Org Framework in Excel format.
        </Typography>
      </li>
      <li>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Specify Top-K Value:</strong> This specifies the maximum number of best-matches to be displayed per control.
        </Typography>
      </li>
      <li>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Baseline:</strong> Initiate the comparison process and monitor the progress. Download the output as an excel file to review the results.
        </Typography>
      </li>
    </ol>
  </Box>
);

// ------------------- Main Component -------------------
export default function Tool1Page() {
  // ----------------- State Variables -----------------
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [processingTime, setProcessingTime] = useState("");
  const [topKValue, setTopKValue] = useState(5);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(true); // For the overlay

  // ----------------- New State Variables -----------------
  const [downloadUrl, setDownloadUrl] = useState(null); // To store the download URL from the backend
  const [downloadFilename, setDownloadFilename] = useState("output.xlsx"); // To store the dynamic filename

  // ------------------- Helper Functions -------------------
  // Removed formatEta since ETA is no longer used

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
    if (!file1 || !file2) {
      alert("Please upload both files.");
      return;
    }

    setLoading(true);
    setProcessingTime("Processing...");
    setResultData([]);
    setDownloadUrl(null); // Reset download URL
    setDownloadFilename("output.xlsx"); // Reset download filename

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
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        } else {
          alert("Error occurred while processing files.");
        }
        setLoading(false);
        return;
      }

      const result = await response.json();
<<<<<<< Updated upstream

      setResultData(result.data);
      setProcessingTime(result.processing_time);
=======
      setResultData(result.data || []);
      setProcessingTime(result.processing_time || "");

      // Set download URL and filename from the response
      if (result.download_url) {
        // Ensure the URL is absolute
        const url = new URL(result.download_url);
        setDownloadUrl(url.href);

        // Extract filename from the download URL
        const filename = result.download_url.split("/").pop();
        setDownloadFilename(filename || "output.xlsx");
      }

>>>>>>> Stashed changes
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing files.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------- Download Handler -------------------
  const handleDownload = () => {
<<<<<<< Updated upstream
    const link = document.createElement("a");
    link.href = "http://127.0.0.1:5000/download/framework1_with_results.csv";
    link.setAttribute("download", "framework1_with_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const StyledInput = styled("input")({
    display: "none",
  });

  const columns = [
    {
      title: "Domain",
      dataIndex: "Domain",
      key: "Domain",
      filters: [...new Set(resultData.map(item => item.Domain))].map(domain => ({
        text: domain,
        value: domain,
      })),
      onFilter: (value, record) => record.Domain === value,
      filterSearch: true,
      filterMode: 'tree',
      filterMultiple: false,
    },
    {
      title: "Sub-Domain",
      dataIndex: "Sub-Domain",
      key: "Sub-Domain",
      filterSearch: true,
      filterMode: 'menu',
      filters: [...new Set(resultData.map(item => item["Sub-Domain"]))].map(subDomain => ({
        text: subDomain,
        value: subDomain,
      })),
      onFilter: (value, record) => record["Sub-Domain"] === value,
    },
    {
            title: "Control from User Org Framework",
            dataIndex: "Control",
            key: "Control",
          },
          {
            title: "Controls from Service Org that match",
            dataIndex: "Controls from F2 that match",
            key: "Controls from F2 that match",
          },
          {
            title: "Similarity Scores",
            dataIndex: "Similarity Scores",
            key: "Similarity Scores",
            sorter: (a, b) =>
              parseFloat(a["Similarity Scores"] || 0) -
              parseFloat(b["Similarity Scores"] || 0),
            defaultSortOrder: "descend",
          },
  ];

=======
    if (!downloadUrl) {
      alert("Download URL is not available.");
      return;
    }

    // Open the download URL in a new tab
    window.open(downloadUrl, "_blank");
  };

  // ------------------- Top-K Handlers -------------------
>>>>>>> Stashed changes
  const handleTopKIncrease = () => {
    setTopKValue((prev) => Math.min(prev + 1, 100));
  };

  const handleTopKDecrease = () => {
    setTopKValue((prev) => Math.max(prev - 1, 1));
  };

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
          backgroundImage: `url('/BackgroundCE.webp')`,
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
        <Container
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)", // Slightly transparent to blend with background
            padding: "3rem",
            marginTop: "25rem", // Adjusted margin-top for better positioning
            borderRadius: "12px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            maxWidth: "800px",
          }}
        >
          {/* Heading Box */}
          <Box
            sx={{
              backgroundColor: "#FFD700",
              padding: "1.5rem",
              borderRadius: "8px",
              mb: 4,
              textAlign: "center",
            }}
          >
<<<<<<< Updated upstream
            <Typography variant="h9">Top-K Value:</Typography>
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
=======
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#333333" }}>
              Controls Engine
            </Typography>
>>>>>>> Stashed changes
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Upload User Org Framework */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "left" }}>
                  Upload User Org Framework
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FileUpload
                  accept=".xlsx, .xls"
                  file={file1}
                  setFile={setFile1}
                  label="Upload User Org Framework"
                />
              </Grid>

              {/* Upload Service Org Framework */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "left" }}>
                  Upload Service Org Framework
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FileUpload
                  accept=".xlsx, .xls"
                  file={file2}
                  setFile={setFile2}
                  label="Upload Service Org Framework"
                />
              </Grid>

              {/* Top-K Value */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "left" }}>
                  Top-K Value
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                      minWidth: "36px",
                      height: "36px",
                      borderRadius: "4px",
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
                      minWidth: "36px",
                      height: "36px",
                      borderRadius: "4px",
                    }}
                  >
                    +
                  </Button>
                </Box>
              </Grid>

              {/* Baseline Button and "?" Help Button */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {/* Help Button */}
                  <IconButton
                    onClick={() => setIsInfoModalOpen(true)}
                    sx={{
                      backgroundColor: "#FFD700",
                      color: "#333333",
                      "&:hover": {
                        backgroundColor: "#f7f7f7",
                      },
                      alignSelf: "center",
                      marginRight: "auto",
                    }}
                  >
                    <HelpOutlineIcon />
                  </IconButton>

                  {/* Baseline Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      width: "50%", // Reduced button width
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
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Baseline"}
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
          {loading && (
            <Box sx={{ mt: 4, textAlign: "left" }}>
              <Typography variant="body1" gutterBottom sx={{ color: "#333333" }}>
                Status: {processingTime}
              </Typography>
              {/* Removed the LinearProgress and ETA display */}
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
            Welcome to Controls Engine
          </DialogTitle>
          <DialogContent dividers>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Purpose
              </Typography>
              <Typography variant="body2" sx={{ color: "#555555", mb: 4 }}>
                The Controls Engine compares your User Organization Framework against the Service Organization Framework to identify similarities and differences. This helps in understanding how well the controls align between your organization and the service provider.
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

        {/* Modal to display Results */}
        <Modal
          title={`Results processed in ${processingTime}`}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width="90%"
          style={{
            top: 20,
            maxWidth: "90vw",
            margin: "0 auto",
          }}
          footer={[
<<<<<<< Updated upstream
            <Button key="download" variant="contained" onClick={handleDownload}>
              Download as CSV
=======
            <Button key="download" variant="contained" onClick={handleDownload} disabled={!downloadUrl}>
              Download Excel
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          <Table
            dataSource={resultData}
            columns={columns}
            pagination={false}
            rowKey={(record, index) => index}
            scroll={{ y: "calc(100vh - 200px)" }}
            onChange={(pagination, filters, sorter) => {
              console.log('Table parameters:', { filters, sorter });
            }}
          />
=======
          <Typography variant="body2" sx={{ mb: 3, color: "#555555" }}>
            Below is a preview of the results. To view the interactive Pivot Table,
            please download the Excel file.
          </Typography>
          {resultData.length > 0 ? (
            <>
              <Table
                dataSource={resultData}
                columns={columns}
                pagination={{ pageSize: 10 }}
                rowKey={(record, index) => index}
                scroll={{ y: "calc(100vh - 300px)", x: "100%" }}
                bordered
              />
            </>
          ) : (
            <Typography variant="body2" sx={{ color: "#777777" }}>
              No data available to display.
            </Typography>
          )}
>>>>>>> Stashed changes
        </Modal>
      </Box>
    </Box>
  );
}




