import * as React from "react";
import { Menu } from "../../../../Domain/Menu/Menu";
import styled from "styled-components";
import { Link } from "gatsby";

const CARD_WIDTH = 500;
const CARD_HEIGHT = 500;

const MenuHolder = styled.div`
  width: 80%;
  margin: 40px auto;
`;

const CardHolder = styled.div`
  width: ${CARD_WIDTH}px;
  margin: auto;
  margin-bottom: 80px;
  border-radi &:hover {
    border: solid black 1px;

    .card-title,
    .card-description {
      text-decoration: underline;
      text-decoration-color: #777;
    }
  }

  a {
    text-decoration: none;
  }
`;

const CardTitle = styled.h1`
  font-size: 1rem;
  margin-bottom: 2px;
  color: #444;
`;

const CardDescription = styled.div`
  color: #444;
`;

const SimpleMenu: Menu = ({ cards }) => (
  <MenuHolder>
    {cards.map(card => (
      <CardHolder>
        <Link to={card.link} style={{ textDecoration: "none" }}>
          <card.background width={CARD_WIDTH} height={CARD_HEIGHT} />
        </Link>
        <Link to={card.link}>
          <CardTitle className="card-title">{card.title}</CardTitle>
          <CardDescription className="card-description">
            {card.description}
          </CardDescription>
        </Link>
      </CardHolder>
    ))}
  </MenuHolder>
);

export default SimpleMenu;
