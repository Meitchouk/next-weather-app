"use client";

import MuiButton, {
  ButtonProps as MuiButtonProps,
} from "@mui/material/Button";

export type ButtonProps = MuiButtonProps;

/**
 * Atom: Thin wrapper around MUI Button.
 * Ensures consistent button look across the entire application.
 */
export function Button({ children, ...props }: ButtonProps) {
  return (
    <MuiButton variant="contained" disableElevation {...props}>
      {children}
    </MuiButton>
  );
}
