import { getGoogleAuthToken } from '../utils/google-auth';

export class CalendarService {
    private email: string;
    private privateKey: string;
    private calendarId: string;

    constructor(email: string, privateKey: string, calendarId: string = 'yusmel88cubano@icloud.com') {
        this.email = email;
        this.privateKey = privateKey.replace(/\\n/g, '\n');
        this.calendarId = calendarId;
    }

    private async getAccessToken(): Promise<string> {
        return getGoogleAuthToken(
            this.email,
            this.privateKey,
            ['https://www.googleapis.com/auth/calendar']
        );
    }

    async isAvailable(startTime: string, endTime: string): Promise<boolean> {
        try {
            const token = await this.getAccessToken();
            const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId)}/events?timeMin=${encodeURIComponent(startTime)}&timeMax=${encodeURIComponent(endTime)}&singleEvents=true&maxResults=1`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error(`Calendar API Error: ${response.status} ${await response.text()}`);
                return false; // Fail safe
            }

            const data: any = await response.json();
            const events = data.items || [];
            return events.length === 0;
        } catch (error) {
            console.error('Error checking availability:', error);
            return false;
        }
    }

    async getBusySlots(days: number = 7): Promise<any[]> {
        const start = new Date();
        const end = new Date();
        end.setDate(end.getDate() + days);

        try {
            const token = await this.getAccessToken();
            const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId)}/events?timeMin=${start.toISOString()}&timeMax=${end.toISOString()}&singleEvents=true&orderBy=startTime`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errText = await response.text();
                // console.error(`Calendar API Error: ${response.status} ${errText}`);
                return [];
            }

            const data: any = await response.json();
            return (data.items || []).map((event: any) => ({
                start: event.start?.dateTime || event.start?.date,
                end: event.end?.dateTime || event.end?.date,
                summary: "Ocupado"
            }));
        } catch (error) {
            console.error("Calendar Error:", error);
            return [];
        }
    }

    async createBooking(title: string, startTime: string, endTime: string, description: string): Promise<string | null> {
        try {
            const token = await this.getAccessToken();
            const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId)}/events`;

            const event = {
                summary: `[REBECA] ${title}`,
                description: description,
                start: { dateTime: startTime },
                end: { dateTime: endTime },
                colorId: '5'
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error(`Calendar Create Error: ${response.status} ${errText}`);
                return null;
            }

            const data: any = await response.json();
            return data.htmlLink || null;
        } catch (error) {
            console.error('Error creating booking:', error);
            return null;
        }
    }
}
