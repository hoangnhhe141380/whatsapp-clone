import React, { SyntheticEvent } from "react"
import { Snackbar, Alert, SnackbarCloseReason } from "@mui/material"

interface AlertComponentProps {
  open: boolean
  handleClose: () => void
  severity: "error" | "info" | "success" | "warning"
  message: string
}

function AlertComponenet(props: AlertComponentProps) {
  const { open, handleClose, severity, message } = props
  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default AlertComponenet
