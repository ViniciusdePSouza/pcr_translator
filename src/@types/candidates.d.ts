export type CandidateFields = 
  | 'CandidateId'
  | 'CompanyId'
  | 'FirstName'
  | 'LastName'
  | 'Title'
  | 'Address'
  | 'City'
  | 'State'
  | 'PostalCode'
  | 'PostalCodeExtension'
  | 'County'
  | 'Country'
  | 'HomePhone'
  | 'MobilePhone'
  | 'WorkPhone'
  | 'CurrentSalary'
  | 'DesiredSalary'
  | 'DateEntered'
  | 'EmailAddress'
  | 'Industry'
  | 'Status'
  | 'HasResume?'
  | 'DefaultCurrency'
  | 'UserName';

  export interface CandidateProps {
    FirstName: string;
    LastName: string;
    EmailAddress: string;
    UserName: string;
    Title: string
  }
