export type LoginFormData = {
  username: string;
  password: string;
  apiKey: string;
  appId: string;
  databaseId: string;
};

export interface CheckEmailsFormData {
  listCode: string;
  description: string;
  memo: string;
  ZBApiKey: string;
}
