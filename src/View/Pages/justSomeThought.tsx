import * as React from "react";
import useTypeWriter from "../Hooks/useTypeWriter/useTypeWriter";
import MenuLayout from "../Layout/MenuLayout";
import Vector2d from "../../Domain/Vector/Vector2d";
import styled from "styled-components";
import useFullScreen from "../Hooks/useFullScreen";

const TypeBoxContainer = styled.div<{ pos: Vector2d; width: number }>`
  font-size: 1rem;
  position: absolute;
  width: ${props => props.width}px;
  top: ${props => props.pos.y}px;
  left: ${props => props.pos.x}px;
  :after {
    content: "|";
    font-weight: 400;
    animation: blink 500ms ease-in-out infinite alternate;
  }
  @keyframes blink {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

interface TypeBoxProps {
  textToType: string;
  width: number;
  pos: Vector2d;
}

export const TypeBox = ({ textToType, width, pos }: TypeBoxProps) => {
  const [text, setText] = useTypeWriter();
  React.useEffect(() => {
    setText(textToType, {
      listener: () => {
        setTimeout(() => setText(""), 2000);
      },
    });
  }, [setText, textToType]);

  return text.length ? (
    <TypeBoxContainer pos={pos} width={width}>
      {text}
    </TypeBoxContainer>
  ) : (
    <div />
  );
};

const TheThoughts: string[] = [
  "I want desperately to be interesting",
  "but I'm not sure how to be anymore",
  "and honestly, maybe making this whole site is my attempt to prove to myself that I can make something nice",
  "because it's difficult to make something nice",
  "and doing difficult things is interesting",
  "Again and again, though, I end up searching for soething to say",
  "I'm not interesting to me anymore",
  "I have nothing to say",
  "Maybe I favor self-deprication because it indicates that I've struggled with something and therefore have something to express",
  "I make shit up because I'm wholly uninteresting",
  "I can't make good art",
  "I'm not an artist and calling myself that is just silly",
  "Fuck me, make a fucking website and write some uncomfortably personal things and call it art",
  "I have nothing to say",
  "and nothing to contribute",
  "What makes me feel secure?",
  "Am I just looking to feel insecure because the only art I know how to make is a cry for help?",
  "Is this supposed to be fulfilling?",
];

const JustSomeThoughts = () => {
  const [boxes, setBoxes] = React.useState<React.ReactNode[]>([]);
  const [thoughtIndex, setThoughtIndex] = React.useState(0);
  const [width, height, flash] = useFullScreen();

  React.useEffect(() => {
    setTimeout(() => {
      const textWidth = 200 + Math.random() * 500;
      setBoxes(bs =>
        bs.concat([
          <TypeBox
            key={TheThoughts[thoughtIndex]}
            textToType={TheThoughts[thoughtIndex]}
            width={textWidth}
            pos={
              new Vector2d(
                Math.random() * (width - textWidth),
                Math.random() * (height - 200)
              )
            }
          />,
        ])
      );
      setThoughtIndex(s => (s + 1) % TheThoughts.length);
    }, 2000);
  }, [height, thoughtIndex, width]);

  if (flash) {
    return flash;
  }

  return <MenuLayout color="black">{boxes}</MenuLayout>;
};

export default JustSomeThoughts;
