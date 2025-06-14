import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handlerGoogleSheet(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    return res.status(500).json({ message: "Missing Google credentials" });
  }

  const { spreadsheetName, records, folderId } = req.body;

  if (!spreadsheetName || !Array.isArray(records) || records.length === 0 || !folderId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
      ],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const drive = google.drive({ version: "v3", auth });

    const { data: spreadsheet } = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: spreadsheetName,
        },
      },
    });

    const spreadsheetId = spreadsheet.spreadsheetId ?? "";
    const headers = Object.keys(records[0]);
    const rows = records.map((item: Record<string, any>) => Object.values(item));

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      requestBody: {
        values: [headers, ...rows],
      },
    });

    await drive.files.update({
      fileId: spreadsheetId,
      addParents: folderId,
      removeParents: "root",
    });

    res.status(200).json({ spreadsheetId });
  } catch (error: any) {
    const message =
      error?.response?.data?.error?.message ||
      error?.message ||
      "Unknown error occurred while accessing Google APIs";
    res.status(500).json({ message });
  }
}