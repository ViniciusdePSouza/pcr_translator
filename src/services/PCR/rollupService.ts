import { url } from "inspector";
import { pcrApi } from "../api";

interface RollupListBodyProps {
  userName: string;
  description: string;
  memo: string;
}
export async function createRollUpList(
  { userName, description, memo }: RollupListBodyProps,
  sessionId: string
) {
  const resource = "/Rolluplists";

  const body = {
    UserName: userName,
    Description: description,
    Memo: memo,
  };

  try {
    const url = resource;
    const response = await pcrApi.post(url, body, {
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getRollUpListsRecords(
  listCode: string,
  fieldParams: string[],
  sessionId: string
) {
  const resource = "/CandidatesV2/RollupLists";
  const queryParam = "?Query=";
  const code = `Code%20eq%20${listCode}`;
  let fieldParamsUrl = "&Fields=";
  let fields = "";

  fieldParams.forEach((fieldParams) => {
    fields = fields + `${fieldParams}%2C%20`;
  });

  const url = resource + queryParam + code + fieldParamsUrl + fields;

  try {
    const response = await pcrApi.get(url, {
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
    });

    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function insertRecordOnRollUpList(
  listCode: string,
  sessionId: string,
  candidateId: number
) {
  const resource = "/candidates/rolluplists";
  const listCodeParam = `/${listCode}`;
  const candidateIdParam = `/${candidateId}`;

  const url = resource + listCodeParam + candidateIdParam;

  const body = {};

  try {
    const response = await pcrApi.post(url, body, {
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
    });
    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
  }
}
