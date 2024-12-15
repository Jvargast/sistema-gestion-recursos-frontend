import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Alert } from "@mui/material";
import { closeNotification } from "../../state/reducers/notificacionSlice";

const Notification = () => {
  const dispatch = useDispatch();
  const { open, message, severity, duration } = useSelector(
    (state) => state.notificacion
  );

  const handleClose = () => {
    dispatch(closeNotification());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
