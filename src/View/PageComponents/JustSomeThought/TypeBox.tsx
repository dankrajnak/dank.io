import * as React from "react";
import Vector2d from "../../../Domain/Vector/Vector2d";
import useTypeWriter, {
  SetText,
} from "../../Hooks/useTypeWriter/useTypeWriter";
import TypeBoxContainer from "./TypeBoxContainer";

interface TypeBoxProps {
  textToType: string;
  width: number;
  pos: Vector2d;
  unType?: boolean;
  onFinish?: (setText: SetText) => void;
}

const TypeBox = ({
  textToType,
  width,
  pos,
  unType,
  onFinish,
}: TypeBoxProps) => {
  const [text, setText] = useTypeWriter();
  React.useEffect(() => {
    setText(textToType, {
      listener: () => {
        setTimeout(() => {
          if (unType) {
            setText("", {
              listener: () => onFinish && onFinish(setText),
            });
          }
        }, 2000);
      },
    });
  }, [onFinish, setText, textToType, unType]);

  return text.length ? (
    <TypeBoxContainer pos={pos} width={width} className="withTypingIndicator">
      {text}
    </TypeBoxContainer>
  ) : (
    <div />
  );
};

export default TypeBox;
