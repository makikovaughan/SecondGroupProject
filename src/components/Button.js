import styled from "styled-components";

const Button = styled.button`
  width: ${({ w }) => w};
  height: ${({ h }) => h};
  margin: ${({ mg }) => mg};
  border: 2px solid #001427;
  border-radius: 2rem;
  background: #708d81;
  color: #fffbd0;
  font-size: 20px;
  &:hover {
    cursor: pointer;
    background-color: #acb992;
  }
`;

export default Button;
