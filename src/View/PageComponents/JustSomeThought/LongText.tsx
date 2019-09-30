import * as React from "react";
import useTypeWriter, {
  DEFAULT_TYPE_CONFIG,
} from "../../Hooks/useTypeWriter/useTypeWriter";
import TypeBoxContainer from "./TypeBoxContainer";
import Vector2d from "../../../Domain/Vector/Vector2d";

const longTextText: string = new Array(10000)
  .fill("Emily can't pick anything. ")
  .join("");

const LongText = (props: { width: number }) => {
  const [text, setText] = useTypeWriter("");
  React.useEffect(() => {
    setText(longTextText, {
      typeConfig: {
        typeDelay: {
          base: DEFAULT_TYPE_CONFIG.typeDelay.base / 3,
          variance: DEFAULT_TYPE_CONFIG.typeDelay.variance,
        },
        mistakeRealizeDelay: DEFAULT_TYPE_CONFIG.mistakeRealizeDelay,
        mistakeProbability: DEFAULT_TYPE_CONFIG.mistakeProbability / 2,
      },
    });
  }, [setText]);
  return (
    <TypeBoxContainer
      pos={new Vector2d(0, 0)}
      width={props.width}
      className="withTypingIndicator"
    >
      <div style={{ fontSize: ".8rem", lineHeight: ".8rem" }}>{text}</div>
    </TypeBoxContainer>
  );
};

export default LongText;
