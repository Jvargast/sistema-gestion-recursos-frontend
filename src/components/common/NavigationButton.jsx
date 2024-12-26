import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NavigationButton = ({ label, route }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => navigate(route)}
      sx={{ width: "fit-content" }}
    >
      {label}
    </Button>
  );
};

export default NavigationButton;
