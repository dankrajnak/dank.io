// @flow
import React, { useEffect } from "react";
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

const Reporter = ({ name, color }: { name: string, color: string }) => {
  useEffect(() => {
    console.log(name + " mounted");
    return () => console.log(name + " unmounted");
  });
  console.log(name + " rendered");
  return <Background color={color} />;
};

const cards: CardProps[] = [
  {
    background: <Reporter name="ONE" color="red" />,
    title: "Card 1",
    description: "This is the description",
    shadowAmount: 0.2,
  },
  {
    background: <Reporter name="TWO" color="lightblue" />,
    title: "Card 2",
    description: "This is the description of Card 2",
  },
  {
    background: <Reporter name="THREE" color="lightyellow" />,
    title: "Card 3",
    description: "This is the description of Card 3",
  },
  {
    background: <Reporter name="FOUR" color="lightgreen" />,
    title: "Card 4",
    description: "This is the description of Card 4",
  },
  {
    background: <Reporter name="FIVE" color="lightblue" />,
    title: "Card 5",
    description: "This is the description of Card 5",
  },
];

const FullScreenContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const CardDeckHolder = styled.div`
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
