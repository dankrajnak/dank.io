import * as React from "react";
import styled from "styled-components";
import Layout from "../Layout/Layout";
import SEO from "../Utility/seo";
import { CARD_HEIGHT, CARD_WIDTH } from "../UI/Card/Card";
import Lorenz from "../PageComponents/Homepage/Lorenz";
import CardDeck from "../UI/CardDeck/CardDeck";
import useFullScreen from "../Hooks/useFullScreen";
import useScrollAmount from "../Hooks/useScrollAmount";
import HallwayPreview from "../PageComponents/Hallway/HallwayPreview";
import { Link } from "gatsby";
import PerspectivePreview from "../PageComponents/menu/PerspectivePreview";
import MetaSpherePreview from "../PageComponents/menu/MetaSpherePreview";
import JustSomeThoughtsPreview from "../PageComponents/menu/JustSomeThoughtsPreview";

const Mute = styled.em`
  font-weight: 200;
`;

const cards = [
  {
    background: <Lorenz width={CARD_WIDTH} height={CARD_HEIGHT} colorful />,
    title: "Homepage",
    description: "Just to impress you",
    link: "/",
  },
  {
    background: <PerspectivePreview width={CARD_WIDTH} height={CARD_HEIGHT} />,
    title: "Perspective",
    description: "I spent two fucking days making a square move",
    link: "/perspective",
  },
  {
    background: <HallwayPreview width={CARD_WIDTH} height={CARD_HEIGHT} />,
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
    background: <MetaSpherePreview width={CARD_WIDTH} height={CARD_HEIGHT} />,
    title: "Meta sphere",
    description: "Just go have some fun, kid",
    link: "/metaSphere",
  },
  {
    background: (
      <JustSomeThoughtsPreview width={CARD_WIDTH} height={CARD_HEIGHT} />
    ),
    title: "Just Some Thought",
    description: "Whatever, I don't care anymore",
    link: "/justSomeThought",
  },
];

const ScrollMessage = styled.div.attrs<{ opacity: number }>(props => ({
  style: { opacity: props.opacity },
}))`
  position: fixed;
  bottom: 20px;
  width: 100%;
  text-align: center;
  font-size: small;
  color: #aaa;
`;

const AboutContainer = styled.div`
  position: fixed;
  top: 8%;
  left: 8%;
  width: 100%;
  a {
    text-decoration: none;
    color: #222;
    &:hover {
      border-bottom: solid 1px #222;
    }
  }
`;
const Menu = () => {
  const [width, height] = useFullScreen();
  const scroll = useScrollAmount();
  return (
    <Layout>
      <SEO title="Menu" />
      <AboutContainer>
        <Link to={"/about"}>About</Link>
      </AboutContainer>
      <CardDeck cards={cards} width={width} />
      {/* 
        // @ts-ignore */}
      <ScrollMessage opacity={(1 - scroll / height) * 2 || 0}>
        Scroll Up
      </ScrollMessage>
    </Layout>
  );
};

export default React.memo(Menu, () => false);
