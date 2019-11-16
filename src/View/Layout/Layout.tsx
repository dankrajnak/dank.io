import * as React from "react";
import "../Styles/global.scss";

interface Props {
  children: React.ReactNode;
}

/**
 * Just a placeholder in case I want to put other stuff in this.
 * @param props
 */
const Layout = (props: Props) => props.children;

export default Layout;
