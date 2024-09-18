import { styled } from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  > label {
    width: 100%;
    font-size: 1.6rem;
    font-weight: 700;
    text-align: start;
    color: ${({ theme }) => theme.COLORS.WHITE_100};
    margin-bottom: .8rem;
  }
`;

export const CustomTextArea = styled.textarea`
  all: unset;
  width: 100%;
  height: 150px;

  background-color: ${({ theme }) => theme.COLORS.WHITE_100};

  border-radius: 8px;
  border: none;

  color: ${({ theme }) => theme.COLORS.PRIMARY};
  font-size: 1.2rem;
  font-weight: 900;

  padding: 0.8rem;

  overflow-wrap: break-word;
  white-space: pre-wrap;
  word-break: break-word;
`;
