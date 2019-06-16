// @flow
import React, { type Node } from "react";
import styled from "styled-components";

type Props = {
  title: string,
  description: string,
  background: Node,
};

const Wrapper = styled.div`
  position: relative
  border-radius: 10px;
  box-shadow: 0 4px 5px 0 rgba(100, 100, 100, 0.5);
  width: 300px;
  height: 500px;
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const TitleHoder = styled.div`
  height: 90px;
  padding: 10px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

const BackgroundHolder = styled.div`
  flex-grow: 1;
`;

const Card = (props: Props) => (
  <Wrapper>
    <Content>
      <TitleHoder>
        <h3>{props.title}</h3>
      </TitleHoder>
      <BackgroundHolder>{props.background}</BackgroundHolder>
    </Content>
  </Wrapper>
);

export default Card;
