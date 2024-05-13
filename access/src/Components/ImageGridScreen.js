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
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux"; //Use dispatch to dispatch a action to reducer
import { clearUser } from "../Redux/userSlice"; //getting the actions from reducer
import Echarts from "./Echarts";

const ImageGridScreen = ({ setIsLoggedIn }) => {
  //receiving prop
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.user.userName); //Selecting the userName
  const accessKey = useSelector((state) => state.user.accessKey); //getting the accessKey
  const [anchorEl, setAnchorEl] = useState(null);//State to open and close menu
  const [snackbarMessage, setSnackbarMessage] = useState("");//State for snackbar message
  const [snackbarOpen, setSnackbarOpen] = useState(false);//State for snackbar open or close
  const [modalOpen, setModalOpen] = useState(false); //State for modal
  const [uploadedFile, setUploadedFile] = useState(null);//State for file uploading
  const fileUrlRef = useRef(null);//store the url of the uploaded file
  const chartRef = useRef(null);//store the reference to the div element where the echarts is rendered
  useEffect(() => {
    if (accessKey) {
      const fileContent = `AccessKey: ${accessKey}`;//Content of the file
      const blob = new Blob([fileContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);//unique refernce to the blob object
      fileUrlRef.current = url;
    }
    const isAccessKeyDownloaded =
      localStorage.getItem(`accessKeyDownloaded_${userName}`) === "true";
    if (isAccessKeyDownloaded) {
      setSnackbarMessage("Access Key is Already Downloaded");
      setSnackbarOpen(true);
    }
  }, [accessKey]);//Whenever access key changes useEffect will be performing again and again
  const isAccessKeyDownloaded = () => {
    return localStorage.getItem(`accessKeyDownloaded_${userName}`) === "true";
  };
  const handleLogout = () => {//if logged out means 
    setIsLoggedIn(false);
    dispatch(clearUser());
  };
  useEffect(() => {//Timeout to perform automatic logout in a minute
    let timeout;
    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        handleLogout();
      }, 60000); // 60 seconds
    };
    resetTimeout();
    window.addEventListener("mousemove", resetTimeout); //Will reset the timeout when mouse moves
    return () => window.removeEventListener("mousemove", resetTimeout); //event listener is removed
  }, []);
  useEffect(() => {//Time out to perform alert message saying you will be logged out in a while
    let timeout;
    const showAlert = () => {
      timeout = setTimeout(() => {
        setSnackbarOpen(true);
        setSnackbarMessage(
          "You've been inactive for 30 seconds. You will be logged out in 30 seconds."
        );
        timeout = setTimeout(() => {
          handleLogout();
        }, 30000); // 15 seconds
      }, 30000); // 15 seconds
    };
    showAlert();
    return () => clearTimeout(timeout);
  }, []);
  const handleMenuOpen = (event) => {//Menu Open Function
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {//Menu Close Function
    setAnchorEl(null);
  };

  const handleModalOpen = () => {//Modal Open Function
    setModalOpen(true);
  };

  const handleModalClose = () => {//Modal Close Function
    setModalOpen(false);
  };
  const handleSnackbarClose = () => {//SnackBar Close Function
    setSnackbarOpen(false);
  };

  const handleFileUpload = (event) => {//File Upload Function
    setUploadedFile(event.target.files[0]);
  };

  const handleDownloadAccessKey = () => {//Function to download access key for a new user
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

  const handleVerifyAccessKey = () => {//Function to verify access key if the access key matches
    if (uploadedFile) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const fileContent = fileReader.result;
        if (fileContent.includes(accessKey)) {
          setModalOpen(false);
          setTimeout(() => {
            Swal.fire({
              title: "Access Key Matches",
              text: "Your images will now be downloaded",
              icon: "success",
            });
            downloadChart();
          }, 2000);
        } else {
          setModalOpen(false);
          Swal.fire({
            title: "Access Key Mismatch",
            text: "The uploaded file does not contain the correct access key",
            icon: "error",
          });
        }
      };
      fileReader.readAsText(uploadedFile);
    } else {
      setModalOpen(true);
    }
  };

  const downloadChart = () => {//Function to download Chart
    try {
      if (chartRef.current && chartRef.current.getChartInstance()) {//Retrives the current instance of the chart
        const chartInstance = chartRef.current.getChartInstance();
        if (chartInstance) {
          const chartDataUrl = chartInstance.getDataURL();//This method usually returns a base64-encoded URL representing the current state of the chart.
          const downloadLink = document.createElement('a');//This creates a new <a> element, which is used to trigger the download.
          downloadLink.href = chartDataUrl;//This sets the href attribute of the <a> element to the data URL obtained from the chart.
          downloadLink.download = 'chart.png';
          downloadLink.click();
        } else {
          console.error("Chart instance is not available");
        }
      }
    } catch (error) {
      console.error("Error downloading chart:", error);
      Swal.fire(
        "Error",
        `An error occurred while downloading the chart: ${error.message}`,
        "error"
      );
    }
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
              ? "Access Key is Already Downloaded"//If Access key is already downloaded
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
              onClick={handleDownloadAccessKey}//if not access key downloaded
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
          display: "flex",
          justifyContent: "center",
          position: "relative",
          height: "calc(100vh - 100px)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "90%", 
            height: "80vh", 
            margin: "0 auto", // Center the Box horizontally
            position: "absolute",
          }}
        >
          <Echarts ref={chartRef} />
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: -40,
              transform: "translateY(-50%)",
              zIndex: 2,
            }}
          >
            <IconButton
              onClick={handleVerifyAccessKey}
              sx={{
                color: "steelblue",
                fontSize: "10rem",
                fontWeight: "bolder",
              }}
            >
              <DownloadIcon />
            </IconButton>
          </Box>
        </Box>
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
