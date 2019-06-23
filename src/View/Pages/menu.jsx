// @flow
import React from "react";
import styled from "styled-components";
import Layout from "../Layout/Layout";
import SEO from "../Utility/seo";
import { type Props as CardProps } from "../UI/Card/Card.jsx";
import TheCoolestOne from "../Components/DoublePendulums/TheCoolestOne";
import CardDeck from "../UI/CardDeck/CardDeck.jsx";
import useFullScreen from "../Hooks/useFullScreen";

const Background = styled.div`
  background-color: ${props => props.color};
  width: 100%;
  height: 100%;
`;

const cards: CardProps[] = [
  {
    background: <TheCoolestOne width={300} height={600} />,
    title: "This is the title",
    description: "This is the description",
    shadowAmount: 0.2,
  },
  {
    background: <Background color="blue" />,
    title: "Card 2",
    description: "This is the description of Card 2",
  },
  {
    background: <Background color="yellow" />,
    title: "Card 2",
    description: "This is the description of Card 2",
  },
  {
    background: <Background color="green" />,
    title: "Card 2",
    description: "This is the description of Card 2",
  },
  {
    background: <Background color="blue" />,
    title: "Card 2",
    description: "This is the description of Card 2",
  },
];

const FullScreenContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const CardDeckHolder = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Menu = () => {
  const [width] = useFullScreen();

  return (
    <Layout>
      <SEO title="Menu" />
      <FullScreenContainer>
        <CardDeckHolder>
          <CardDeck cards={cards} width={width} />
        </CardDeckHolder>
      </FullScreenContainer>
    </Layout>
  );
};

export default Menu;
