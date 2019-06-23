// @flow
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const MenuButton = styled.div`
  position: fixed;
  width: ${props => props.length}px;
  height: ${props => props.length}px;
  top: 20px;
  right: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  z-index: 500;
  opacity: ${props => (props.show ? 1 : 0)};
  transition: opacity 0.75s ease-in-out;
  border: solid rgba(200, 200, 200, 0.6) 2.5px;
  &:hover {
    opacity: 1 !important;
  }
`;

const Button = () => {
  const [showing, setShowing] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShowing(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  return <MenuButton length={20} show={showing} />;
};

export default Button;
