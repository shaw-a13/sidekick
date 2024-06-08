import { ButtonStyleProps } from "./buttonStyleProps.interface";

export interface SearchInputProps {
  placeholder: string;
  ariaLabel: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  buttonStyle: ButtonStyleProps;
}
