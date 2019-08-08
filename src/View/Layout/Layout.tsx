import * as React from "react";
import { ThemeProvider } from "styled-components";
import Theme from "../Utility/theme";
import "./global.scss";

interface Props {
  children: React.ReactNode;
}

const Layout = (props: Props) => (
  <ThemeProvider theme={Theme}>
    <div>{props.children}</div>
  </ThemeProvider>
);

export default Layout;
