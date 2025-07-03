import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handlerReadTable(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { spreadsheetId, range } = req.body;

  if (!spreadsheetId || !range) {
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

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      res.status(404).json({ message: "No data found" });
      return;
    }

    const headers = rows[0];

    const filteredHeaders = headers.filter(
      (header) => !header.startsWith("C* ")
    );

    const data = rows.slice(1).map((row) => {
      return headers.reduce((acc: Record<string, string>, header, index) => {
        acc[header] = row[index] || "";
        return acc;
      }, {});
    });

    res.status(200).json(data);
  } catch (error: any) {
    console.error("Google Sheets error:", error);
    res.status(500).json({
      message: "Erro ao ler dados da planilha",
      error: error.message,
      stack: error.stack,
    });
  }
}
