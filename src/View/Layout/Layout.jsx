// @flow
import React, { type Node } from "react";
import { Link } from "gatsby";
import { ThemeProvider } from "styled-components";
import Theme from "../Utility/theme";
import MenuButton from "../UI/MenuButton";

type Props = {
  children: Node,
};

const Layout = (props: Props) => (
  <ThemeProvider theme={Theme}>
    <div>
      <Link to={"/menu"}>
        <MenuButton />
      </Link>
      {props.children}
    </div>
  </ThemeProvider>
);

export default Layout;
