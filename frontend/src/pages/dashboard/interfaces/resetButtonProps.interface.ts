import { ButtonStyleProps } from "./buttonStyleProps.interface";

export interface ResetButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  buttonStyle: ButtonStyleProps;
}
