// @flow
import React from "react";
import styled from "styled-components";
// import Hamburger from "../Images/hamburger.svg";

const MenuButton = styled.div`
  position: fixed;
  width: ${props => props.length}px;
  height: ${props => props.length}px;
  top: 20px;
  right: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  z-index: 500;
  border: solid rgba(200, 200, 200, 0.6) 2.5px;
  &:hover {
    background: rgba(255, 255, 255, 0.7);
  }
`;

const Button = () => <MenuButton length={20} />;

export default Button;
