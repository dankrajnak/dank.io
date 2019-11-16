import * as React from "react";
import { RouteComponentProps } from "@reach/router";
import styled from "styled-components";

import Layout from "../Layout/Layout";
import SEO from "../Utility/seo";
import Lorenz from "../PageComponents/Homepage/Lorenz";
import HallwayPreview from "../PageComponents/Menu/HallwayPreview";
import PerspectivePreview from "../PageComponents/Menu/PerspectivePreview";
import MetaSpherePreview from "../PageComponents/Menu/MetaSpherePreview";
import JustSomeThoughtsPreview from "../PageComponents/Menu/JustSomeThoughtsPreview";
import Card from "../../Domain/Card/Card";
import FullScreenMenu from "../PageComponents/Menu/FullScreenMenu/index";
import SimpleMenu from "../PageComponents/Menu/SimpleMenu/index";
import CardMenu from "../PageComponents/Menu/CardMenu/index";
import ModernMinimalistMenu from "../PageComponents/Menu/ModernMinimalMenu/index";

const Mute = styled.em`
  font-weight: 200;
`;

const cards: Card[] = [
  {
    background: ({ width, height }) => (
      <Lorenz width={width} height={height} colorful />
    ),
    title: "HEY",
    description: "Just to impress you",
    link: "/again",
  },
  {
    background: PerspectivePreview,
    title: "Perspective",
    description: "I spent two fucking days making a square move",
    link: "/perspective",
  },
  {
    background: HallwayPreview,
    title: "Hallway",
    description: (
      <div>
        <Mute>(Almost)</Mute> Shamelessly <Mute>(basically)</Mute> stolen{" "}
        <Mute>(from a tutorial)</Mute>
      </div>
    ),
    link: "/hallway",
  },
  {
    background: MetaSpherePreview,
    title: "Meta sphere",
    description: "Just go have some fun, kid",
    link: "/metaSphere",
  },
  {
    background: JustSomeThoughtsPreview,
    title: "Just Some Thought",
    description: "I just, well, here you go",
    link: "/justSomeThought",
  },
];
const Menu = (props: RouteComponentProps) => (
  <Layout>
    <SEO title="Menu" />
    <ModernMinimalistMenu routeProps={props} cards={cards} />
  </Layout>
);

export default React.memo(Menu, () => false);
