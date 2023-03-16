import styled from "styled-components";

const StyledHome = styled.div`
  margin-top: 10rem;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  & h1 {
    color: #001427;
    font-family: "Roboto";
    font-style: normal;
    font-weight: 300;
  }
  & select {
    border: 2px solid #001427;
    border-radius: 0.8rem;
    background: #708d81;
    font-family: "Roboto";
    color: #fffbd0;
    font-family: "Roboto";
    width: 329px;
    height: 50px;
    font-size: 2rem;
    text-align: center;
  }
  & p {
    color: #bf0603;
    font-family: "Roboto";
  }
`;

export default StyledHome;
