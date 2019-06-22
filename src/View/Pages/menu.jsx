// @flow
import React from "react";
import styled from "styled-components";
import Layout from "../Layout/Layout";
import SEO from "../Utility/seo";
import { type Props as CardProps } from "../UI/Card/Card.jsx";
import TheCoolestOne from "../Components/DoublePendulums/TheCoolestOne";
import CardDeck from "../UI/CardDeck/CardDeck.jsx";
import Card from "../UI/Card/Card";

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

const Menu = () => (
  <Layout>
    <SEO title="Menu" />
    <CardDeck cards={cards} />
  </Layout>
);

export default Menu;
