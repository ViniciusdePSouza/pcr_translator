import { CandidatesProps } from "@/@types";
import { createRollUpList, getRollUpListsRecords, insertRecordOnRollUpList } from "@/services/PCR/rollupService";

export async function fetchPcrRecords(
  listCode: string,
  fields: string[],
  sessionId: string,
  service: string = "candidates"
) {
  try {
    const response = await getRollUpListsRecords(listCode, fields, sessionId, service);

    return response!.data;
  } catch (error: any) {
    throw Error(error.message);
  }
}

export async function createListonPcrSystem(
  userName: string,
  description: string,
  memo: string,
  sessionId: string
) {
  try {
    const response = await createRollUpList(
      {
        userName,
        description,
        memo,
      },
      sessionId
    );

    return response.RollupCode;
  } catch (error: any) {
    throw Error(error.message);
  }
}

export async function populatePcrList(
  candidates: CandidatesProps[],
  sessionId: string,
  rollUpCode: string
) {
  try {
    const reqArray = candidates.map((candidate) =>
      insertRecordOnRollUpList(rollUpCode, sessionId, candidate.CandidateId)
    );
    await Promise.all(reqArray);
  } catch (error: any) {
    throw Error(error.message);
  }
}