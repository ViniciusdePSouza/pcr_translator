import * as Checkbox from "@radix-ui/react-checkbox";
import { styled } from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.2rem;
  justify-content: center;

  max-height: 30rem;
  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.COLORS.GRAY_50} transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.COLORS.GRAY_50};
    border-radius: 4px;
  }

  margin: 1.6rem 0;
  padding: 1.2rem 0.8rem;
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

export const CheckboxRoot = styled(Checkbox.Root)`
  button {
    all: unset;
  }

  background-color: ${({ theme }) => theme.COLORS.WHITE_100};
  min-width: 2.5rem;
  height: 2.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px ${({ theme }) => theme.COLORS.GRAY_600};

  &:hover {
    background-color: ${({ theme }) => theme.COLORS.GRAY_100};
  }
`;

export const CheckboxIndicator = styled(Checkbox.CheckboxIndicator)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 15px;
  color: ${({ theme }) => theme.COLORS.PRIMARY_700};
`;

export const CheckboxLabel = styled.label`
  color: ${({ theme }) => theme.COLORS.PRIMARY_500};
  font-size: 1.2rem;
  font-weight: 700;
`;

export const SectionText = styled.h2`
  width: 100%;
  color: ${({ theme }) => theme.COLORS.GRAY_600};
  text-align: center;
  font-size: 1.6rem;
  font-weight: 700;
`;

export const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 1.2rem;

  button {
    all: unset;

    display: flex;
    align-items: center;
    justify-content: center;

    margin-bottom: -2.3rem;

    cursor: pointer;
    background-color: ${({ theme }) => theme.COLORS.PRIMARY_500};
    border-top-right-radius: 0.4rem;
    border-bottom-right-radius: 0.4rem;

    width: 25px;
    height: 25px;

    border: 2.5px solid ${({ theme }) => theme.COLORS.PRIMARY_500};
    transition: background 0.2s;

    &:hover {
      background-color: ${({ theme }) => theme.COLORS.PRIMARY_700};
    }
  }
`;

export const ExhibitionCustomFieldsContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;

  max-height: 15rem;
  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.COLORS.GRAY_600} transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.COLORS.GRAY_600};
    border-radius: 4px;
  }
`;

export const CustomFieldsCard = styled.span`
  padding: 0.4rem 0.8rem;

  border-radius: 4px;
  border: 2px solid ${({ theme }) => theme.COLORS.WHITE_100};
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};

  font-size: 1.2rem;
  font-weight: 700;
`;
