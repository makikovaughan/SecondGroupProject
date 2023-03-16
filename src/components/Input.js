import styled from "styled-components";

const Input = styled.input`
  width: 35%;
  height: 61px;
  background: #708d81;
  border: 2px solid #001427;
  border-radius: 15px;
  color: #fffbd0;
  text-align: center;
  type: ${({ tp }) => tp};
  font-size: 3vw;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 300;
  font-size: 26px;
  line-height: 30px;
  text-align: center;
  margin-top: 3rem;
  &::placeholder {
    color: #fffbd0;
    font-size: 3vw;
  }
  &:hover {
    background-color: #acb992;
  }
`;

export default Input;
