import * as React from "react";
import useTypeWriter from "../../Hooks/useTypeWriter/useTypeWriter";
import styled from "styled-components";
import "../../Styles/TextBox.scss";

const Container = styled.div<{ width: number; height: number }>`
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  height: ${props => props.height}px;
  width: ${props => props.width}px;
`;
const title = "It's a caipirinhas and sad boy music night";

interface Props {
  width: number;
  height: number;
}
const JustSomeThoughtsPreview = ({ width, height }: Props) => {
  const [text, setText] = useTypeWriter("");
  React.useEffect(() => {
    const timeouts: number[] = [];
    const repeatTyping = () => {
      timeouts.push(
        setTimeout(() => {
          setText("", {
            listener: () => {
              timeouts.push(
                setTimeout(() => {
                  setText(title, { listener: repeatTyping });
                }, 2000)
              );
            },
          });
        }, 5000)
      );
    };
    setText(title, { listener: repeatTyping });
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [setText]);
  return (
    <Container width={width} height={height} className="withTypingIndicator">
      {text}
    </Container>
  );
};

export default JustSomeThoughtsPreview;
