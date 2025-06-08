# Email-Gated Access Setup Guide

This guide will help you set up the email-gated access system that requires users to enter their email before accessing any tools. The system prevents duplicate entries and tracks user access patterns.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Student Tools Users" or any name you prefer
4. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)
   - Example: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
   - ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## Step 2: Set up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Delete the default code and paste the code from `google-apps-script/newsletter-collector.gs`
4. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual spreadsheet ID
5. Save the project (Ctrl+S or Cmd+S)
6. Name your project (e.g., "Student Tools Access")

## Step 3: Deploy the Web App

1. In Google Apps Script, click "Deploy" > "New deployment"
2. Click the gear icon next to "Type" and select "Web app"
3. Set the following:
   - **Description**: Student Tools Access Gate
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click "Deploy"
5. Copy the web app URL (it will look like: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`)

## Step 4: Update the Frontend Code

1. Open `src/contexts/AuthContext.tsx`
2. Find the line with `const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';`
3. Replace `YOUR_SCRIPT_ID` with your actual script ID from step 3

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. You should see the email gate screen
3. Enter a test email and click "Access Tools"
4. Check your Google Sheet to see if the email was added
5. Try entering the same email again - it should update the access count instead of creating a duplicate

## Google Sheet Structure

The script will automatically create a sheet named "Student Tool Users" with the following columns:

- **Email**: The user's email address
- **First Access**: When they first accessed the tools
- **Last Access**: Their most recent access time
- **Access Count**: How many times they've accessed the tools
- **Source**: Where they accessed from (e.g., "student-tools-access")
- **Status**: Account status (Active by default)

## Features

### Email Gate Features:
- ✅ Beautiful, animated login screen
- ✅ Email validation
- ✅ Loading states and error handling
- ✅ Mobile responsive design
- ✅ Persistent login (localStorage)
- ✅ User profile display with logout option

### Backend Features:
- ✅ Duplicate email prevention
- ✅ Access tracking and analytics
- ✅ Automatic timestamp recording
- ✅ Source tracking
- ✅ Error handling
- ✅ User statistics functions

### User Experience:
- ✅ One-time email entry
- ✅ Persistent sessions
- ✅ Clean logout functionality
- ✅ User profile in navigation
- ✅ Smooth animations throughout

## How It Works

1. **First Visit**: User sees the email gate screen
2. **Email Entry**: User enters their email to access tools
3. **Validation**: Email is validated and sent to Google Sheets
4. **Access Granted**: User gains access to all tools
5. **Persistent Session**: Email is stored locally for future visits
6. **Return Visits**: Returning users bypass the gate (access count incremented)
7. **Logout**: Users can logout to clear their session

## Duplicate Prevention Logic

- **New Email**: Creates new row with access count = 1
- **Existing Email**: Updates last access time and increments access count
- **No Duplicates**: Each email appears only once in the spreadsheet

## User Analytics

The Google Sheet provides valuable insights:
- Total number of users
- User access patterns
- Most active users (by access count)
- User acquisition over time
- Source tracking for marketing analysis

## Troubleshooting

### Common Issues:

1. **"Script not found" error**: Make sure you've deployed the web app and copied the correct URL
2. **Permission denied**: Ensure the web app is set to "Anyone" access
3. **Emails not appearing**: Check that the spreadsheet ID is correct in the script
4. **CORS errors**: This is normal with Google Apps Script - the integration uses `no-cors` mode
5. **Login not persisting**: Check browser localStorage and ensure no errors in console

### Testing the Script:

You can test the Google Apps Script directly:
1. In the script editor, select the `testAddUser` function
2. Click the "Run" button
3. Check your Google Sheet for the test email

## Security Notes

- The Google Apps Script runs with your permissions
- Only email addresses are collected (no passwords or personal data)
- The sheet is private to your Google account
- Sessions are stored locally in the browser
- You can revoke access anytime by undeploying the web app

## Customization Options

### Email Gate Customization:
- Modify the welcome message and branding
- Add additional form fields if needed
- Customize the tool preview list
- Change the color scheme and animations

### Backend Customization:
- Add more tracking fields (location, device, etc.)
- Implement user roles or permissions
- Add email notification triggers
- Create automated reports

## Next Steps

Once set up, you can:
- Monitor user engagement through the Google Sheet
- Export user data for email marketing
- Analyze usage patterns and popular tools
- Set up automated welcome emails
- Create user segments based on access patterns
- Implement premium features for frequent users

## Privacy Compliance

- Update your privacy policy to mention email collection
- Provide clear opt-out instructions
- Consider GDPR compliance if serving EU users
- Implement data retention policies as needed