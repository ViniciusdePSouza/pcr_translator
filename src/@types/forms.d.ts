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
  description: string;
  memo: string;
  ZBApiKey: string;
}
