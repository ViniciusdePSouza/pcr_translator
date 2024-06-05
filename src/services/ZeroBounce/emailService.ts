import { jsonToEmailBatchObj } from "@/utils/jsonTranslators";
import { zeroBounceApi } from "../api";

export async function validateEmail(apiKey: String, emailsBatch: string[]) {
  const resource = "/validatebatch";
  const emailsBatchObj = emailsBatch.map((email) => {
    return {
      email_address: email,
    };
  });
  const body = {
    api_key: apiKey,
    email_batch: emailsBatchObj,
  };

  try {
    const response = await zeroBounceApi.post(resource, body);

    const checkedEmails = jsonToEmailBatchObj(response.data.email_batch);
    return checkedEmails;
  } catch (error: any) {
    console.log(error);
  }
}
