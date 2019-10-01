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
  color?: string;
  unType?: boolean;
  onFinish?: (setText: SetText) => void;
}

const TypeBox = ({
  textToType,
  width,
  pos,
  unType,
  color,
  onFinish,
}: TypeBoxProps) => {
  const [text, setText] = useTypeWriter();
  React.useEffect(() => {
    let timeout: number;
    setText(textToType, {
      listener: () => {
        timeout = setTimeout(() => {
          if (unType) {
            setText("", {
              listener: () => onFinish && onFinish(setText),
            });
          }
        }, 2000);
      },
    });
    return () => {
      clearTimeout(timeout);
    };
  }, [onFinish, setText, textToType, unType]);

  return text.length ? (
    <TypeBoxContainer
      pos={pos}
      width={width}
      color={color}
      className="withTypingIndicator"
    >
      {text}
    </TypeBoxContainer>
  ) : (
    <div />
  );
};

export default TypeBox;
