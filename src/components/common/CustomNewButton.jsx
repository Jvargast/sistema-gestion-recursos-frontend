import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import React from "react";

const CustomNewButton = ({name, onClick}) => {
  return (
    <Box display={"flex"} justifyContent={"flex-end"}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        sx={{ textTransform: "none" }}
        onClick={onClick}
      >
        {name}
      </Button>
    </Box>
  );
};

export default CustomNewButton;
