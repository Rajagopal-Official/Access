import React, { useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  Fab,
  Snackbar,
  IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import image1 from "./assets/image1.jpg";
import image2 from "./assets/image1.jpg";
import image3 from "./assets/image1.jpg";
import image4 from "./assets/image1.jpg";

const ImageGrid = () => {
  const imageUrls = [image1, image2, image3, image4]; //Array of Images
  const [accessKeys, setAccessKeys] = useState({}); //An empty object to store the access key
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  const handleUpload = (imageUrl) => {
    //Takes the Image url as paramter
    const fileInput = document.createElement("input"); //Create a input element
    fileInput.type = "file"; //A file type input
    fileInput.accept = ".txt"; //It will accept text file

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0]; //Select the first file
      const reader = new FileReader(); //Creates a FileReader

      reader.onload = () => {
        const fileContent = reader.result; //on complete loading read the file contents
        const accessKey = accessKeys[imageUrl]; //will have access key for all the files in the array

        if (fileContent.includes(accessKey)) {
          // Fetch the image data from the URL
          fetch(imageUrl)
            .then((response) => response.blob())
            .then((imageBlob) => {
              const tempImageUrl = URL.createObjectURL(imageBlob);
              const link = document.createElement("a");
              link.href = tempImageUrl;
              link.download = "image.jpg";
              link.click();
              //To release browser memory
              URL.revokeObjectURL(tempImageUrl);
              setSnackbarOpen(true)
              setSnackbarMessage('Image Downloaded Successfully with Accesskey Verification')
            })
            .catch((error) => {
              console.error("Error downloading image:", error);
              alert("Error downloading image. Please try again.");
            });
        } else {
          alert("Invalid access key!");
        }
      };

      reader.readAsText(file);
    });
    //file input.click to select
    fileInput.click();
  };
  const handleSnackbarClose=()=>{
    setSnackbarOpen(false)
  }
  return (
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
              <IconButton >
                <DownloadIcon />
              </IconButton>
          </Box>
        </Card>
      ))}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default ImageGrid;
