import * as React from "react";
import styled from "styled-components";
import Layout from "../Layout/Layout";
import SEO from "../Utility/seo";
import Lorenz from "../PageComponents/Homepage/Lorenz";
import CardDeck from "../PageComponents/Menu/CardDeck/CardDeck";
import useFullScreen from "../Hooks/useFullScreen";
import useScrollAmount from "../Hooks/useScrollAmount";
import HallwayPreview from "../PageComponents/Hallway/HallwayPreview";
import { Link } from "gatsby";
import PerspectivePreview from "../PageComponents/Menu/PerspectivePreview";
import MetaSpherePreview from "../PageComponents/Menu/MetaSpherePreview";
import JustSomeThoughtsPreview from "../PageComponents/Menu/JustSomeThoughtsPreview";

const Mute = styled.em`
  font-weight: 200;
`;

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
  const [width, height, flash] = useFullScreen();
  const cardWidth = React.useMemo(() => Math.min(500, width * 0.9), [width]);
  const cardHeight = React.useMemo(() => Math.min(500, height * 0.7), [height]);
  const cards = React.useMemo(
    () => [
      {
        background: <Lorenz width={cardWidth} height={cardHeight} colorful />,
        title: "Homepage",
        description: "Just to impress you",
        link: "/",
      },
      {
        background: (
          <PerspectivePreview width={cardWidth} height={cardHeight} />
        ),
        title: "Perspective",
        description: "I spent two fucking days making a square move",
        link: "/perspective",
      },
      {
        background: <HallwayPreview width={cardWidth} height={cardHeight} />,
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
        background: <MetaSpherePreview width={cardWidth} height={cardHeight} />,
        title: "Meta sphere",
        description: "Just go have some fun, kid",
        link: "/metaSphere",
      },
      {
        background: <JustSomeThoughtsPreview />,
        title: "Just Some Thought",
        description: "I just, well, here you go",
        link: "/justSomeThought",
      },
    ],
    [cardHeight, cardWidth]
  );
  const scroll = useScrollAmount();
  if (flash) {
    return flash;
  }
  return (
    <Layout>
      <SEO title="Menu" />
      <AboutContainer>
        <Link to={"/about"}>About</Link>
      </AboutContainer>
      <CardDeck
        cards={cards}
        width={width}
        cardsWidth={cardWidth}
        cardsHeight={cardHeight}
      />
      {/* 
        // @ts-ignore */}
      <ScrollMessage opacity={(1 - scroll / height) * 2 || 0}>
        Scroll Up
      </ScrollMessage>
    </Layout>
  );
};

export default React.memo(Menu, () => false);
