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

export interface ActivitiesProps {
  CandidateId: number
  ActivityId: number
  UserName: string
  ActivityDate: string
  ActivityType: string
  ActivityResult: any
}

export interface ActivitySummary  {
  candidateid: number;
  "first name": string;
  "last name": string;
  [key: string]: any;
};

export interface ActivitiesAccumulatorProps {
  ActivityType: string
  count: number
}

export type ActivitiesMap = Record<string, ActivitiesAccumulatorProps>;

export interface PositionsGenerated {
  JobId: string;
  PositionId: string
  MinYearsExp: string;
  MaxYearsExp: string;
  MaxSalary: string;
  MinSalary: string;
  Keywords: string;
  DatePosted: string;
  City: string;
  State: string;
  Country: string;
  FeePercentage: string;
  WhyOpen: string
  Department: string
  Status: string;
  EstimatedFee: string;
  UserName: string;
  ClientJobTitle: string;
  SearchType: string;
  BaseSalaryMin: string;
  BaseSalaryMax: string;
  OnTargetEarnings: string;
  Recruiter: string;
  CompanyName: string
}

export interface CandidateGenerated {
  CandidateId: string;
  FirstName: string;
  LastName: string;
  Title: string;
  City: string;
  State: string;
  PostalCode: string;
  Social_Linkedin: string;
  WorkEmail: string;
  hireEZ_Company: string;
  Work_Mobile: string;
  Home_Email: string;
  CompanyName: string
  CompanyId: string
}
