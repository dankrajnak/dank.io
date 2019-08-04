import React from "react";
import styled from "styled-components";

export const CARD_WIDTH = 300;
export const CARD_HEIGHT = 500;

const Wrapper = styled.div`
  width: ${CARD_WIDTH}px;
  div:hover {
    cursor: pointer;
  }
`;

const CardWrapper = styled.div.attrs<{ shadowAmount: number }>(
  ({ shadowAmount }) => ({
    style: {
      boxShadow: `0 ${shadowAmount * 8}px
  ${shadowAmount * 10}px 0 rgba(100, 100, 100, 0.5)`,
    },
  })
)`
  position: relative;
  border-radius: 0;

  transition: box-shadow 0.2s ease-in-out;
  &:hover {
    box-shadow: 0 8px 10px 0 rgba(100, 100, 100, 0.5);
  }
  height: ${CARD_HEIGHT}px;
  overflow: hidden;
`;

const TitleHolder = styled.div`
  margin-top: 20px;
  color: #444;
  padding: 0px 10px;
  height: 50px;
  background: white;
  text-align: right;
`;

const Description = styled.div`
  font-size: 0.8rem;
`;
const BackgroundHolder = styled.div`
  height: 100%;
  width: 100%;
`;

export interface Props {
  title: string;
  description: React.ReactNode;
  background: React.ReactNode;
  shadowAmount?: number | null;
}

const Card = (props: Props) => {
  //Calculate shadow amount
  let shadow = 1;
  if (props.shadowAmount != null) {
    shadow = Math.min(Math.max(0, props.shadowAmount), 1);
  }
  return (
    <Wrapper title={"Go to " + props.title}>
      {/* 
      // @ts-ignore */}
      <CardWrapper shadowAmount={shadow}>
        <BackgroundHolder>{props.background}</BackgroundHolder>
      </CardWrapper>
      <TitleHolder>
        {props.title}
        <Description>{props.description}</Description>
      </TitleHolder>
    </Wrapper>
  );
};

export default Card;
