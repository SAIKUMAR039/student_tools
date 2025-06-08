# Google Apps Script Testing Guide

## Quick Setup Checklist

Before testing, ensure you've completed these steps:

1. ✅ Created a Google Sheet and copied its ID
2. ✅ Updated the `SPREADSHEET_ID` in your Google Apps Script
3. ✅ Deployed the script as a web app with "Anyone" access
4. ✅ Copied the web app URL

## Method 1: Test Directly in Google Apps Script Editor

### Step 1: Run Built-in Test Functions

1. Open your Google Apps Script project
2. In the script editor, you'll see several test functions available
3. Select one of these functions from the dropdown:

#### Test Function Options:

**`testAddUser()`** - Tests adding a new user
- Select this function from the dropdown
- Click the "Run" button (▶️)
- Check the execution log for results
- Verify the user appears in your Google Sheet

**`testError()`** - Tests error handling
- Select this function from the dropdown  
- Click "Run"
- Should show how the script handles invalid requests

**`getUserStats()`** - Gets user statistics
- Select this function from the dropdown
- Click "Run" 
- Check logs for user count and statistics

### Step 2: Check Execution Logs

1. After running any test, click "View" → "Logs" or press Ctrl+Enter
2. Look for success/error messages
3. Common success indicators:
   ```
   Processing request: {email: "test@example.com", ...}
   Adding new user: test@example.com
   ```

## Method 2: Test the Web App URL Directly

### Step 1: Test GET Request (Health Check)

1. Copy your web app URL
2. Paste it directly into a browser
3. You should see a JSON response like:
   ```json
   {
     "message": "Student Tools API is running",
     "timestamp": "2024-01-15T10:30:00.000Z", 
     "status": "healthy"
   }
   ```

### Step 2: Test POST Request with Postman/Insomnia

If you have API testing tools:

1. **Method**: POST
2. **URL**: Your web app URL
3. **Headers**: `Content-Type: application/json`
4. **Body** (JSON):
   ```json
   {
     "email": "test@example.com",
     "timestamp": "2024-01-15T10:30:00.000Z",
     "source": "manual-test",
     "action": "test"
   }
   ```

## Method 3: Test Through Your Website

### Step 1: Update Your URLs

1. Open `src/contexts/AuthContext.tsx`
2. Replace the placeholder URL with your actual web app URL:
   ```typescript
   const GOOGLE_SCRIPT_URL = 'YOUR_ACTUAL_WEB_APP_URL_HERE';
   ```

3. Open `src/components/Newsletter.tsx`
4. Replace the placeholder URL there too

### Step 2: Test the Email Gate

1. Start your development server: `npm run dev`
2. You should see the email gate screen
3. Enter a test email (e.g., `test@example.com`)
4. Click "Access Tools"
5. Check your Google Sheet for the new entry

### Step 3: Test Duplicate Prevention

1. Clear your browser's localStorage (or use incognito mode)
2. Enter the same email again
3. The access count should increment instead of creating a duplicate

## Method 4: Browser Console Testing

### Step 1: Test with Browser Developer Tools

1. Open your website
2. Press F12 to open developer tools
3. Go to the Console tab
4. Run this test code:

```javascript
// Test the API directly
fetch('YOUR_WEB_APP_URL_HERE', {
  method: 'POST',
  mode: 'no-cors',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'console-test@example.com',
    timestamp: new Date().toISOString(),
    source: 'console-test',
    action: 'test'
  })
})
.then(() => console.log('Request sent successfully'))
.catch(error => console.error('Error:', error));
```

## What to Look For

### ✅ Success Indicators:

**In Google Apps Script Logs:**
- "Processing request: {email: ...}"
- "Adding new user: ..." or "Updating existing user: ..."
- No error messages

**In Google Sheets:**
- New row appears with your test email
- Columns are properly filled:
  - Email
  - First Access (timestamp)
  - Last Access (timestamp) 
  - Access Count (starts at 1)
  - Source
  - Status (Active)

**In Your Website:**
- Email gate accepts the email
- User gains access to tools
- User profile shows in navigation
- No error messages in browser console

### ❌ Error Indicators:

**Common Error Messages:**
- "Spreadsheet not found" → Check your spreadsheet ID
- "Permission denied" → Check web app deployment settings
- "Invalid request format" → Check your request structure
- "Script not found" → Check your web app URL

## Troubleshooting Steps

### If the script isn't working:

1. **Check Spreadsheet ID**:
   - Verify the ID in your script matches your Google Sheet
   - Make sure there are no extra spaces or characters

2. **Check Deployment Settings**:
   - Redeploy the web app if needed
   - Ensure "Execute as: Me" and "Who has access: Anyone"

3. **Check Permissions**:
   - The script may ask for permissions the first time
   - Grant access to Google Sheets when prompted

4. **Check Sheet Creation**:
   - The script should auto-create a "Student Tool Users" sheet
   - If it doesn't exist, check the logs for errors

5. **Test with Simple Data**:
   - Use the built-in test functions first
   - Then test with your website

## Advanced Testing

### Test User Statistics

Run this in the Google Apps Script editor:

```javascript
function testStats() {
  const stats = getUserStats();
  console.log('User Statistics:', stats);
  return stats;
}
```

### Test Multiple Users

```javascript
function testMultipleUsers() {
  const emails = [
    'user1@example.com',
    'user2@example.com', 
    'user3@example.com'
  ];
  
  emails.forEach(email => {
    addTestUser(email);
  });
  
  console.log('Added multiple test users');
}
```

## Expected Google Sheet Structure

After successful testing, your sheet should look like:

| Email | First Access | Last Access | Access Count | Source | Status |
|-------|-------------|-------------|--------------|--------|--------|
| test@example.com | 1/15/2024 10:30:00 | 1/15/2024 10:30:00 | 1 | manual-test | Active |

## Next Steps After Successful Testing

1. ✅ Clear test data from your sheet
2. ✅ Update the URLs in your frontend code
3. ✅ Test the full user flow on your website
4. ✅ Monitor the sheet for real user data
5. ✅ Set up any additional tracking or notifications you need

## Getting Help

If you're still having issues:

1. Check the Google Apps Script execution logs
2. Look at your browser's developer console for errors
3. Verify your Google Sheet permissions
4. Try redeploying the web app with a new version
5. Test with the built-in functions first before testing the web interface

Remember: Google Apps Script can take a few minutes to propagate changes, so if something isn't working immediately, wait a few minutes and try again.