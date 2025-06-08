# Newsletter Email Collector Setup Guide

This guide will help you set up the newsletter email collector that saves emails to Google Sheets.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Student Tools Newsletter" or any name you prefer
4. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)
   - Example: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
   - ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## Step 2: Set up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Delete the default code and paste the code from `google-apps-script/newsletter-collector.gs`
4. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual spreadsheet ID
5. Save the project (Ctrl+S or Cmd+S)
6. Name your project (e.g., "Newsletter Collector")

## Step 3: Deploy the Web App

1. In Google Apps Script, click "Deploy" > "New deployment"
2. Click the gear icon next to "Type" and select "Web app"
3. Set the following:
   - **Description**: Newsletter Email Collector
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click "Deploy"
5. Copy the web app URL (it will look like: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`)

## Step 4: Update the Frontend Code

1. Open `src/components/Newsletter.tsx`
2. Find the line with `const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';`
3. Replace `YOUR_SCRIPT_ID` with your actual script ID from step 3

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the home page
3. Scroll down to the newsletter section
4. Enter a test email and click "Subscribe"
5. Check your Google Sheet to see if the email was added

## Google Sheet Structure

The script will automatically create a sheet named "Newsletter Subscribers" with the following columns:

- **Email**: The subscriber's email address
- **Timestamp**: When they subscribed
- **Source**: Where they subscribed from (e.g., "student-tools-website")
- **Status**: Subscription status (Active by default)

## Features

- ✅ Duplicate email prevention
- ✅ Email validation
- ✅ Automatic timestamp recording
- ✅ Source tracking
- ✅ Error handling
- ✅ Beautiful UI with animations
- ✅ Mobile responsive design

## Troubleshooting

### Common Issues:

1. **"Script not found" error**: Make sure you've deployed the web app and copied the correct URL
2. **Permission denied**: Ensure the web app is set to "Anyone" access
3. **Emails not appearing**: Check that the spreadsheet ID is correct in the script
4. **CORS errors**: This is normal with Google Apps Script - the integration uses `no-cors` mode

### Testing the Script:

You can test the Google Apps Script directly:
1. In the script editor, select the `testAddSubscriber` function
2. Click the "Run" button
3. Check your Google Sheet for the test email

## Security Notes

- The Google Apps Script runs with your permissions
- Only email addresses are collected (no personal data)
- The sheet is private to your Google account
- You can revoke access anytime by undeploying the web app

## Next Steps

Once set up, you can:
- Export emails from Google Sheets to your email marketing platform
- Set up automated email sequences
- Analyze subscriber growth over time
- Add more fields to collect additional information