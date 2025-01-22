// pages/chat/page.js

"use client";
import { useState, useEffect, useRef } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  IconButton,
  TextField,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";
import { Modal, Tooltip } from "antd";
import ReactMarkdown from "react-markdown";
import io from "socket.io-client";

const StyledInput = styled("input")({
  display: "none",
});

let socket;

export default function ChatWithDocs() {
  // State
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // For auto-scroll
  const messagesEndRef = useRef(null);

  // SocketIO Setup
  useEffect(() => {
    socket = io("http://localhost:5000");

    socket.on("receive_message", (data) => {
      setChatMessages((prev) => [...prev, { sender: "bot", text: data.message }]);
      setLoading(false);
    });

    socket.on("connect_error", (err) => {
      console.error("SocketIO connection error:", err);
      setError("Failed to connect to the SocketIO server.");
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Handle file uploads
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const allowedExtensions = ["pdf", "docx", "txt", "png", "jpg", "jpeg", "gif"];
    const filtered = files.filter((file) =>
      allowedExtensions.includes(file.name.split(".").pop().toLowerCase())
    );

    if (filtered.length !== files.length) {
      alert("Only PDF, DOCX, TXT, PNG, JPG, JPEG, and GIF files are allowed.");
    }

    try {
      const responses = await Promise.all(
        filtered.map((file) => {
          const formData = new FormData();
          formData.append("file", file);
          return fetch("http://localhost:5000/upload_document", {
            method: "POST",
            body: formData,
          });
        })
      );

      const results = await Promise.all(responses.map((res) => res.json()));
      const successful = results
        .filter((r) => r.document_id)
        .map((r) => ({
          id: r.document_id,
          name: r.document_id.replace("_processed.txt", ""),
        }));

      if (successful.length) {
        setUploadedFiles((prev) => [...prev, ...successful]);
        alert("Documents uploaded and processed successfully.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload documents.");
    }
  };

  // Delete a file from the uploaded list
  const handleDeleteFile = (id) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
    setSelectedDocs((prev) => prev.filter((docId) => docId !== id));
  };

  // Toggle doc selection
  const handleToggleDoc = (id) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
    );
  };

  // Send a message (query) to the backend
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!selectedDocs.length) {
      alert("Please select at least one document to reference.");
      return;
    }

    // Add user message
    setChatMessages((prev) => [...prev, { sender: "user", text: inputMessage }]);
    setInputMessage("");
    setLoading(true);
    setError("");

    // SocketIO approach
    if (socket) {
      socket.emit("send_message", {
        message: inputMessage,
        document_ids: selectedDocs,
      });
    }

    // If you prefer REST, uncomment this block and comment out the SocketIO block:
    /*
    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: inputMessage, document_ids: selectedDocs }),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "An error occurred while processing your query.");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setChatMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
      setLoading(false);
    } catch (err) {
      console.error("Chat error:", err);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
    */
  };

  return (
    <Box
      sx={{
        // Must match or exceed the navbar's fixed height to avoid overlap
        paddingTop: "80px",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Container
        sx={{
          backgroundColor: "#ffffff",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          maxWidth: "900px",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Chat with Your Documents
        </Typography>

        {/* Document Upload */}
        <Box sx={{ mb: 4 }}>
          <label htmlFor="upload-docs">
            <StyledInput
              accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.gif"
              id="upload-docs"
              type="file"
              multiple
              onChange={handleFileChange}
            />
            <Button
              startIcon={<UploadIcon />}
              variant="outlined"
              component="span"
              sx={{
                marginBottom: "1rem",
                color: "#333333",
                borderColor: "#333333",
                "&:hover": { borderColor: "#333333" },
              }}
            >
              Upload Documents
            </Button>
          </label>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "1rem",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Uploaded Documents
              </Typography>
              <FormGroup>
                {uploadedFiles.map((file) => (
                  <Box
                    key={file.id}
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedDocs.includes(file.id)}
                          onChange={() => handleToggleDoc(file.id)}
                        />
                      }
                      label={file.name}
                    />
                    <IconButton
                      onClick={() => handleDeleteFile(file.id)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </FormGroup>
            </Box>
          )}
        </Box>

        {/* Chat Window */}
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "1rem",
            height: "400px",
            overflowY: "auto",
            mb: 2,
            backgroundColor: "#fafafa",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {chatMessages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.sender === "user" ? "#DCF8C6" : "#EAEAEA",
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  maxWidth: "80%",
                  wordWrap: "break-word",
                }}
              >
                {msg.sender === "bot" ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  <Typography variant="body1">{msg.text}</Typography>
                )}
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CircularProgress size={20} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Bot is typing...
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>
        </Box>

        {/* Message Input */}
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <TextField
            label="Your Message"
            variant="outlined"
            fullWidth
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            // Add a placeholder to encourage referencing images
            placeholder="E.g., 'Please describe the uploaded diagram.'"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            disabled={loading || selectedDocs.length === 0}
          >
            Send
          </Button>
        </Box>

        {/* Error */}
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Tooltip title="Select documents (images or text) before typing your question. For images, ask something like 'What does this diagram show?'">
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            * Tip: Reference your images directly in the question for better results.
          </Typography>
        </Tooltip>

        {/* Optional Modal */}
        <Modal
          title="Info"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
          ]}
          width="80%"
        >
          <Typography>This is an optional extra info modal.</Typography>
        </Modal>
      </Container>
    </Box>
  );
}
