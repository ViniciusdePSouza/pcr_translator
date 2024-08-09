export type CandidateFields =
  | "CandidateId"
  | "CompanyId"
  | "FirstName"
  | "LastName"
  | "Title"
  | "Address"
  | "City"
  | "State"
  | "PostalCode"
  | "PostalCodeExtension"
  | "County"
  | "Country"
  | "HomePhone"
  | "MobilePhone"
  | "WorkPhone"
  | "CurrentSalary"
  | "DesiredSalary"
  | "DateEntered"
  | "EmailAddress"
  | "Industry"
  | "Status"
  | "HasResume?"
  | "DefaultCurrency"
  | "UserName";

export interface CandidatesProps {
  CandidateId: number;
  Candidate: Candidate;
  status?: string;
  sub_status?: string;
}

export interface Candidate {
  EmailAddress?: string;
  CustomFields?: CustomFieldsProps[];
  FirstName?: string;
  LastName?: string;
}

export interface CustomFieldsProps {
  Action: string;
  FieldName: string;
  Value: any[]
}

export interface CandidatesContextProps {
  candidates: CandidatesProps[];
  saveCandidates: (candidates: CandidatesProps[]) => void
}
