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

// export default function Tool1Page() {
//   const [file1, setFile1] = useState(null);
//   const [file2, setFile2] = useState(null);
//   const [result, setResult] = useState("");
//   const [loading, setLoading] = useState(false);

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

//     // Create a form data object to send the files
//     const formData = new FormData();
//     formData.append("frame1", file1);  // Match the curl request's "frame1"
//     formData.append("frame2", file2);  // Match the curl request's "frame2"

//     try {
//       const requestOptions = {
//         method: "POST",
//         body: formData,
//         redirect: "follow",  // Matches the curl request's redirect option
//       };

//       const response = await fetch("http://127.0.0.1:5000/process", requestOptions);
      
//       if (!response.ok) {
//         throw new Error("Error occurred while processing files");
//       }

//       const result = await response.text();  // Assuming the server returns plain text response
//       setResult(result);  // Set the result state with the response text
//     } catch (error) {
//       console.error("Error:", error);
//       setResult("An error occurred while processing the files.");
//     } finally {
//       setLoading(false);
//     }
// };

//   const Input = styled("input")({
//     display: "none",
//   });

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
//         {result && (
//           <Typography variant="body1" sx={{ marginTop: "1.5rem" }}>
//             {result}
//           </Typography>
//         )}
//       </Container>
//     </Box>
//   );
// }

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
import { Checkbox, FormControlLabel } from "@mui/material";
import { Modal, Table } from "antd"; // Import Table from Ant Design

export default function Tool1Page() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [processingTime, setProcessingTime] = useState("");
  const [faissOption, setFaissOption] = useState(false); // New state for FAISS option


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
    formData.append("FAISS", faissOption ? 1 : 0); // Add FAISS option to form data

    try {
      const response = await fetch("http://127.0.0.1:5000/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error occurred while processing files");
      }

      const result = await response.json();
      
      // Make sure to parse the data if it's a JSON string
      const parsedData = JSON.parse(result.data); // Parse the JSON string to get the array

      setResultData(parsedData); // Set the result data
      setProcessingTime(result.processing_time); 
      setIsModalVisible(true); // Open the modal
      
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleDownload = () => {
  //   const csvData = resultData.map(row =>
  //     Object.values(row).join(",")
  //   ).join("\n");

  //   const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  //   const url = URL.createObjectURL(blob);
    
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.setAttribute("download", "results.csv");
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };
  const handleDownload = () => {
    // Create a temporary link element
    const link = document.createElement("a");
    
    // Set the href to the API endpoint for downloading the CSV
    link.href = "http://127.0.0.1:5000/download/framework1_with_results.csv";
    
    // Set the download attribute for suggested file name
    link.setAttribute("download", "framework1_with_results.csv");
    
    // Append the link to the body
    document.body.appendChild(link);
    
    // Trigger the click event
    link.click();
    
    // Remove the link from the document after the click
    document.body.removeChild(link);
  };

  const Input = styled("input")({
    display: "none",
  });

  // Columns for the Ant Design Table
// Columns for the Ant Design Table
const columns = Object.keys(resultData[0] || {}).map((key) => ({
  title: key,
  dataIndex: key,
  key: key,
  ...(key === "Similarity Score"
    ? {
        sorter: (a, b) => {
          // Treat null or undefined as 0
          const scoreA = a[key] !== null && a[key] !== undefined ? parseFloat(a[key]) : 0;
          const scoreB = b[key] !== null && b[key] !== undefined ? parseFloat(b[key]) : 0;
          
          // Log the values being compared
          // console.log(`Comparing scores: ${scoreA} and ${scoreB}`);
          
          return scoreA - scoreB;
        },
        defaultSortOrder: "descend", // Sort descending by default
      }
    : {}),
}));



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
          <FormControlLabel
  control={
    <Checkbox
      checked={faissOption}
      onChange={(e) => setFaissOption(e.target.checked)}
      color="primary"
    />
  }
  label="Use FAISS for processing (Optional)" // The label for the checkbox
/>

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
    borderRadius: 0, // Optional: Removes rounded corners
    overflow: 'hidden', // Prevent overflow
  }}
  footer={[
    <Button key="download" variant="contained" onClick={handleDownload}>
      Download as CSV
    </Button>,
    <Button key="close" variant="contained" color="error" onClick={() => setIsModalVisible(false)}>
      Close
    </Button>,
  ]}
>
  <Table
    dataSource={resultData}
    columns={columns}
    pagination={false}
    rowKey={(record) => record.id || record.key}
    scroll={{ y: 'calc(100vh - 200px)' }} // Adjust scroll height
  />
</Modal>
      </Container>
    </Box>
  );
}
