export type LoginFormData = {
  username: string;
  password: string;
  apiKey: string;
  appId: string;
  databaseId: string;
};

export interface CheckEmailsFormData {
  listCode: string;
}

export  interface SelectOptionsProps {
  value: string;
  label: string;
}

export interface CheckEmailsFormDataTrue {
  targetListCode: string;
  description: string;
  memo: string;
}

export interface ActivitiesFormData{
  targetListCode: string
  startDate: string,
  endDate: string,
  sheetName: string,
  folderLink: string
}

export interface CorrectNamesFormData {
  targetListCode: string;
}

export interface ConfigProps {
  apiKeys: {
    zeroBounce: string;
    openAI: string;
  };
  htmlPattern: string;
}
