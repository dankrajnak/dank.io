import * as React from "react";
import useTypeWriter from "../../Hooks/useTypeWriter/useTypeWriter";
import styled from "styled-components";
import "../../Styles/TextBox.scss";

const Container = styled.div`
  color: black;
  font-size: 2rem;
  font-weight: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
const title = "Uncomfortably personal.";
const JustSomeThoughtsPreview = () => {
  const [text, setText] = useTypeWriter("");
  React.useEffect(() => {
    const repeatTyping = () => {
      setTimeout(() => {
        setText(title, { listener: repeatTyping });
      }, 5000);
    };
    setText(title, { listener: repeatTyping });
  }, [setText]);
  return <Container className="withTypingIndicator">{text}</Container>;
};

export default JustSomeThoughtsPreview;
