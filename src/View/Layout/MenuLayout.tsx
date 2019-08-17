import * as React from "react";
import { Link } from "gatsby";
import MenuButton from "../UI/MenuButton";
import Layout from "./Layout";
import "./global.scss";

interface Props {
  color?: string;
  children: React.ReactNode;
}

const MenuLayout = ({ color = "white", children }: Props) => (
  <Layout>
    <Link to={"/menu"}>
      <MenuButton color={color} />
    </Link>
    {children}
  </Layout>
);

export default MenuLayout;
