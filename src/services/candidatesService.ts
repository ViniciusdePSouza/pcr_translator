import { CandidateFields } from "@/@types";
import { pcrApi } from "./api";
import { validateFields } from "@/utils/validators";

export async function getCandidates(
  sessionId: string,
  userName: string,
  fieldParams: CandidateFields[],
  page: number,
  resultsPerPage: number
) {
  const resource = "/candidates";
  const queryParam = "?Query=";
  const userNameParam = `UserName+eq+${userName}`;
  let fieldParamsUrl = "&Fields=";
  const resultsPerPageParam = `&ResultsPerPage=${resultsPerPage}`;
  const pageParam = `&Page=${page}`;
  let fields = "";

  fieldParams.forEach((fieldParams) => {
    fields = fields + `${fieldParams}%2C`;
  });

  const url =
    resource +
    queryParam +
    userNameParam +
    resultsPerPageParam +
    fieldParamsUrl +
    fields +
    pageParam;

  try {
    if (!validateFields(fieldParams)) {
      throw new Error("One or more fields are invalid");
    }
    
    const response = await pcrApi.get(url, {
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if (
      error.response.statusText == null ||
      error.response.statusText == undefined
    ) {
      throw Error("Unexpected error try again later ");
    }
    throw error.response.statusText;
  }
}


