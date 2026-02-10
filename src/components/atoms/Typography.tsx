import MuiTypography, {
  TypographyProps as MuiTypographyProps,
} from "@mui/material/Typography";

export type TypographyProps = MuiTypographyProps;

/**
 * Atom: Wrapper around MUI Typography.
 */
export function Typography({ children, ...props }: TypographyProps) {
  return <MuiTypography {...props}>{children}</MuiTypography>;
}
