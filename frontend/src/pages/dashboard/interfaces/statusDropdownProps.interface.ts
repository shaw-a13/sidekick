import { ButtonStyleProps } from "./buttonStyleProps.interface";

export interface StatusDropdownProps {
  onClick: (status: string) => void;
  buttonStyle: ButtonStyleProps;
}
