import { zeroBounceApi } from "../api";

export async function validateEmail(apiKey: String, emailsBatch: string[]) {
  const resource = "/validatebatch";
  const emailsBatchObj = emailsBatch.map((email) => {
    return {
        email_address: email,
    };
  })
  const body = {
    apiKey: apiKey,
    email_batch: emailsBatchObj
  }
  try {
    const response = await zeroBounceApi.post(resource, body)

    console.log(response)
  } catch (error: any) {
    
    console.log(error)
    // if (
    //     error.response.statusText == null ||
    //     error.response.statusText == undefined
    //   ) {
    //     throw Error("Unexpected error try again later ");
    //   }
    //   throw error.response.statusText;
  }
}
