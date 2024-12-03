import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Slide,
} from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AlertDialog = ({
  openAlert,
  onCloseAlert,
  onConfirm,
  title,
  message,
}) => {
  return (
    <Dialog
      open={openAlert}
      TransitionComponent={Transition}
      keepMounted
      onClose={onCloseAlert}
      aria-labelledby="confirm-dialog"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseAlert} color="primary" variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onCloseAlert();
          }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
