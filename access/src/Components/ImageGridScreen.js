import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Snackbar,
  Modal,
  Card,
  CardMedia,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import image1 from "./assets/image3.jpg";
import image2 from "./assets/image3.jpg";
import image3 from "./assets/image3.jpg";
import image4 from "./assets/image3.jpg";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux"; //Use dispatch to dispatch a action to reducer
import { clearUser } from "../Redux/userSlice"; //getting the actions from reducer

const ImageGridScreen = ({ setIsLoggedIn }) => {
  //receiving prop
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.user.userName); //Selecting the userName
  const accessKey = useSelector((state) => state.user.accessKey); //getting the accessKey
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); //State for file uploading
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileUrlRef = useRef(null);
  const imageUrls = [image1, image2, image3, image4];

  useEffect(() => {
    if (accessKey) {
      const fileContent = `AccessKey: ${accessKey}`;
      const blob = new Blob([fileContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      fileUrlRef.current = url;
    }
    const isAccessKeyDownloaded =
      localStorage.getItem(`accessKeyDownloaded_${userName}`) === "true";
    if (isAccessKeyDownloaded) {
      setSnackbarMessage("Access Key is Already Downloaded");
      setSnackbarOpen(true);
    }
  }, [accessKey]);
  const isAccessKeyDownloaded = () => {
    return localStorage.getItem(`accessKeyDownloaded_${userName}`) === "true";
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    dispatch(clearUser());
  };
  useEffect(() => {
    let timeout;
    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        handleLogout();
      }, 30000); // 30 seconds
    };
    resetTimeout();
    window.addEventListener("mousemove", resetTimeout); //Will reset the timeout when mouse moves
    return () => window.removeEventListener("mousemove", resetTimeout); //event listener is removed
  }, []);
  useEffect(() => {
    let timeout;
    const showAlert = () => {
      timeout = setTimeout(() => {
        setSnackbarOpen(true);
        setSnackbarMessage(
          "You've been inactive for 15 seconds. You will be logged out in 15 seconds."
        );
        timeout = setTimeout(() => {
          handleLogout();
        }, 15000); // 15 seconds
      }, 15000); // 15 seconds
    };
    showAlert();
    return () => clearTimeout(timeout);
  }, []);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleFileUpload = (event) => {
    setUploadedFile(event.target.files[0]);
  };

  const handleDownloadAccessKey = () => {
    if (fileUrlRef.current) {
      const link = document.createElement("a");
      link.href = fileUrlRef.current;
      link.download = `accessKey_${accessKey}.txt`;
      link.click();
      setSnackbarOpen(true);
      setSnackbarMessage("Access Key Downloaded Locally");
      localStorage.setItem(`accessKeyDownloaded_${userName}`, true);

      setTimeout(() => {
        setSnackbarOpen(false);
      }, 2000);
    }
  };

  const handleVerifyAccessKey = () => {
    if (uploadedFile) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const fileContent = fileReader.result;
        if (fileContent.includes(accessKey)) {
          setTimeout(() => {
            setModalOpen(false);
            Swal.fire({
              title: "Access Key Matches",
              text: "Your images will now be downloaded",
              icon: "success",
            });
            downloadImages();
          }, 2000);
        } else {
          Swal.fire({
            title: "Access Key Mismatch",
            text: "The uploaded file does not contain the correct access key",
            icon: "error",
          });
        }
      };
      fileReader.readAsText(uploadedFile);
      setModalOpen(false);
    } else {
      setModalOpen(true);
    }
  };

  const downloadImages = () => {
    imageUrls.forEach((imageUrl) => {
      fetch(imageUrl)
        .then((response) => response.blob())
        .then((imageBlob) => {
          const tempImageUrl = URL.createObjectURL(imageBlob);
          const link = document.createElement("a");
          link.href = tempImageUrl;
          link.download = "image.jpg";
          link.click();
          URL.revokeObjectURL(tempImageUrl);
        })
        .catch((error) => {
          console.error("Error downloading image:", error);
          Swal.fire(
            "Error",
            "An error occurred while downloading the images.",
            "error"
          );
        });
    });
  };

  return (
    <Box sx={{ padding: "16px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <IconButton onClick={handleMenuOpen}>
          <Avatar>{userName.charAt(0).toUpperCase()}</Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Typography>
            {isAccessKeyDownloaded()
              ? "Access Key is Already Downloaded"
              : "Your Access Key is Ready. You can download it here👇"}
          </Typography>
          {!isAccessKeyDownloaded() && (
            <MenuItem
              sx={{
                marginLeft: "8px",
                backgroundColor: "green",
                color: "white",
                "&:hover": { backgroundColor: "darkgreen" },
              }}
              onClick={handleDownloadAccessKey}
            >
              Download Access Key
            </MenuItem>
          )}
        </Menu>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {imageUrls.map((imageUrl, index) => (
          <Card
            key={index}
            sx={{ maxWidth: 600, margin: "0 auto", position: "relative" }}
          >
            <CardMedia
              component="img"
              image={imageUrl}
              height="194"
              alt="Card Image"
              sx={{ alignSelf: "center" }}
            />
            <Box sx={{ position: "absolute", top: 0, right: 0 }}>
              <IconButton onClick={handleVerifyAccessKey}>
                <DownloadIcon />
              </IconButton>
            </Box>
          </Card>
        ))}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        message={snackbarMessage}
      />
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Upload Access Key File
          </Typography>
          <input type="file" onChange={handleFileUpload} />
          <Button onClick={handleVerifyAccessKey}>Verify Access Key</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ImageGridScreen;
