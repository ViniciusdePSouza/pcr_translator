import { CandidateFields } from "@/@types";
import { pcrApi } from "../api";
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

export async function updateCandidate(
  sessionId: string,
  body: any,
  candidateId: number
) {
  const resource = `/candidatesV2/${candidateId}`;

  try {
    const response = await pcrApi.put(resource, body, {
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
    });
    return response;
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
}

export async function getCandidateActivities(
  candidateId: number,
  sessionId: string,
  page: number = 1,
  startDate?: Date,
  endDate?: Date
) {
  const resource = `/candidates/${candidateId}/activities`;
  const resultsPerPageParam = `?ResultsPerPage=500`;
  const pageParam = `&Page=${page}`;
  let timeInterval = "";
  if (startDate && endDate) {
    const startISO = startDate.toISOString();
    const endISO = endDate.toISOString();
    const query = `Query=ActivityDate ge ${startISO} and ActivityDate le ${endISO}`;
    timeInterval = `&${query.replace(/ /g, "%20")}`;
  }
  const url = resource + resultsPerPageParam + pageParam + timeInterval;

  try {
    const response = await pcrApi.get(url, {
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
    });

    return response.data;
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
}
