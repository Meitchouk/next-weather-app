"use client";

import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";

export type ButtonProps = MuiButtonProps;

export function Button({ children, ...props }: ButtonProps) {
  return (
    <MuiButton variant="contained" disableElevation {...props}>
      {children}
    </MuiButton>
  );
}
