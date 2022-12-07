// Require google from googleapis package.
import * as dotenv from 'dotenv';
import {google} from 'googleapis';
import { Readable } from 'stream'
import {v4 as uuidv4} from 'uuid';

dotenv.config({path: '../.env'}) // set up .env config

// Require oAuth2 from our google instance.
const { OAuth2 } = google.auth

// createEventObj takes required fields and returns calendar event object
const createEventObj = (title, description, startTime, endTime, interviewerEmail, intervieweeEmail, resumeId) => {
    return  {
        summary: title,
        description: description,
        colorId: 1,
        start: {
            dateTime: startTime,
            timeZone: 'America/New_York',
        },
        end: {
            dateTime:  endTime,
            timeZone: 'America/New_York',
        },
        attendees: [
            {'email': interviewerEmail},
            {'email': intervieweeEmail},
        ],
        reminders: {
            'useDefault': false,
            'overrides': [
                {'method': 'email', 'minutes': 24 * 60},
                {'method': 'popup', 'minutes': 10},
            ],
        },
        conferenceData: {
            createRequest: {
                conferenceSolutionKey: {type: 'hangoutsMeet'},
                requestId: uuidv4(),
            },
        },
        attachments: [
            {
                eventAttachment: {
                    mimeType: "application/pdf",
                    title: "resume",
                    fileUrl: `https://drive.google.com/file/d/${resumeId}/view?usp=drivesdk`,
                }
            }
        ]
    };
}

// CreateCalendarEvent function to create a google Calendar event and returns event id
export const CreateCalendarEvent = async (title, description, startTime, endTime, interviewerEmail, intervieweeEmail, resumeId) => {
   try {
       const oAuth2Client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET)

       // OAuth2 client for Google calendar
       oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })

       // google calender service obj
       const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

       // calender event object
       const event = createEventObj(title, description, startTime, endTime, interviewerEmail, intervieweeEmail, resumeId)

       // insert event
       let eventDetails = await calendar.events.insert({ auth: oAuth2Client, calendarId: "primary", resource: event, conferenceDataVersion: 1,})

       return eventDetails.data.id
   } catch (err) {
        console.log(err)

       return ''
   }
}

// UpdateCalendarEvent function to update existing calendar event given event id.
export const UpdateCalendarEvent = async (eventId, title, description, startTime, endTime, interviewerEmail, intervieweeEmail) => {
    try {
        const oAuth2Client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET)

        // OAuth2 client for Google calendar
        oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })

        // google calender service obj
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

        // calender event object
        const eventObj = createEventObj(title, description, startTime, endTime, interviewerEmail, intervieweeEmail)

        // update event
        const updatedEvent = await calendar.events.update({ auth: oAuth2Client, calendarId: "primary", resource: eventObj, eventId: eventId})

        return updatedEvent.data.id
    } catch (err) {
        console.log(err)
    }
}

export const DeleteCalenderEvent = async (eventId) => {
    try {
        const oAuth2Client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET)

        // OAuth2 client for Google calendar
        oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })

        // google calender service obj
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

        // delete event
        let response = await calendar.events.delete({auth: oAuth2Client, calendarId: "primary", eventId: eventId});
        if (response.data === '') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error deleting event: `, error);
        return 0;
    }
};

export const uploadToGoogleDrive = async (file) => {
    const oAuth2Client = new OAuth2(process.env.CLIENT_ID_DRIVE, process.env.CLIENT_SECRET_DRIVE)

    // OAuth2 client for Google Drive
    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN_DRIVE })

    // google drive service obj
    const driveService = google.drive({version: "v3", auth: oAuth2Client});

    // file metadata
    const fileMetadata = {
        name: file.name,
        parents: ["1TMz4aPQohDmEx8SEeLPhx9RoSBeLeFjb"],
        type: 'anyone',
    };

    // file metadata
    const media = {
        mimeType: file.mimetype,
        body: bufferToStream(file.data),
    };

    // insert file to drive.
    return await driveService.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id",
    });
}

// uploadModifiedFileToGoogleDrive function updates the existing file in the Google Drive given a fileId
export const uploadModifiedFileToGoogleDrive = async (fileId, file) => {
    const oAuth2Client = new OAuth2(process.env.CLIENT_ID_DRIVE, process.env.CLIENT_SECRET_DRIVE)

    // OAuth2 client for Google Drive
    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN_DRIVE })

    // google drive service obj
    const driveService = google.drive({version: "v3", auth: oAuth2Client});

    // file metadata
    const media = {
        mimeType: file.mimetype,
        body: bufferToStream(file.data),
    };

    // update file in drive given fileId.
    return await driveService.files.update({
        fileId: fileId,
        media: media,
    });
}

// bufferToStream takes a buffer and covert to stream
const bufferToStream = (buffer) => {
    const stream = new Readable()
    stream.push(buffer);
    stream.push(null);

    return stream;
}