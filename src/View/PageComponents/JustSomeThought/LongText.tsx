import * as React from "react";
import useTypeWriter from "../../Hooks/useTypeWriter/useTypeWriter";
import styled from "styled-components";

const SPEECH = `I have of late but wherefore I know not, lost all my mirth, forgone
all customs of exercise, and indeed it goes so heavily with my disposition that 
this goodly frame, the Earth, seems to me a sterile promontory.  This most excellent
canopy, look you, this brave o'erhanging firmament, this majestic roof fretted with
golden fire, why it appears to me no other than a foul and pestilent congregation of vapours.
What a piece of work is a man?  How noble in reason? How infinite in faculty?  In form
and moving, how express and admirable?  In action, how like an angel, in apprehension,
how like a god?  The beauty of the world, the paragon of animals, and yet, to me, what is this
quintessence of dust?  I know man still means something to me. `;
const longTextText: string = new Array(100).fill(SPEECH).join("");

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const LongText = () => {
  const [text, setText] = useTypeWriter("");
  React.useEffect(() => {
    setText(longTextText);
  }, [setText]);

  return <Container className="withTypingIndicator">{text}</Container>;
};

export default LongText;
