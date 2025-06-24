import {
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  CheckboxWrapper,
  CustomFieldsCard,
  ExhibitionCustomFieldsContainer,
  InputWrapper,
  SectionText,
  Wrapper,
} from "./styles";

import { CheckIcon } from "@radix-ui/react-icons";
import { Plus } from "phosphor-react";
import { useState } from "react";
import { CustomInput } from "../CustomInput";
import { GenericModal } from "../GenericModal";
import { defaultTheme } from "@/app/styles/theme/default";

interface SelectFieldsProps {
  radioValue: string;
  fieldsToUse: string[];
  fieldsModel: string[];
  customFieldsForSpreadsheet: string[];
  showSelectFieldsModal: boolean;
  singleSelect?: boolean;
  setShowSelectFieldsModal: React.Dispatch<React.SetStateAction<boolean>>;
  setFieldsToUse: React.Dispatch<React.SetStateAction<string[]>>;
  setCustomFieldsForSpreadsheet: React.Dispatch<React.SetStateAction<string[]>>;
}

export function SelectFields({
  fieldsToUse,
  fieldsModel,
  customFieldsForSpreadsheet,
  showSelectFieldsModal,
  singleSelect = false,
  setShowSelectFieldsModal,
  setFieldsToUse,
  setCustomFieldsForSpreadsheet,
}: SelectFieldsProps) {
  const [customFieldInput, setCustomFieldInput] = useState<string>();

  return (
    <GenericModal.Root show={showSelectFieldsModal}>
      <GenericModal.Content>
        <SectionText>PCR Default Fields</SectionText>
        <Wrapper>
          {fieldsModel.map((field, index) => (
            <CheckboxWrapper key={index}>
              <CheckboxRoot
                id={`c-${index}`}
                checked={fieldsToUse.includes(field)}
                onCheckedChange={(value: boolean) => {
                  if (value) {
                    setFieldsToUse(
                      singleSelect ? [field] : [...fieldsToUse, field]
                    );
                  } else {
                    setFieldsToUse(
                      fieldsToUse.filter((item) => item !== field)
                    );
                  }
                }}
              >
                <CheckboxIndicator>
                  <CheckIcon color={defaultTheme.COLORS.PRIMARY_500}/>
                </CheckboxIndicator>
              </CheckboxRoot>
              <CheckboxLabel htmlFor={`c-${index}`}>
                {field
                  .replace("Candidate.", "")
                  .replace("Company.", "")
                  .replace("Position.", "")
                  .replaceAll("_", " ")}
              </CheckboxLabel>
            </CheckboxWrapper>
          ))}
        </Wrapper>

        <SectionText>Custom Fields</SectionText>

        <InputWrapper>
          <div style={{ width: "90%" }}>
            <CustomInput
              placeholder={"Type your desired custom fields"}
              label={""}
              onChange={(e) => setCustomFieldInput(e.target.value)}
              value={customFieldInput}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (!customFieldInput) return;

              if (singleSelect) {
                setFieldsToUse([]);
                setCustomFieldsForSpreadsheet([customFieldInput]);
              } else {
                setCustomFieldsForSpreadsheet((state) => [
                  ...state,
                  customFieldInput,
                ]);
              }

              setCustomFieldInput("");
            }}
          >
            <Plus size={24} color={defaultTheme.COLORS.WHITE_100}/>
          </button>
        </InputWrapper>

        <ExhibitionCustomFieldsContainer>
          {customFieldsForSpreadsheet &&
            customFieldsForSpreadsheet.map((field, index) => (
              <CustomFieldsCard key={index}>{field}</CustomFieldsCard>
            ))}
        </ExhibitionCustomFieldsContainer>

        <GenericModal.Actions
          primaryButtonText={"Confirm"}
          primaryButtonClick={() => setShowSelectFieldsModal(false)}
          secondaryButtonText={"Cancel"}
          secondaryButtonClick={() => {
            setShowSelectFieldsModal((state) => !state);
          }}
        />
      </GenericModal.Content>
    </GenericModal.Root>
  );
}
