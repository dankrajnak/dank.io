// @flow
import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { useEffect } from "react";

const HelpWrapper = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  z-index: 5;
  color: white;
  font-weight: 200;
  font-size: 0.8rem;
  transition: opacity 1s ease;
  opacity: ${props => props.opacity};
`;
type Props = {
  children: string,
  time?: ?number,
};

const Help = (props: Props) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), props.time || 3000);
    return () => clearTimeout(timeout);
  }, [props.time]);
  return <HelpWrapper opacity={visible ? 1 : 0}>{props.children}</HelpWrapper>;
};

export default Help;
