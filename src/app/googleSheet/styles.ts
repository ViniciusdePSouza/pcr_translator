import styled from "styled-components";
import * as Tabs from "@radix-ui/react-tabs";
import Select from "react-select";
import * as RadioGroup from "@radix-ui/react-radio-group";

export const Content = styled.div`
  width: 100%;
  padding: 2.4rem 1.2rem;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.COLORS.GRAY_50};
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-width: 100vw;

  background-color: ${({ theme }) => theme.COLORS.WHITE_100};

  span {
    font-size: 1.8rem;
    font-weight: 400;
    text-align: center;
    color: ${({ theme }) => theme.COLORS.WHITE_100};
    margin-bottom: 1.8rem;
  }
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 18px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
  align-items: center;

  > h1 {
    font-size: 2.4rem;
    font-weight: 700;
    text-align: center;
    color: ${({ theme }) => theme.COLORS.WHITE_100};
    margin-bottom: 1.8rem;
  }

  > label {
    width: 100%;
    text-align: start;
    color: ${({ theme }) => theme.COLORS.WHITE_100};
    font-size: 1.6rem;
    font-weight: 700;
    margin-top: 1.2rem;
    margin-bottom: -1.2rem;
  }
`;

export const TabRoot = styled(Tabs.Root)``;

export const TabList = styled(Tabs.List)`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1.2rem 1.2rem 0 1.2rem;

  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  gap: 8px;

  overflow: scroll;
  scroll-behavior: smooth;

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
`;

export const TabTrigger = styled(Tabs.Trigger)`
  all: unset;
  padding: 0.4rem 1.2rem;

  border-top-right-radius: 4px;
  border-top-left-radius: 4px;

  color: ${({ theme }) => theme.COLORS.WHITE};
  font-size: 1.6rem;
  font-weight: 700;

  &[data-state="active"] {
    border-bottom: 3px solid ${({ theme }) => theme.COLORS.WHITE_100};
  }
`;

export const TabContent = styled(Tabs.Content)`
  padding: 1.2rem 2.4rem;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

export const StyledSelect = styled(Select)`
  width: 40%;
  margin-top: 2rem;
  align-self: flex-start;

  font-size: 1.2rem;

  @media (max-width: 1025px) {
    width: 100%;
  }
`;

export const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.COLORS.RED};
  font-size: 16px;
  font-weight: 400;
  margin-top: 0.8rem;
`;

export const RadioGroupRoot = styled(RadioGroup.Root)`
  display: flex;
  gap: 4rem;

  button {
    all: unset;
  }

  @media (max-width: 400px) {
    flex-direction: column;
    gap: 2rem;
  }

  @media (max-width: 1024px) {
  }
`;

export const RadioGroupItem = styled(RadioGroup.Item)`
  background-color: white;
  width: 25px;
  height: 25px;
  border-radius: 100%;
  box-shadow: 0 2px 10px black;
`;

export const RadioGroupIndicator = styled(RadioGroup.Indicator)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  position: relative;
  background-color: ${({ theme }) => theme.COLORS.WHITE_100};
  border-radius: 50%;

  &::after {
    content: "";
    display: block;
    width: 12px;
    height: 12px;
    background-color: ${({ theme }) => theme.COLORS.PRIMARY_500};
    border-radius: 100%;
  }
`;

export const RadioWrapper = styled.div`
  > label {
    color: ${({ theme }) => theme.COLORS.WHITE_100};
    font-size: 1.6rem;
    line-height: 1;
    padding-left: 1.2rem;
    cursor: pointer;
  }
`;
