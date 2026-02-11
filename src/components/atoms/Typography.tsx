"use client";

import MuiTypography, { TypographyProps as MuiTypographyProps } from "@mui/material/Typography";

export type TypographyProps = MuiTypographyProps;

export function Typography({ children, ...props }: TypographyProps) {
  return <MuiTypography {...props}>{children}</MuiTypography>;
}
