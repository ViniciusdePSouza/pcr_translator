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
import { ReactElement, useEffect, useState } from "react";
import { defaultTheme } from "../styles/theme/default";
import { CheckCircle, Warning } from "phosphor-react";
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
  CompanyGenerated,
  positionsFields,
} from "../utils/constants";
import {
  CandidateGenerated,
  LoginApiResponseType,
  PositionsGenerated,
  SelectOptionsProps,
} from "@/@types";
import { SingleValue } from "react-select";
import { getRollUpListsRecords } from "@/services/PCR/rollupService";
import { useUser } from "../hooks/userContext";
import { useRouter } from "next/navigation";
import {
  updateCandidate,
  updateRecord,
} from "@/services/PCR/candidatesService";

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
  const [secondaryButtonText, setSecondaryButtonText] = useState("");
  const [triggerSecondaryFunction, setTriggerSecondaryFunction] = useState(
    () => () => {}
  );
  const [modalIcon, setModalIcon] = useState<ReactElement | null>(null);

  const { user, saveUser, signOut, checkExpiredToken } = useUser();
  const navigator = useRouter();

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

  const isCandidate = (record: any): record is CandidateGenerated =>
    "CandidateId" in record;

  const isPosition = (record: any): record is PositionsGenerated =>
    "JobId" in record;

  function handleWhichSheetToRead(
    selectedOption: SingleValue<SelectOptionsProps>
  ) {
    if (selectedOption) setRange(selectedOption.value);
  }

  function defineWarmingModalProps(
    message: string,
    buttonText: string,
    functionToTrigger: () => void,
    icon: ReactElement | null,
    secondaryButtonText?: string,
    secondaryFunctionsToTrigger?: () => void
  ) {
    setErrorMessage(message);
    setButtonText(buttonText);
    setShowModal(true);
    setTriggerFunction(() => () => functionToTrigger());
    if (secondaryButtonText && secondaryFunctionsToTrigger) {
      setSecondaryButtonText(secondaryButtonText);
      setTriggerSecondaryFunction(() => () => secondaryFunctionsToTrigger());
    }
    setModalIcon(icon);
  }

  function saveUserOnStorage(user: LoginApiResponseType) {
    localStorage.setItem("@pcr-translator:user", JSON.stringify(user));
    saveUser(user);
  }

  async function fetchPcrRecords(
    listCode: string,
    sessionId: string,
    fields: string[],
    service: string
  ) {
    try {
      const response = await getRollUpListsRecords(
        listCode,
        fields,
        sessionId,
        service
      );

      if (!response)
        throw new Error("No records found, please try another rollup list Id");

      return response.data;
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  async function getSheets(spreadsheetId: string) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/getsheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spreadsheetId,
        }),
      });

      const jsonResponse = await response.json();

      const options = jsonResponse.map((sheet: any) => {
        return {
          value: sheet.properties.title,
          label: sheet.properties.title,
        };
      });

      setOptions(options);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  function extractAndTransformCustomFields(body: Record<string, any>) {
    const customFieldsBody: Record<string, any> = {};
    const transformedCustomFields: { FieldName: string; Value: string[] }[] =
      [];

    Object.keys(body).forEach((key) => {
      if (key.startsWith("C* ")) {
        customFieldsBody[key] = body[key];
        if (body[key]) {
          transformedCustomFields.push({
            FieldName: key.replace("C* ", ""),
            Value: body[key].split(" | "),
          });
        }
        delete body[key];
      }
    });

    return { transformedCustomFields };
  }

  async function handleGenerateSpreadSheetForm({
    spreadsheetName,
    folderLink,
    targetListCode,
  }: ManageSpreadsheetSchemaType) {
    try {
      setIsLoading(true);
      if (!targetListCode || !folderLink || !spreadsheetName)
        throw new Error("Fields are required");

      const fieldsToFetch = fieldsToUse;

      if (fieldsToFetch.length === 0) {
        throw new Error("Please select fields to fetch from the list");
      }

      if (
        customFieldsForSpreadsheet.length > 0 &&
        !customFieldsForSpreadsheet.some((field) =>
          [
            "Candidate.CustomFields",
            "Company.CustomFields",
            "Positions.CustomFields",
          ].includes(field)
        )
      ) {
        switch (radioValue) {
          case "Candidates":
            fieldsToFetch.push("Candidate.CustomFields");
            break;
          case "Companies":
            fieldsToFetch.push("Company.CustomFields");
            break;
          case "Positions":
            fieldsToFetch.push("Position.CustomFields");
            break;
          default:
            break;
        }
      }

      const response = await fetchPcrRecords(
        targetListCode,
        user.SessionId,
        fieldsToFetch,
        radioValue
      );

      if (response.Results.length === 0)
        throw new Error("No records found, please try another rollup list Id");

      const records = response.Results;
      const match = folderLink.match(/folders\/(.*?)\?/);
      const folderId = match?.[1];

      if (!folderId) {
        throw new Error(
          "Folder not found. Please make sure you have the correct folder link"
        );
      }

      records.forEach((item: any, index: number) => {
        switch (radioValue) {
          case "Candidates":
            let companyName;
            let companyId;
            if (item.Candidate.Company) {
              companyName = item.Candidate.Company.CompanyName ?? "";
              companyId = item.Candidate.Company.CompanyId ?? "";
            }
            if (companyId) item.Candidate.CompanyId = companyId;

            if (companyName) item.Candidate.CompanyName = companyName;

            const customFields = item.Candidate.CustomFields;

            if (customFields) {
              const customFieldsMap = new Map(
                item.Candidate.CustomFields.map(
                  (field: { FieldName: string; Value: string[] }) => [
                    field.FieldName.toLowerCase(),
                    field.Value.join(" | "),
                  ]
                )
              );

              customFieldsForSpreadsheet.forEach((fieldName) => {
                const key = fieldName.toLowerCase();
                const formattedKey = `C* ${fieldName}`;

                item.Candidate[formattedKey] = customFieldsMap.get(key) ?? "";
              });
            }

            delete item.Candidate.CustomFields;
            delete item.Candidate.Company;

            break;
          case "Companies":
            const customFieldsCompanies = item.Company.CustomFields;
            let annualRevenue = "";

            if (item.Company.AnnualRevenue) {
              const currencyCode =
                typeof item.Company.AnnualRevenue.CurrencyCode === "string"
                  ? item.Company.AnnualRevenue.CurrencyCode
                  : "";

              const value =
                typeof item.Company.AnnualRevenue.Value === "number"
                  ? item.Company.AnnualRevenue.Value.toString()
                  : "";

              annualRevenue = `${currencyCode} => ${value}`;
            }

            if (customFieldsCompanies) {
              const customFieldsMap = new Map(
                item.Company.CustomFields.map(
                  (field: { FieldName: string; Value: string[] }) => [
                    field.FieldName.toLowerCase(),
                    field.Value.join(" | "),
                  ]
                )
              );

              customFieldsForSpreadsheet.forEach((fieldName) => {
                const key = fieldName.toLowerCase();
                const formattedKey = `C* ${fieldName}`;

                item.Company[formattedKey] = customFieldsMap.get(key) ?? "";
              });
            }

            delete item.Company.CustomFields;
            item.Company.AnnualRevenue = annualRevenue;

            break;
          case "Positions":
            let companyNamePosition;

            if (item.Position.Company) {
              companyNamePosition = item.Position.Company.CompanyName ?? "";
            }

            const customFieldsPositions = item.Position.CustomFields;

            let maxSalary = "";
            let minSalary = "";

            if (item.Position.MaxSalary) {
              maxSalary = `${item.Position.MaxSalary.CurrencyCode} => ${item.Position.MaxSalary.Value}`;
            }
            if (item.Position.MinSalary) {
              minSalary = `${item.Position.MinSalary.CurrencyCode} => ${item.Position.MinSalary.Value}`;
            }

            if (customFieldsPositions) {
              const customFieldsMap = new Map(
                item.Position.CustomFields.map(
                  (field: { FieldName: string; Value: string[] }) => [
                    field.FieldName.toLowerCase(),
                    field.Value.join(" | "),
                  ]
                )
              );

              customFieldsForSpreadsheet.forEach((fieldName) => {
                const key = fieldName.toLowerCase();
                const formattedKey = `C* ${fieldName}`;

                item.Position[formattedKey] = customFieldsMap.get(key) ?? "";
              });
            }

            item.Position.MaxSalary = maxSalary;
            item.Position.MinSalary = minSalary;
            item.Position.CompanyName = companyNamePosition;
            delete item.Position.CustomFields;
            delete item.Position.Company;

            break;

          default:
            break;
        }
      });

      const formattedRecords = records.map((record: any) => {
        switch (radioValue) {
          case "Candidates": {
            const formattedRecord: any = {
              CandidateId: record.Candidate.CandidateId,
              FirstName: record.Candidate.FirstName,
              LastName: record.Candidate.LastName,
              CompanyName: record.Candidate.CompanyName,
              CompanyId: record.Candidate.CompanyId,
              Title: record.Candidate.Title,
              City: record.Candidate.City,
              State: record.Candidate.State,
              PostalCode: record.Candidate.PostalCode,
              Country: record.Candidate.Country,
              MobilePhone: record.Candidate.MobilePhone,
              HomePhone: record.Candidate.HomePhone,
              WorkPhone: record.Candidate.WorkPhone,
              EmailAddress: record.Candidate.EmailAddress,
            };

            customFieldsForSpreadsheet.forEach((fieldName) => {
              const formattedKey = `C* ${fieldName}`;
              formattedRecord[formattedKey] = record.Candidate[formattedKey];
            });

            return formattedRecord;
          }

          case "Companies": {
            const formattedRecord: any = {
              CompanyId: record.Company.CompanyId,
              CompanyName: record.Company.CompanyName,
              Address: record.Company.Address,
              City: record.Company.City,
              State: record.Company.State,
              PostalCode: record.Company.PostalCode,
              Country: record.Company.Country,
              Phone: record.Company.Phone,
              EmailWWWAddress: record.Company.EmailWWWAddress,
              Industry: record.Company.Industry,
              Specialty: record.Company.Specialty,
              AnnualRevenue: record.Company.AnnualRevenue,
              Details: record.Company.Details,
              CustomFields: record.Company.CustomFields,
            };

            customFieldsForSpreadsheet.forEach((fieldName) => {
              const formattedKey = `C* ${fieldName}`;
              formattedRecord[formattedKey] = record.Company[formattedKey];
            });

            return formattedRecord;
          }
          case "Positions": {
            const formattedRecord: any = {
              JobId: record.Position.JobId,
              PositionId: record.Position.PositionId,
              Status: record.Position.Status,
              CompanyName: record.Position.CompanyName,
              Title: record.Position.JobTitle,
              ClientJobTitle: record.Position.ClientJobTitle,
              Industry: record.Position.Industry,
              Specialty: record.Position.Specialty,
              City: record.Position.City,
              State: record.Position.State,
              Country: record.Position.Country,
              MinYearsExp: record.Position.MinYearsExp,
              MaxYearsExp: record.Position.MaxYearsExp,
              MaxSalary: record.Position.MaxSalary,
              MinSalary: record.Position.MinSalary,
              FeePercentage: record.Position.FeePercentage,
              Keywords: record.Position.Keywords,
              DatePosted: record.Position.DatePosted,
              WhyOpen: record.Position.WhyOpen,
              Department: record.Position.Department,
              UserName: record.Position.UserName,
            };

            customFieldsForSpreadsheet.forEach((fieldName) => {
              const formattedKey = `C* ${fieldName}`;
              formattedRecord[formattedKey] = record.Position[formattedKey];
            });

            return formattedRecord;
          }
        }
      });

      const body = {
        records: formattedRecords,
        folderId,
        spreadsheetName,
      };

      const responseData = await fetch("/api/sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const responseJson = await responseData.json();
      const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${responseJson.spreadsheetId}/edit`;

      if (responseData.ok) {
        defineWarmingModalProps(
          "Congratulations, your spreadsheet was successfully generated! Check it out on your google drive",
          "See Spreadsheet",
          () => {
            setShowModal(false);
            window.open(spreadsheetUrl, "_blank");
          },
          <CheckCircle size={40} color={defaultTheme.COLORS.PRIMARY_500} />,
          "Close",
          () => setShowModal(false)
        );
      } else {
        throw Error(responseJson.message);
      }
    } catch (error: any) {
      defineWarmingModalProps(
        error.message,
        "Ok",
        () => setShowModal(false),
        <Warning size={32} color={defaultTheme.COLORS.PRIMARY_700} />
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function updatePerson(
    record: CandidateGenerated | CompanyGenerated | PositionsGenerated,
    sessionId: string
  ) {
    const body: Record<string, any> = {};
    let idToUse;
    let service;

    Object.entries(record).forEach(([key, value]) => {
      body[key] = value ?? "";
    });

    if (isCandidate(record)) {
      if (!record.CandidateId)
        throw new Error(
          "Please insert a CandidateId column, only with that we can correctly update the data in pcr system"
        );

      if (record.CompanyName) {
        body.Company = {
          CompanyId: record.CompanyId,
          CompanyName: record.CompanyName,
        };
      }

      const { transformedCustomFields } = extractAndTransformCustomFields(body);

      body.CustomFields = transformedCustomFields;

      delete body.CompanyName;
      delete body.CompanyId;

      idToUse = record.CandidateId;
      service = "candidatesV2";
    } else if (isPosition(record)) {
      if (!record.JobId)
        throw new Error(
          "Please insert a JobId column, only with that we can correctly update the data in pcr system"
        );

      const arrayMinSalary = body.MinSalary.split(" => ");
      const arrayMaxSalary = body.MaxSalary.split(" => ");
      const companyObj = {
        CompanyId: 0,
        CompanyName: record.CompanyName,
      };

      if (record.CompanyName) {
        body.Company = companyObj;
      }

      body.MinSalary = {
        CurrencyCode: arrayMinSalary[0],
        Value: arrayMinSalary[1],
      };
      body.MaxSalary = {
        CurrencyCode: arrayMaxSalary[0],
        Value: arrayMaxSalary[1],
      };

      const { transformedCustomFields } = extractAndTransformCustomFields(body);

      body.CustomFields = transformedCustomFields;

      idToUse = record.JobId;
      service = "positionsV2";
    } else {
      let annualRevenue;
      if (!record.CompanyId)
        throw new Error(
          "Please insert a company id column, only with that we can correctly update the data in pcr system"
        );

      if (record.AnnualRevenue) {
        annualRevenue = record.AnnualRevenue.split(" => ");

        body.AnnualRevenue = {
          CurrencyCode: annualRevenue[0],
          Value: Number(annualRevenue[1]),
        };
      } else {
        delete body.AnnualRevenue;
      }

      const { transformedCustomFields } = extractAndTransformCustomFields(body);

      body.CustomFields = transformedCustomFields;
      idToUse = record.CompanyId;
      service = "companiesV2";
    }

    try {
      const response = await updateRecord(
        sessionId,
        body,
        Number(idToUse),
        service!
      );

      return response;
    } catch (error: any) {
      throw error.message;
    }
  }

  async function updateAllRecords(
    records: CandidateGenerated[] | CompanyGenerated[] | PositionsGenerated[],
    sessionId: string
  ) {
    try {
      const reqArray = records.map((records) =>
        updatePerson(records, sessionId)
      );
      await Promise.all(reqArray);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async function handleReadSpreadsheetForm({
    spreadsheetUrl,
  }: ManageSpreadsheetSchemaType) {
    try {
      setIsLoading(true);

      if (!spreadsheetUrl) throw new Error("Spreadsheet Url is missing");

      const match = spreadsheetUrl.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      const spreadsheetId = match?.[1];

      const data = await fetch("/api/readsheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spreadsheetId,
          range,
        }),
      });

      const dataJson = await data.json();

      if (dataJson.message) throw Error(dataJson.message);

      await updateAllRecords(dataJson, user.SessionId);

      if (data.ok) {
        defineWarmingModalProps(
          "Congratulations, your spreadsheet was successfully generated! Check it out on your google drive",
          "OK",
          () => setShowModal(false),
          <CheckCircle size={40} color={defaultTheme.COLORS.PRIMARY_500} />
        );
      } else {
        throw Error(dataJson.message);
      }
    } catch (error: any) {
      defineWarmingModalProps(
        error.message ?? "Something went wrong please try again later",
        "Ok",
        () => setShowModal(false),
        <Warning size={32} color={defaultTheme.COLORS.PRIMARY_700} />
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const subscription = watch((value) => {
      const spreadsheetUrl = value.spreadsheetUrl;
      if (spreadsheetUrl) {
        const match = spreadsheetUrl.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        const spreadsheetId = match?.[1];
        if (spreadsheetId) {
          getSheets(spreadsheetId);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

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
