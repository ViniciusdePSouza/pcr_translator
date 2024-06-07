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

  console.log(body);
  try {
    const url = resource;
    const response = await pcrApi.post(url, body, {
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
    });

    return response.data
  } catch (error) {
    console.log(error);
  }
}
