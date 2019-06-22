// @flow
import React, { type Node } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative
  border-radius: 10px;
  box-shadow: 0 ${props => props.shadowAmount * 8}px ${props =>
  props.shadowAmount * 10}px 0 rgba(100, 100, 100, 0.5);
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
  background-color: rgba(255, 255, 255, 0.3);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  font-family: ${props => props.theme.text.fontFamily};
`;

const BackgroundHolder = styled.div`
  flex-grow: 1;
`;

export type Props = {
  title: string,
  description: string,
  background: Node,
  shadowAmount?: ?number,
};

const Card = (props: Props) => {
  //Calculate shadow amount;
  let shadow = 1;
  if (props.shadowAmount != null) {
    shadow = Math.min(Math.max(0, props.shadowAmount), 1);
  }
  return (
    <Wrapper shadowAmount={shadow}>
      <Content>
        <TitleHoder>
          <h3>{props.title}</h3>
          <p>{props.description}</p>
        </TitleHoder>
        <BackgroundHolder>{props.background}</BackgroundHolder>
      </Content>
    </Wrapper>
  );
};

export default Card;
