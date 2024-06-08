import { ButtonStyleProps } from "./buttonStyleProps.interface";

export interface StatusDropdownProps {
  statuses: { [key: string]: string };
  onClick: (status: string) => void;
  buttonStyle: ButtonStyleProps;
}
