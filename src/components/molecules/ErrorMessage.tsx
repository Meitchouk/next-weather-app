import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

interface ErrorMessageProps {
  message: string;
}

/**
 * Molecule: Error alert using MUI Alert component.
 */
export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <Alert
      severity="error"
      variant="outlined"
      role="alert"
      sx={{ width: "100%", maxWidth: 480 }}
    >
      <AlertTitle>Error</AlertTitle>
      {message}
    </Alert>
  );
}
