import * as React from "react";
import MenuButton, { PossibleMenuColors } from "../UI/MenuButton";
import Layout from "./Layout";
import "../Styles/global.scss";

interface Props {
  color?: PossibleMenuColors;
  children: React.ReactNode;
}

const MenuLayout = ({ color = "white", children }: Props) => (
  <Layout>
    <MenuButton color={color} />
    {children}
  </Layout>
);

export default MenuLayout;
