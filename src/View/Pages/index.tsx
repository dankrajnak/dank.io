import * as React from "react";
import styled from "styled-components";
import Layout from "../Layout/Layout";
import SEO from "../Utility/seo";
import Lorenz from "../PageComponents/Homepage/Lorenz";
import HallwayPreview from "../PageComponents/Menu/HallwayPreview";
import PerspectivePreview from "../PageComponents/Menu/PerspectivePreview";
import MetaSpherePreview from "../PageComponents/Menu/MetaSpherePreview";
import JustSomeThoughtsPreview from "../PageComponents/Menu/JustSomeThoughtsPreview";
import Card from "../../Domain/Card/Card";
import CardMenu from "../PageComponents/Menu/CardMenu";
import { MenuRouteProps } from "../../Domain/Menu/Menu";

const Mute = styled.em`
  font-weight: 200;
`;

const cards: Card[] = [
  {
    background: ({ width, height }) => (
      <Lorenz width={width} height={height} colorful />
    ),
    title: "Again",
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
// I can't find the typescript type for props passed into pages to save my life.
const Menu = (props: MenuRouteProps) => (
  <Layout>
    <SEO title="Menu" />
    <CardMenu routeProps={props} cards={cards} />
  </Layout>
);

export default React.memo(Menu, () => false);
