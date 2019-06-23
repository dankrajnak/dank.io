// @flow
import React from "react";
import styled from "styled-components";
import useScrollAmount from "../../Hooks/useScrollAmount";
import Card, { type Props as CardProps } from "../Card/Card";

type Props = {
  cards: CardProps[],
  width: number,
};

const CardDeckHolder = styled.div`
  display: flex;
  position: relative;
  & > div {
    margin: 0 30px;
  }
`;

const CardHolder = styled.div`
  transform: translate(${props => props.dx}px, 0px);
`;

const CardDeck = (props: Props) => {
  const scroll = useScrollAmount(false);
  return (
    <CardDeckHolder>
      {props.cards.map((card, i) => {
        const dx = (i * props.width) / 5;
        return (
          <CardHolder dx={dx} key={i}>
            <Card
              {...card}
              shadowAmount={(props.cards.length - i) * (scroll / props.width)}
            />
          </CardHolder>
        );
      })}
    </CardDeckHolder>
  );
};
export default CardDeck;
