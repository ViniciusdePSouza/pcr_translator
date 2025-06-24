"use client";
import { Header } from "@/components/Header";
import {
  Container,
  Content,
  ErrorMessage,
  Form,
  RadioGroupIndicator,
  RadioGroupItem,
  RadioGroupRoot,
  RadioWrapper,
  StyledSelect,
  TabContent,
  TabList,
  TabRoot,
  TabTrigger,
} from "./styles";
import { WarningModal } from "@/components/WarningModal";
import { useState } from "react";
import { defaultTheme } from "../styles/theme/default";
import { Warning } from "phosphor-react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { CustomInput } from "@/components/CustomInput";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SelectFields } from "@/components/SelectFields";
import {
  candidatesFields,
  companiesFields,
  positionsFields,
} from "../utils/constants";
import { SelectOptionsProps } from "@/@types";
import { SingleValue } from "react-select";

export default function GoogleSheetTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [triggerFunction, setTriggerFunction] = useState(() => () => {});
  const [activeTab, setActiveTab] = useState("generate");
  const [radioValue, setRadioValue] = useState<string>("Candidates");
  const [showSelectFieldsModal, setShowSelectFieldsModal] = useState(false);
  const [fieldsToUse, setFieldsToUse] = useState<string[]>([]);
  const [customFieldsForSpreadsheet, setCustomFieldsForSpreadsheet] = useState<
    string[]
  >([]);
  const [options, setOptions] = useState<SelectOptionsProps[]>([]);
  const [range, setRange] = useState("");

  const manageSpreadsheetSchema = yup.object({
    targetListCode: yup
      .string()
      .test(
        "targetListCode-required",
        "Target List Code is a required field",
        function (value) {
          if (activeTab === "generate") {
            return !!value;
          }
          return true;
        }
      ),
    folderLink: yup
      .string()
      .test("folderLink-required", "Folder Link is required", function (value) {
        if (activeTab === "generate") {
          return !!value;
        }
        return true;
      }),
    spreadsheetName: yup
      .string()
      .test(
        "spreadsheetName-required",
        "Spreadsheet Url is required",
        function (value) {
          if (activeTab === "generate") {
            return !!value;
          }
          return true;
        }
      ),
    spreadsheetUrl: yup
      .string()
      .test(
        "spreadsheetUrl-required",
        "Spreadsheet Url is required",
        function (value) {
          if (activeTab === "update") {
            return !!value;
          }
          return true;
        }
      ),
  });

  type ManageSpreadsheetSchemaType = yup.InferType<
    typeof manageSpreadsheetSchema
  >;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ManageSpreadsheetSchemaType>({
    resolver: yupResolver(manageSpreadsheetSchema),
  });

  function defineCheckBoxOptions(radioValue: string) {
    switch (radioValue) {
      case "Companies":
        return companiesFields;
      case "Positions":
        return positionsFields;
      default:
        return candidatesFields;
    }
  }

  function handleWhichSheetToRead(
    selectedOption: SingleValue<SelectOptionsProps>
  ) {
    if (selectedOption) setRange(selectedOption.value);
  }

  async function handleGenerateSpreadSheetForm({
    spreadsheetName,
    folderLink,
    targetListCode,
  }: ManageSpreadsheetSchemaType) {}

  async function handleReadSpreadsheetForm({
    spreadsheetUrl,
  }: ManageSpreadsheetSchemaType) {}

  const GenerateFormComponent = () => {
    return (
      <Form onSubmit={handleSubmit(handleGenerateSpreadSheetForm)}>
        <RadioGroupRoot
          value={radioValue}
          defaultValue="Candidates"
          aria-label="View density"
          onValueChange={(value) => {
            setFieldsToUse([]);
            setCustomFieldsForSpreadsheet([]);
            setRadioValue(value);
          }}
        >
          <RadioWrapper>
            <RadioGroupItem value="Candidates" id="r1">
              <RadioGroupIndicator />
            </RadioGroupItem>
            <label htmlFor="r1">Candidates</label>
          </RadioWrapper>

          <RadioWrapper>
            <RadioGroupItem value="Companies" id="r2">
              <RadioGroupIndicator />
            </RadioGroupItem>
            <label htmlFor="r2">Companies</label>
          </RadioWrapper>
          <RadioWrapper>
            <RadioGroupItem value="Positions" id="r3">
              <RadioGroupIndicator />
            </RadioGroupItem>
            <label htmlFor="r3">Positions</label>
          </RadioWrapper>
        </RadioGroupRoot>

        <Button
          title={"Select Fields"}
          isLoading={false}
          variant={"TERCIARY"}
          onClick={() => setShowSelectFieldsModal((state) => !state)}
        />

        <SelectFields
          radioValue={radioValue}
          fieldsModel={defineCheckBoxOptions(radioValue)}
          fieldsToUse={fieldsToUse}
          setFieldsToUse={setFieldsToUse}
          showSelectFieldsModal={showSelectFieldsModal}
          setShowSelectFieldsModal={setShowSelectFieldsModal}
          customFieldsForSpreadsheet={customFieldsForSpreadsheet}
          setCustomFieldsForSpreadsheet={setCustomFieldsForSpreadsheet}
        />

        <CustomInput
          placeholder={"Target List Code"}
          label={"Target List Code"}
          {...register("targetListCode")}
        />
        {errors.targetListCode && (
          <ErrorMessage>{errors.targetListCode.message}</ErrorMessage>
        )}
        <CustomInput
          placeholder={"Target List Code"}
          label={"Folder Link"}
          {...register("folderLink")}
        />
        {errors.folderLink && (
          <ErrorMessage>{errors.folderLink.message}</ErrorMessage>
        )}
        <CustomInput
          placeholder={"Target List Code"}
          label={"Spreadsheet Name"}
          {...register("spreadsheetName")}
        />
        {errors.spreadsheetName && (
          <ErrorMessage>{errors.spreadsheetName.message}</ErrorMessage>
        )}
        <Button type={"submit"} title={"Generate"} isLoading={isLoading} />
      </Form>
    );
  };

  const ReadFormComponent = () => {
    return (
      <Form onSubmit={handleSubmit(handleReadSpreadsheetForm)}>
        <CustomInput
          placeholder={"Spreadsheet ID"}
          label={"Spreadsheet link"}
          {...register("spreadsheetUrl")}
        />
        {errors.spreadsheetUrl && (
          <ErrorMessage>{errors.spreadsheetUrl.message}</ErrorMessage>
        )}
        <label>Select the range you want to update</label>
        <StyledSelect
          options={options}
          onChange={(value) =>
            handleWhichSheetToRead(value as SingleValue<SelectOptionsProps>)
          }
          value={options.find((option) => option.value === range)}
        />

        <Button type={"submit"} title={"Update"} isLoading={isLoading} />
      </Form>
    );
  };

  const TabComponent = () => {
    return (
      <TabRoot
        defaultValue="generate"
        value={activeTab}
        onValueChange={(value: string) => setActiveTab(value)}
      >
        <TabList>
          <TabTrigger value="generate" children="Generate Spreadsheet" />
          <TabTrigger value="update" children="Update PCR records" />
        </TabList>

        <TabContent value="generate">
          <GenerateFormComponent />
        </TabContent>
        <TabContent value="update">
          <ReadFormComponent />
        </TabContent>
      </TabRoot>
    );
  };

  return (
    <Container>
      <Header title={"Menu !"} />
      <WarningModal
        showModal={showModal}
        icon={<Warning size={36} color={defaultTheme.COLORS.PRIMARY} />}
        text={errorMessage}
        primaryButtonText={buttonText}
        secondaryButtonText="Cancel"
        onConfirm={triggerFunction}
        onCancel={() => setShowModal(false)}
      />
      <Content>
        <Modal content={<TabComponent />} />
      </Content>
    </Container>
  );
}
