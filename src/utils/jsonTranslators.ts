import { EmailBatchResponseProps } from "@/@types";

export function jsonToEmailBatchObj(
  emailBatchArray: EmailBatchResponseProps[]
) {
  const checkedEmailArray = emailBatchArray.map((item) => {
    const checkedEmail = {
      emailAddress: item.address,
      status: item.status,
      sub_status: item.sub_status,
    };

    return checkedEmail;
  });
  return checkedEmailArray;
}