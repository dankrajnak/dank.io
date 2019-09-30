import * as React from "react";
import useTypeWriter from "../../Hooks/useTypeWriter/useTypeWriter";

const JustSomeThoughtsPreview = () => {
  const textToType = React.useRef("Uncomfortably personal text");
  const [text, setText] = useTypeWriter("");
  React.useEffect(() => {
    setText(textToType.current);
  }, [setText]);
  return <div className="useTypingIndicator">{text}</div>;
};

export default JustSomeThoughtsPreview;
