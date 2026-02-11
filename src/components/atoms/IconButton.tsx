"use client";

import MuiIconButton, { IconButtonProps as MuiIconButtonProps } from "@mui/material/IconButton";

export type IconButtonProps = MuiIconButtonProps;

export function IconButton({ children, ...props }: IconButtonProps) {
  return <MuiIconButton {...props}>{children}</MuiIconButton>;
}
