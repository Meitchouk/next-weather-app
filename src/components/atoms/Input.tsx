"use client";

import MuiTextField, { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField";

export type InputProps = MuiTextFieldProps;

export function Input(props: InputProps) {
  return <MuiTextField fullWidth {...props} />;
}
