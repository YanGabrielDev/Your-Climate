import { createGlobalStyle } from "styled-components";
interface Props {
  theme: {
    body: string;
  };
}
export const GlobaclStyled = createGlobalStyle<Props>`
body{
  background-color: ${(props) => props.theme.body};
}`;
