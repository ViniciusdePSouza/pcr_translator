import { pcrApi } from "../api";

export async function getPositionsById(
  jobId: string,
  fields: string[],
  sessionId: string
) {
  const resource = `/positions`;
  const query = `Query=PositionId+eq+${jobId}`;
  const fieldsParam = `Fields=${fields.join(",")}`;
  const headers = {
    Authorization: `Bearer ${sessionId}`,
    "Content-Type": "application/json",
  };

  try {
    const url = `${resource}?${query}&${fieldsParam}`;

    const response = await pcrApi.get(url, {
      headers,
    });
    return response;
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
}

export async function updatePositions(sessionId: string, jobId: string, html: string) {
  const resource = `/positions`;
  const headers = {
    Authorization: `Bearer ${sessionId}`,
    "Content-Type": "application/json",
  };
  const body = {
    JobDescription: html
  }
  const url = `${resource}/${jobId}`;

  try {
    const response = await pcrApi.put(url, body, {
      headers,
    });

    return response;
  } catch (error: any) {
    throw Error(error.response.data.errors);
  }
}