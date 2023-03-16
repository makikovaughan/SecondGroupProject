import React, { useEffect, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import styled from "styled-components";
import Button from "./Button";

const StyledDiv = styled.div`
  height: auto;
  display: flex;
  justify-content: space-around;
`;

const StyledLabel = styled.label`
  padding: 10px;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: space-around;
`;
const AnswerBox = styled.div`
  margin-top: 3rem;
  gap: 10px;
  & img {
    display: inline;
    height: 140px;
    width: 140px;
    border-radius: 3rem;
  }
  & h5 {
    display: inline;
    font-size: 2rem;
  }
  & label {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;
const PTag = styled.p`
  color: #fb4264;
  font-size: 2vw;
  text-shadow: 0 0 3vw #f40a35;
  //
  animation: ${({ g }) => g} 1s ease infinite;
  -moz-animation: ${({ g }) => g} 1.2s ease infinite;
  -webkit-animation: ${({ g }) => g} 1.2s ease infinite;

  @keyframes glow {
    0%,
    100% {
      text-shadow: 0 0 1vw #fa1c16, 0 0 3vw #fa1c16, 0 0 10vw #fa1c16,
        0 0 10vw #fa1c16, 0 0 0.4vw #fed128, 0.5vw 0.5vw 0.1vw #806914;
      color: #fed128;
    }
    50% {
      text-shadow: 0 0 0.5vw #800e0b, 0 0 1.5vw #800e0b, 0 0 5vw #800e0b,
        0 0 5vw #800e0b, 0 0 0.2vw #800e0b, 0.5vw 0.5vw 0.1vw #40340a;
      color: #806914;
    }
  }
`;

const MusicFormCard = (props) => {
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const { options, songs } = props;
  const storedLocal = JSON.parse(localStorage.getItem("userInput"));
  const [glow, setGlow] = useState(false);
  const [store, setStore] = useState(storedLocal.numArtist - 1);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.name);
  };
  const handleReplayClick = () => {
    location.reload();
    setStore(storedLocal.numArtist - 1);
    setIsCorrect(false);
    setSelectedOption("");
  };
  const handleClick = () => {
    if (selectedOption === "") return;
    if (
      selectedOption === options.answers.filter((o) => o.correct)[0].artist.name
    ) {
      setIsCorrect(true);
      return;
    }
    setIsCorrect(false);
    setStore((pre) => pre - 1);
    setGlow(true);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setGlow(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [glow]);
  return (
    <StyledDiv>
      <FlexColumn>
        <PTag g={glow && "glow"}>
          {store + " "} Attempt{store > 1 ? "s" : ""} remaining
        </PTag>
        {songs.map((s) => (
          <ReactAudioPlayer
            key={s.preview_url}
            src={s.preview_url}
            controls
            style={{ width: "30rem" }}
          />
        ))}
        <AnswerBox>
          {options.answers.map((option) => (
            <StyledLabel key={option.artist.name}>
              <input
                type='radio'
                name={option.artist.name}
                value={selectedOption}
                checked={selectedOption === option.artist.name}
                onChange={handleOptionChange}
              />
              <img src={option.artist.images[0].url} />
              <h5>{option.artist.name}</h5>
            </StyledLabel>
          ))}
        </AnswerBox>

        <Button
          w='10.5vw'
          onClick={handleClick}
          disabled={store === 0 || isCorrect}
        >
          Submit
        </Button>
        {store === 0 || isCorrect ? (
          <Button w='10.5vw' onClick={handleReplayClick}>
            Play again
          </Button>
        ) : (
          ""
        )}

        {isCorrect && <h1 style={{ color: "green" }}>You win</h1>}
        {!isCorrect && store === 0 && <h1>You lose</h1>}
      </FlexColumn>
    </StyledDiv>
  );
};

export default MusicFormCard;
