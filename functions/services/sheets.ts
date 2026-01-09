import { getGoogleAuthToken } from '../utils/google-auth';

export class SheetsService {
    private email: string;
    private privateKey: string;
    private spreadsheetId: string;

    constructor(email: string, privateKey: string, spreadsheetId: string) {
        this.email = email;
        this.privateKey = privateKey.replace(/\\n/g, '\n');
        this.spreadsheetId = spreadsheetId;
    }

    private async getAccessToken(): Promise<string> {
        return getGoogleAuthToken(
            this.email,
            this.privateKey,
            ['https://www.googleapis.com/auth/spreadsheets']
        );
    }

    /**
     * Append a row of data to the sheet.
     * @param values Array of strings/numbers to append as a row
     * @param range The range to append to (default: 'Sheet1!A1')
     */
    async appendRow(values: (string | number | boolean)[], range: string = 'Sheet1!A1'): Promise<boolean> {
        try {
            const token = await this.getAccessToken();
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(this.spreadsheetId)}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    values: [values]
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error(`Sheets API Error: ${response.status} ${errText}`);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error appending to sheet:', error);
            return false;
        }
    }
}
