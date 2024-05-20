import { CandidateFields } from "@/@types";

export function validateFields(fields: string[]): fields is CandidateFields[] {
    const validFields: CandidateFields[] = [
      "CandidateId",
      "CompanyId",
      "FirstName",
      "LastName",
      "Title",
      "Address",
      "City",
      "State",
      "PostalCode",
      "PostalCodeExtension",
      "County",
      "Country",
      "HomePhone",
      "MobilePhone",
      "WorkPhone",
      "CurrentSalary",
      "DesiredSalary",
      "DateEntered",
      "EmailAddress",
      "Industry",
      "Status",
      "HasResume?",
      "DefaultCurrency",
      "UserName",
    ];
  
    return fields.every((field) =>
      validFields.includes(field as CandidateFields)
    );
  }