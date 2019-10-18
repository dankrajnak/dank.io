import * as React from "react";
import "../Styles/global.scss";

interface Props {
  children: React.ReactNode;
}

const Layout = (props: Props) => <div>{props.children}</div>;

export default Layout;
