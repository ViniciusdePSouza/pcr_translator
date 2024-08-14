import { getRollUpListsRecords } from "@/services/PCR/rollupService";

export async function fetchPcrRecords(
  listCode: string,
  fields: string[],
  sessionId: string
) {
  try {
    const response = await getRollUpListsRecords(listCode, fields, sessionId);

    return response!.data;
  } catch (error: any) {
    alert(error);
  }
}