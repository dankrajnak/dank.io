import * as React from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import { Menu } from "../../../../Domain/Menu/Menu";

const Holder = styled.div`
  height: 80vh;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const CARD_HEIGHT = 400;
const CARD_WIDTH = 300;

const Card = styled.div`
  border-radius: 10px;
  height: ${CARD_HEIGHT}px;
  width: ${CARD_WIDTH}px;
  overflow: hidden;
`;

const Title = styled.div`
  width: 300px;
  a {
    color: black !important;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ModernMinimalistMenu: Menu = ({ cards, routeProps }) => (
  <>
    <Holder>
      <div>
        <h1>I'm not scared enough</h1>
        <p>Just a bunch of flocks and flick</p>
      </div>
    </Holder>

    {cards.map(card => (
      <Holder>
        <Link to={card.link}>
          <Card>
            <card.background
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
            ></card.background>
          </Card>
        </Link>
        <Title>
          <Link to={card.link} style={{ width: 300 }}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </Link>
        </Title>
      </Holder>
    ))}
  </>
);

export default ModernMinimalistMenu;
