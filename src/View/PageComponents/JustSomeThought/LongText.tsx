import * as React from "react";
import useTypeWriter, {
  DEFAULT_TYPE_CONFIG,
} from "../../Hooks/useTypeWriter/useTypeWriter";
import styled from "styled-components";

const SPEECH = "I have of late but wherefore I know not, lost all my mirth.";
const longTextText: string = new Array(10000).fill(SPEECH).join("");

const Container = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: 0.8rem;
  line-height: 0.8rem;
`;

const LongText = () => {
  const [text, setText] = useTypeWriter("");
  React.useEffect(() => {
    setText(longTextText, {
      typeConfig: {
        typeDelay: {
          // Type really fast.
          base: DEFAULT_TYPE_CONFIG.typeDelay.base / 5,
          variance: DEFAULT_TYPE_CONFIG.typeDelay.variance / 2,
        },
        // Still pause the same amount for mistakes, but make them less often
        mistakeRealizeDelay: DEFAULT_TYPE_CONFIG.mistakeRealizeDelay,
        mistakeProbability: DEFAULT_TYPE_CONFIG.mistakeProbability / 2,
      },
    });
  }, [setText]);

  return <Container className="withTypingIndicator">{text}</Container>;
};

export default LongText;
