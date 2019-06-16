// @flow
import React from "react";
import styled from "styled-components";
import Hamburger from "../Images/hamburger.svg";

const MenuButton = styled.div`
  padding: 1px 3px;
  position: fixed;
  top: 20px;
  right: 20px;
  border-radius: 25px;
  opacity: 0.5;
  &:hover {
    opacity: 1 !important;
    cursor: pointer;
  }
  z-index: 500;
  border: solid rgba(0, 0, 0, 0.7) 0.5px;
`;

const Button = () => (
  <MenuButton>
    <Hamburger width={30} height={30} />
  </MenuButton>
);

export default Button;
