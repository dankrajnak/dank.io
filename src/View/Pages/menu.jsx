// @flow
import React from "react";
import styled from "styled-components";
import SEO from "../Utility/seo";
import Card from "../UI/Card/Card.jsx";
import TheCoolestOne from "../Components/DoublePendulums/TheCoolestOne";

const Background = styled.div`
  background-color: ${props => props.color};
  width: 100%;
  height: 100%;
`;

const CardHolder = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  height: 100%;
  & > div {
    margin: 0 30px;
  }
`;

const Menu = () => (
  <>
    <SEO title="Menu" />
    <CardHolder>
      <Card
        background={<Background color="red" />}
        title="This is the title"
        description="This is the description"
      />
      <Card
        background={<Background color="blue" />}
        title="Card 2"
        description="This is the description"
      />
      <Card
        background={<Background color="blue" />}
        title="Card 2"
        description="This is the description"
      />
      <Card
        background={<TheCoolestOne width={300} height={300} />}
        title="Card 2"
        description="This is the description"
      />
    </CardHolder>
  </>
);

export default Menu;
