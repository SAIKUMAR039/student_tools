# Comprehensive Data Integration Setup Guide

This guide will help you set up the comprehensive data tracking system that saves all user interactions across every tool to Google Sheets.

## Overview

The new data tracking system captures:
- **User sessions** (login/logout times, duration)
- **Tool usage analytics** (which tools are used, how often)
- **Detailed tool data** for all 10 tools:
  - GPA Calculator (courses, grades, GPA)
  - Attendance Tracker (courses, attendance percentages)
  - Study Timer (sessions, study time, breaks)
  - Grade Tracker (assignments, scores, courses)
  - Schedule Planner (events, times, locations)
  - Flashcards (decks, cards, study progress)
  - Budget Tracker (expenses, income, categories)
  - Course Reviews (ratings, reviews, professors)
  - Student Chat (messages, files, channels)
  - User Analytics (comprehensive usage statistics)

## Step 1: Create Google Sheet for Data Tracking

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "AcademicFlow Data Tracker"
4. Copy the spreadsheet ID from the URL
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

## Step 2: Set up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Create new project named "AcademicFlow Data Tracker"
3. Replace default code with content from `google-apps-script/comprehensive-data-tracker.gs`
4. Update `SPREADSHEET_ID` with your sheet ID (line 12)
5. Save the project (Ctrl+S or Cmd+S)

## Step 3: Deploy the Web App

1. Click "Deploy" > "New deployment"
2. Click gear icon next to "Type" and select "Web app"
3. Set configuration:
   - **Description**: AcademicFlow Data Tracker
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click "Deploy"
5. Copy the web app URL

## Step 4: Update Frontend Configuration

1. Open `src/utils/DataTracker.tsx`
2. Find line 15 and replace the URL:
   ```typescript
   this.googleScriptUrl = 'YOUR_ACTUAL_WEB_APP_URL_HERE';
   ```

## Step 5: Test the Integration

### Test Google Apps Script Functions

1. In Google Apps Script editor, select `testDataTracking` function
2. Click "Run" button
3. Check execution logs for success messages
4. Verify test data appears in your Google Sheet

### Test Frontend Integration

1. Start development server: `npm run dev`
2. Use any tool (e.g., GPA Calculator)
3. Add some data and interact with the tool
4. Check your Google Sheet for new data entries

## Google Sheets Structure

The script automatically creates these sheets:

### 1. Users
- Email, First Access, Last Access, Total Sessions, Total Time, Status

### 2. GPA_Calculator_Data
- User Email, Course Name, Credits, Grade, Grade Points, Semester GPA, Timestamp, Session ID

### 3. Attendance_Data
- User Email, Course, Total Classes, Attended Classes, Attendance %, Timestamp, Session ID

### 4. Study_Timer_Data
- User Email, Session Type, Duration, Completed, Total Sessions, Total Study Time, Timestamp, Session ID

### 5. Grade_Tracker_Data
- User Email, Course, Assignment Name, Score, Max Score, Percentage, Category, Timestamp, Session ID

### 6. Schedule_Data
- User Email, Title, Day, Time, Location, Type, Timestamp, Session ID

### 7. Flashcards_Data
- User Email, Deck Name, Card Front, Card Back, Correct Count, Incorrect Count, Last Reviewed, Timestamp, Session ID

### 8. Budget_Tracker_Data
- User Email, Amount, Description, Category, Type, Date, Timestamp, Session ID

### 9. Course_Reviews_Data
- User Email, Course Name, Course Code, Professor, Rating, Difficulty, Workload, Review Text, Semester, Year, Timestamp, Session ID

### 10. Student_Chat_Data
- User Email, Channel Name, Message Type, Content, File Name, File Type, Channel Type, Timestamp, Session ID

### 11. User_Sessions
- Session ID, User Email, Start Time, End Time, Duration, Tools Used

### 12. Tool_Usage_Analytics
- User Email, Tool Name, Usage Count, Total Time, Last Used, First Used

## Features

### 🔄 **Automatic Data Sync**
- Real-time data saving as users interact with tools
- Offline support with local storage backup
- Automatic sync when connection is restored
- Session tracking with start/end times

### 📊 **Comprehensive Analytics**
- User engagement metrics
- Tool usage patterns
- Session duration tracking
- Most popular tools identification

### 💾 **Data Persistence**
- All user data saved automatically
- No manual save required
- Data restoration on return visits
- Cross-device synchronization

### 🔒 **Privacy & Security**
- User data isolated by email
- Secure Google Sheets storage
- No sensitive data collection
- GDPR compliant data handling

## Data Flow

1. **User Interaction**: User interacts with any tool
2. **Data Capture**: DataTracker captures the interaction
3. **Local Storage**: Data stored locally for offline support
4. **Cloud Sync**: Data synced to Google Sheets when online
5. **Analytics**: Usage patterns analyzed and stored
6. **Retrieval**: Data available for user analytics and restoration

## Usage Analytics Available

### User Profile Analytics
- Total study sessions
- Total time spent
- Most used tool
- Tool usage breakdown
- Session history

### Admin Analytics (Google Sheets)
- User engagement trends
- Popular tools identification
- Usage patterns by time
- User retention metrics
- Feature adoption rates

## API Endpoints

The Google Apps Script provides these endpoints:

### POST Requests
- `save_data` - Save tool-specific data
- `track_usage` - Track tool usage
- `start_session` - Start user session
- `end_session` - End user session

### GET Requests
- `get_user_data` - Retrieve user's data
- `get_analytics` - Get user analytics

## Troubleshooting

### Common Issues

**Data not saving:**
- Check Google Apps Script URL in DataTracker.tsx
- Verify web app deployment settings
- Check browser console for errors

**Analytics not loading:**
- Ensure sufficient data exists
- Check Google Sheets permissions
- Verify script execution logs

**Offline functionality:**
- Data stored locally when offline
- Syncs automatically when online
- Check localStorage for pending data

### Testing Functions

Run these in Google Apps Script:

```javascript
// Test data tracking
testDataTracking()

// Test user data retrieval
testGetUserData()

// Check user statistics
getUserStats()
```

## Privacy Compliance

- Only email addresses and usage data collected
- No personal information stored
- Users can request data deletion
- Transparent data handling practices
- Secure Google infrastructure

## Next Steps

1. ✅ Monitor user engagement through Google Sheets
2. ✅ Analyze tool usage patterns
3. ✅ Identify popular features
4. ✅ Track user retention
5. ✅ Optimize based on data insights

The comprehensive data tracking system provides valuable insights into user behavior while maintaining privacy and security standards. All data is automatically saved and synchronized across devices, creating a seamless user experience! 🚀