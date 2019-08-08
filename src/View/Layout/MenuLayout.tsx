import * as React from "react";
import { Link } from "gatsby";
import MenuButton from "../UI/MenuButton";
import Layout from "./Layout";
import "./global.scss";

interface Props {
  children: React.ReactNode;
}

const MenuLayout = (props: Props) => (
  <Layout>
    <Link to={"/menu"}>
      <MenuButton />
    </Link>
    {props.children}
  </Layout>
);

export default MenuLayout;
