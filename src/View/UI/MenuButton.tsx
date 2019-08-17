import * as React from "react";
import styled from "styled-components";

const MenuButton = styled.div<{ show: boolean; color: string }>`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 500;
  opacity: ${props => (props.show ? 1 : 0.05)};
  transition: opacity 0.75s ease-in-out;
  color: ${props => props.color};
  font-weight: 600;
  &:hover {
    opacity: 1 !important;
  }
`;

const Button = ({ color = "white", fade = false }) => {
  const [showing, setShowing] = React.useState(true);

  React.useEffect(() => {
    if (fade) {
      const timeout = setTimeout(() => setShowing(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [fade]);

  return (
    <MenuButton color={color} show={showing}>
      MENU
    </MenuButton>
  );
};

export default Button;
