import * as React from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import useSafeLocation from "../Hooks/useSafeLocation";
import "../Styles/MenuButton.scss";

const MenuContainer = styled.div<{ show: boolean; color: string }>`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 500;
  opacity: ${props => (props.show ? 1 : 0.05)};
  transition: opacity 0.75s ease-in-out;
  &:hover {
    opacity: 1 !important;
  }
`;

export type PossibleMenuColors = "white" | "black";

interface ButtonProps {
  color?: PossibleMenuColors;
  fade?: boolean;
}

const Button = ({ color = "white", fade = false }: ButtonProps) => {
  const [showing, setShowing] = React.useState(true);
  const [safeLocation] = useSafeLocation();
  let prevPath = null;
  if (safeLocation) {
    prevPath = safeLocation.pathname;
  }
  React.useEffect(() => {
    if (fade) {
      const timeout = setTimeout(() => setShowing(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [fade]);

  return (
    <MenuContainer color={color} show={showing}>
      <Link
        to="/menu"
        className={`menu-button menu-button-${color}`}
        state={{ prevPath }}
      >
        MENU
      </Link>
    </MenuContainer>
  );
};

export default Button;
