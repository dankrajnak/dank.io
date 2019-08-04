import React, { useEffect } from "react";
import styled from "styled-components";
import Layout from "../Layout/Layout";
import SEO from "../Utility/seo";
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  Props as CardProps,
} from "../UI/Card/Card";
import Lorenz from "../Components/Lorenz";
import CardDeck from "../UI/CardDeck/CardDeck";
import useFullScreen from "../Hooks/useFullScreen";
import useScrollAmount from "../Hooks/useScrollAmount";
import ThreeContainer from "../UI/ThreeContainer";
import { start, stop } from "../../Services/Hallway.service";

const Background = styled.div`
  background-color: ${props => props.color};
  width: 100%;
  height: 100%;
`;

const Mute = styled.em`
  font-weight: 200;
`;

const cards = [
  {
    background: <Lorenz width={CARD_WIDTH} height={CARD_HEIGHT} colorful />,
    title: "Homepage",
    description: "Honestly just to impress you",
    link: "/",
  },
  {
    background: (
      // <ThreeContainer
      //   start={start}
      //   stop={stop}
      //   width={CARD_WIDTH}
      //   height={CARD_HEIGHT}
      // />
      <Background name="Hallway" color="lightblue" />
    ),
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
    background: <Background name="THREE" color="lightyellow" />,
    title: "Card 3",
    description: "This is the description of Card 3",
    link: "/nowhere",
  },
  {
    background: <Background name="FOUR" color="lightgreen" />,
    title: "Card 4",
    description: "This is the description of Card 4",
    link: "/nowhere",
  },
  {
    background: <Background name="FIVE" color="lightblue" />,
    title: "Card 5",
    description: "This is the description of Card 5",
    link: "/nowhere",
  },
];

const FullScreenContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const ScrollMessage = styled.div.attrs(props => ({
  style: { opacity: props.opacity },
}))`
  position: fixed;
  bottom: 10%;
  width: 100%;
  text-align: center;
  font-size: small;
  color: #aaa;
`;
const Menu = () => {
  const [width, height] = useFullScreen();
  const scroll = useScrollAmount();
  console.log(scroll, "scroll");
  return (
    <Layout>
      <SEO title="Menu" />
      <FullScreenContainer>
        <CardDeck cards={cards} width={width} />
        <ScrollMessage opacity={(1 - scroll / height) * 2 || 0}>
          Scroll Up
        </ScrollMessage>
      </FullScreenContainer>
    </Layout>
  );
};

export default React.memo(Menu, () => false);
