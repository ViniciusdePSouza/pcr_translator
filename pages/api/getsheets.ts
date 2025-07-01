import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handlerGetSheets(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { spreadsheetId } = req.body;

  if (!spreadsheetId) {
    res.status(400).json({ message: "Missing spreadsheetId or range" });
    return;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
      ],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const result = await (await sheets.spreadsheets.get({
      spreadsheetId,
    }))

    res.status(200).json(result.data.sheets);
  } catch (error) {
    console.error("Error fetching spreadsheet data:", error);
    res.status(500).json({ message: "Error fetching spreadsheet data", error });
  }
}

