import React, { Node } from "react";
import { ThemeProvider } from "styled-components";
import Theme from "../Utility/theme";
import "./global.scss";

type Props = {
  children: Node;
};

const Layout = (props: Props) => (
  <ThemeProvider theme={Theme}>
    <div>{props.children}</div>
  </ThemeProvider>
);

export default Layout;
