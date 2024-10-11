import { styled } from "styled-components";
import { Tabs } from "@radix-ui/themes";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-width: 100vw;
`;

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

  background-color: ${({ theme }) => theme.COLORS.PRIMARY};

  color: ${({ theme }) => theme.COLORS.WHITE_100};
  font-size: 1.6rem;
  font-weight: 700;

  &[data-state="active"] {
    border-bottom: 3px solid ${({ theme }) => theme.COLORS.SECONDARY};

  }
`;

export const TabContent = styled(Tabs.Content)`
  padding: 1.2rem 2.4rem;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;
export const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.COLORS.RED};
  font-size: 16px;
  font-weight: 400;
  margin-top: 0.8rem;
`;
