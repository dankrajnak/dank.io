import styled from "styled-components";
import Vector2d from "../../../Domain/Vector/Vector2d";
import "../../Styles/TextBox.scss";

const TypeBoxContainer = styled.div<{
  pos: Vector2d;
  width: number;
  color?: string;
}>`
  font-size: 1rem;
  position: absolute;
  width: ${props => props.width}px;
  top: ${props => props.pos.y}px;
  left: ${props => props.pos.x}px;
  color: ${props => props.color || "black"};
`;

export default TypeBoxContainer;
