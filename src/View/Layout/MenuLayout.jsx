// @flow
import React, { type Node } from "react";
import { Link } from "gatsby";
import MenuButton from "../UI/MenuButton";
import Layout from "./Layout";

type Props = {
  children: Node,
};

const MenuLayout = (props: Props) => (
  <Layout>
    <Link to={"/menu"}>
      <MenuButton />
    </Link>
    {props.children}
  </Layout>
);

export default MenuLayout;
