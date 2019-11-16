import * as React from "react";
import styled from "styled-components";

const Fader = styled.div<{ visible: boolean }>`
  position: fixed;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 1s ease;
`;

export default Fader;
