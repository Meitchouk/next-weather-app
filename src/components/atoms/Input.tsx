"use client";

import MuiTextField, {
  TextFieldProps as MuiTextFieldProps,
} from "@mui/material/TextField";

export type InputProps = MuiTextFieldProps;

/**
 * Atom: Thin wrapper around MUI TextField.
 * Keeps a single source of truth for text input styling across the app.
 */
export function Input(props: InputProps) {
  return <MuiTextField fullWidth {...props} />;
}
