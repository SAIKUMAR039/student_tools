/**
 * Comprehensive Data Tracker for AcademicFlow
 * 
 * This script tracks all user interactions across all tools and saves them to Google Sheets
 * 
 * Setup Instructions:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Update the SPREADSHEET_ID below with your sheet's ID
 * 5. Deploy as a web app with execute permissions set to "Anyone"
 * 6. Copy the web app URL and update it in DataTracker.tsx
 */

// Replace with your Google Sheet ID
const SPREADSHEET_ID = '18gLoS-7DLfqxnMrzdau79kU6BeurMPteWCWFr3i1SxI';

// Sheet names for different data types
const SHEETS = {
  USERS: 'Users',
  GPA_DATA: 'GPA_Calculator_Data',
  ATTENDANCE_DATA: 'Attendance_Data',
  TIMER_DATA: 'Study_Timer_Data',
  GRADES_DATA: 'Grade_Tracker_Data',
  SCHEDULE_DATA: 'Schedule_Data',
  FLASHCARDS_DATA: 'Flashcards_Data',
  EXPENSES_DATA: 'Budget_Tracker_Data',
  REVIEWS_DATA: 'Course_Reviews_Data',
  CHAT_DATA: 'Student_Chat_Data',
  NOTES_DATA: 'Study_Notes_Data',
  USER_SESSIONS: 'User_Sessions',
  TOOL_USAGE: 'Tool_Usage_Analytics'
};

function doPost(e) {
  try {
    console.log('Data tracking request received:', e);
    
    if (!e || !e.postData || !e.postData.contents) {
      return createErrorResponse('Invalid request format');
    }

    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return createErrorResponse('Invalid JSON format');
    }

    const { action, toolName, userEmail, data: toolData, timestamp } = data;
    
    if (!action || !toolName || !userEmail) {
      return createErrorResponse('Missing required fields: action, toolName, userEmail');
    }

    console.log('Processing data tracking:', { action, toolName, userEmail });

    // Get or create spreadsheet
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (error) {
      console.error('Spreadsheet error:', error);
      return createErrorResponse('Spreadsheet not found');
    }

    // Initialize sheets if they don't exist
    initializeSheets(spreadsheet);

    // Process the data based on action type
    switch (action) {
      case 'save_data':
        saveToolData(spreadsheet, toolName, userEmail, toolData, timestamp);
        break;
      case 'track_usage':
        trackToolUsage(spreadsheet, toolName, userEmail, timestamp);
        break;
      case 'start_session':
        startUserSession(spreadsheet, userEmail, timestamp);
        break;
      case 'end_session':
        endUserSession(spreadsheet, userEmail, timestamp);
        break;
      case 'get_user_data':
        return getUserData(spreadsheet, userEmail, toolName);
      case 'get_analytics':
        return getAnalytics(spreadsheet, userEmail);
      default:
        return createErrorResponse('Unknown action: ' + action);
    }

    return createSuccessResponse('Data processed successfully');

  } catch (error) {
    console.error('Unexpected error:', error);
    return createErrorResponse('Server error: ' + error.toString());
  }
}

function doGet(e) {
  const params = e.parameter;
  
  if (params.action === 'get_user_data' && params.userEmail) {
    try {
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      return getUserData(spreadsheet, params.userEmail, params.toolName);
    } catch (error) {
      return createErrorResponse('Error retrieving data: ' + error.toString());
    }
  }
  
  return createSuccessResponse('AcademicFlow Data Tracker API is running');
}

function initializeSheets(spreadsheet) {
  // Initialize Users sheet
  let usersSheet = spreadsheet.getSheetByName(SHEETS.USERS);
  if (!usersSheet) {
    usersSheet = spreadsheet.insertSheet(SHEETS.USERS);
    usersSheet.getRange(1, 1, 1, 6).setValues([
      ['Email', 'First Access', 'Last Access', 'Total Sessions', 'Total Time (minutes)', 'Status']
    ]);
    usersSheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  }

  // Initialize GPA Calculator sheet
  let gpaSheet = spreadsheet.getSheetByName(SHEETS.GPA_DATA);
  if (!gpaSheet) {
    gpaSheet = spreadsheet.insertSheet(SHEETS.GPA_DATA);
    gpaSheet.getRange(1, 1, 1, 8).setValues([
      ['User Email', 'Course Name', 'Credits', 'Grade', 'Grade Points', 'Semester GPA', 'Timestamp', 'Session ID']
    ]);
    gpaSheet.getRange(1, 1, 1, 8).setFontWeight('bold');
  }

  // Initialize Attendance sheet
  let attendanceSheet = spreadsheet.getSheetByName(SHEETS.ATTENDANCE_DATA);
  if (!attendanceSheet) {
    attendanceSheet = spreadsheet.insertSheet(SHEETS.ATTENDANCE_DATA);
    attendanceSheet.getRange(1, 1, 1, 7).setValues([
      ['User Email', 'Course', 'Total Classes', 'Attended Classes', 'Attendance %', 'Timestamp', 'Session ID']
    ]);
    attendanceSheet.getRange(1, 1, 1, 7).setFontWeight('bold');
  }

  // Initialize Study Timer sheet
  let timerSheet = spreadsheet.getSheetByName(SHEETS.TIMER_DATA);
  if (!timerSheet) {
    timerSheet = spreadsheet.insertSheet(SHEETS.TIMER_DATA);
    timerSheet.getRange(1, 1, 1, 8).setValues([
      ['User Email', 'Session Type', 'Duration (minutes)', 'Completed', 'Total Sessions', 'Total Study Time', 'Timestamp', 'Session ID']
    ]);
    timerSheet.getRange(1, 1, 1, 8).setFontWeight('bold');
  }

  // Initialize Grade Tracker sheet
  let gradesSheet = spreadsheet.getSheetByName(SHEETS.GRADES_DATA);
  if (!gradesSheet) {
    gradesSheet = spreadsheet.insertSheet(SHEETS.GRADES_DATA);
    gradesSheet.getRange(1, 1, 1, 9).setValues([
      ['User Email', 'Course', 'Assignment Name', 'Score', 'Max Score', 'Percentage', 'Category', 'Timestamp', 'Session ID']
    ]);
    gradesSheet.getRange(1, 1, 1, 9).setFontWeight('bold');
  }

  // Initialize Schedule sheet
  let scheduleSheet = spreadsheet.getSheetByName(SHEETS.SCHEDULE_DATA);
  if (!scheduleSheet) {
    scheduleSheet = spreadsheet.insertSheet(SHEETS.SCHEDULE_DATA);
    scheduleSheet.getRange(1, 1, 1, 8).setValues([
      ['User Email', 'Title', 'Day', 'Time', 'Location', 'Type', 'Timestamp', 'Session ID']
    ]);
    scheduleSheet.getRange(1, 1, 1, 8).setFontWeight('bold');
  }

  // Initialize Flashcards sheet
  let flashcardsSheet = spreadsheet.getSheetByName(SHEETS.FLASHCARDS_DATA);
  if (!flashcardsSheet) {
    flashcardsSheet = spreadsheet.insertSheet(SHEETS.FLASHCARDS_DATA);
    flashcardsSheet.getRange(1, 1, 1, 9).setValues([
      ['User Email', 'Deck Name', 'Card Front', 'Card Back', 'Correct Count', 'Incorrect Count', 'Last Reviewed', 'Timestamp', 'Session ID']
    ]);
    flashcardsSheet.getRange(1, 1, 1, 9).setFontWeight('bold');
  }

  // Initialize Budget Tracker sheet
  let expensesSheet = spreadsheet.getSheetByName(SHEETS.EXPENSES_DATA);
  if (!expensesSheet) {
    expensesSheet = spreadsheet.insertSheet(SHEETS.EXPENSES_DATA);
    expensesSheet.getRange(1, 1, 1, 8).setValues([
      ['User Email', 'Amount', 'Description', 'Category', 'Type', 'Date', 'Timestamp', 'Session ID']
    ]);
    expensesSheet.getRange(1, 1, 1, 8).setFontWeight('bold');
  }

  // Initialize Course Reviews sheet
  let reviewsSheet = spreadsheet.getSheetByName(SHEETS.REVIEWS_DATA);
  if (!reviewsSheet) {
    reviewsSheet = spreadsheet.insertSheet(SHEETS.REVIEWS_DATA);
    reviewsSheet.getRange(1, 1, 1, 12).setValues([
      ['User Email', 'Course Name', 'Course Code', 'Professor', 'Rating', 'Difficulty', 'Workload', 'Review Text', 'Semester', 'Year', 'Timestamp', 'Session ID']
    ]);
    reviewsSheet.getRange(1, 1, 1, 12).setFontWeight('bold');
  }

  // Initialize Student Chat sheet
  let chatSheet = spreadsheet.getSheetByName(SHEETS.CHAT_DATA);
  if (!chatSheet) {
    chatSheet = spreadsheet.insertSheet(SHEETS.CHAT_DATA);
    chatSheet.getRange(1, 1, 1, 10).setValues([
      ['User Email', 'Channel Name', 'Channel Type', 'Message Type', 'Content', 'File Name', 'File Type', 'Recipients', 'Timestamp', 'Session ID']
    ]);
    chatSheet.getRange(1, 1, 1, 10).setFontWeight('bold');
  }

  // Initialize Study Notes sheet
  let notesSheet = spreadsheet.getSheetByName(SHEETS.NOTES_DATA);
  if (!notesSheet) {
    notesSheet = spreadsheet.insertSheet(SHEETS.NOTES_DATA);
    notesSheet.getRange(1, 1, 1, 10).setValues([
      ['User Email', 'Note Title', 'Course', 'Content Preview', 'Tags', 'Is Public', 'Downloads', 'Rating', 'Timestamp', 'Session ID']
    ]);
    notesSheet.getRange(1, 1, 1, 10).setFontWeight('bold');
  }

  // Initialize User Sessions sheet
  let sessionsSheet = spreadsheet.getSheetByName(SHEETS.USER_SESSIONS);
  if (!sessionsSheet) {
    sessionsSheet = spreadsheet.insertSheet(SHEETS.USER_SESSIONS);
    sessionsSheet.getRange(1, 1, 1, 6).setValues([
      ['Session ID', 'User Email', 'Start Time', 'End Time', 'Duration (minutes)', 'Tools Used']
    ]);
    sessionsSheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  }

  // Initialize Tool Usage Analytics sheet
  let analyticsSheet = spreadsheet.getSheetByName(SHEETS.TOOL_USAGE);
  if (!analyticsSheet) {
    analyticsSheet = spreadsheet.insertSheet(SHEETS.TOOL_USAGE);
    analyticsSheet.getRange(1, 1, 1, 6).setValues([
      ['User Email', 'Tool Name', 'Usage Count', 'Total Time (minutes)', 'Last Used', 'First Used']
    ]);
    analyticsSheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  }
}

function saveToolData(spreadsheet, toolName, userEmail, toolData, timestamp) {
  const sessionId = generateSessionId(userEmail, timestamp);
  
  switch (toolName) {
    case 'gpa':
      saveGPAData(spreadsheet, userEmail, toolData, timestamp, sessionId);
      break;
    case 'attendance':
      saveAttendanceData(spreadsheet, userEmail, toolData, timestamp, sessionId);
      break;
    case 'timer':
      saveTimerData(spreadsheet, userEmail, toolData, timestamp, sessionId);
      break;
    case 'grades':
      saveGradesData(spreadsheet, userEmail, toolData, timestamp, sessionId);
      break;
    case 'schedule':
      saveScheduleData(spreadsheet, userEmail, toolData, timestamp, sessionId);
      break;
    case 'flashcards':
      saveFlashcardsData(spreadsheet, userEmail, toolData, timestamp, sessionId);
      break;
    case 'expenses':
      saveExpensesData(spreadsheet, userEmail, toolData, timestamp, sessionId);
      break;
    case 'reviews':
      saveReviewsData(spreadsheet, userEmail, toolData, timestamp, sessionId);
      break;
    case 'chat':
      saveChatData(spreadsheet, userEmail, toolData, timestamp, sessionId);
      break;
    case 'notes':
      saveNotesData(spreadsheet, userEmail, toolData, timestamp, sessionId);
      break;
  }
}

function saveGPAData(spreadsheet, userEmail, data, timestamp, sessionId) {
  const sheet = spreadsheet.getSheetByName(SHEETS.GPA_DATA);
  
  if (data.courses && Array.isArray(data.courses)) {
    data.courses.forEach(course => {
      if (course.name && course.grade) {
        const gradePoints = getGradePoints(course.grade);
        sheet.appendRow([
          userEmail,
          course.name,
          course.credits || 0,
          course.grade,
          gradePoints,
          data.gpa || 0,
          new Date(timestamp),
          sessionId
        ]);
      }
    });
  }
}

function saveAttendanceData(spreadsheet, userEmail, data, timestamp, sessionId) {
  const sheet = spreadsheet.getSheetByName(SHEETS.ATTENDANCE_DATA);
  
  if (data.records && Array.isArray(data.records)) {
    data.records.forEach(record => {
      if (record.course && record.totalClasses > 0) {
        const percentage = (record.attendedClasses / record.totalClasses) * 100;
        sheet.appendRow([
          userEmail,
          record.course,
          record.totalClasses,
          record.attendedClasses,
          percentage.toFixed(2),
          new Date(timestamp),
          sessionId
        ]);
      }
    });
  }
}

function saveTimerData(spreadsheet, userEmail, data, timestamp, sessionId) {
  const sheet = spreadsheet.getSheetByName(SHEETS.TIMER_DATA);
  
  sheet.appendRow([
    userEmail,
    data.sessionType || 'work',
    data.duration || 0,
    data.completed || false,
    data.totalSessions || 0,
    data.totalStudyTime || 0,
    new Date(timestamp),
    sessionId
  ]);
}

function saveGradesData(spreadsheet, userEmail, data, timestamp, sessionId) {
  const sheet = spreadsheet.getSheetByName(SHEETS.GRADES_DATA);
  
  if (data.courses && Array.isArray(data.courses)) {
    data.courses.forEach(course => {
      if (course.assignments && Array.isArray(course.assignments)) {
        course.assignments.forEach(assignment => {
          if (assignment.name && assignment.maxScore > 0) {
            const percentage = (assignment.score / assignment.maxScore) * 100;
            sheet.appendRow([
              userEmail,
              course.name || 'Unnamed Course',
              assignment.name,
              assignment.score,
              assignment.maxScore,
              percentage.toFixed(2),
              assignment.category || 'General',
              new Date(timestamp),
              sessionId
            ]);
          }
        });
      }
    });
  }
}

function saveScheduleData(spreadsheet, userEmail, data, timestamp, sessionId) {
  const sheet = spreadsheet.getSheetByName(SHEETS.SCHEDULE_DATA);
  
  if (data.items && Array.isArray(data.items)) {
    data.items.forEach(item => {
      if (item.title && item.day) {
        sheet.appendRow([
          userEmail,
          item.title,
          item.day,
          item.time || '',
          item.location || '',
          item.type || 'other',
          new Date(timestamp),
          sessionId
        ]);
      }
    });
  }
}

function saveFlashcardsData(spreadsheet, userEmail, data, timestamp, sessionId) {
  const sheet = spreadsheet.getSheetByName(SHEETS.FLASHCARDS_DATA);
  
  if (data.decks && Array.isArray(data.decks)) {
    data.decks.forEach(deck => {
      if (deck.cards && Array.isArray(deck.cards)) {
        deck.cards.forEach(card => {
          if (card.front && card.back) {
            sheet.appendRow([
              userEmail,
              deck.name || 'Unnamed Deck',
              card.front,
              card.back,
              card.correctCount || 0,
              card.incorrectCount || 0,
              card.lastReviewed ? new Date(card.lastReviewed) : '',
              new Date(timestamp),
              sessionId
            ]);
          }
        });
      }
    });
  }
}

function saveExpensesData(spreadsheet, userEmail, data, timestamp, sessionId) {
  const sheet = spreadsheet.getSheetByName(SHEETS.EXPENSES_DATA);
  
  if (data.expenses && Array.isArray(data.expenses)) {
    data.expenses.forEach(expense => {
      if (expense.amount && expense.description) {
        sheet.appendRow([
          userEmail,
          expense.amount,
          expense.description,
          expense.category || 'other',
          expense.type || 'expense',
          expense.date ? new Date(expense.date) : new Date(timestamp),
          new Date(timestamp),
          sessionId
        ]);
      }
    });
  }
}

function saveReviewsData(spreadsheet, userEmail, data, timestamp, sessionId) {
  const sheet = spreadsheet.getSheetByName(SHEETS.REVIEWS_DATA);
  
  if (data.reviews && Array.isArray(data.reviews)) {
    data.reviews.forEach(review => {
      if (review.courseName && review.review) {
        sheet.appendRow([
          userEmail,
          review.courseName,
          review.courseCode || '',
          review.professor || '',
          review.rating || 0,
          review.difficulty || 0,
          review.workload || 0,
          review.review,
          review.semester || '',
          review.year || new Date().getFullYear(),
          new Date(timestamp),
          sessionId
        ]);
      }
    });
  }
}

function saveChatData(spreadsheet, userEmail, data, timestamp, sessionId) {
  const sheet = spreadsheet.getSheetByName(SHEETS.CHAT_DATA);
  
  // Handle both individual messages and channel data
  if (data.channelName && Array.isArray(data)) {
    // Save channel data
    data.forEach(channel => {
      if (channel.messages && Array.isArray(channel.messages)) {
        channel.messages.forEach(message => {
          sheet.appendRow([
            userEmail,
            channel.name || 'unknown',
            channel.type || 'public',
            message.type || 'text',
            message.content || '',
            message.fileName || '',
            message.fileType || '',
            channel.members ? channel.members.join(', ') : '',
            new Date(timestamp),
            sessionId
          ]);
        });
      }
    });
  } else if (data.messages && Array.isArray(data.messages)) {
    // Save individual messages
    data.messages.forEach(message => {
      sheet.appendRow([
        userEmail,
        data.channelName || 'general',
        data.channelType || 'public',
        message.type || 'text',
        message.content || '',
        message.fileName || '',
        message.fileType || '',
        'all',
        new Date(timestamp),
        sessionId
      ]);
    });
  }
}

function saveNotesData(spreadsheet, userEmail, data, timestamp, sessionId) {
  const sheet = spreadsheet.getSheetByName(SHEETS.NOTES_DATA);
  
  if (data.notes && Array.isArray(data.notes)) {
    data.notes.forEach(note => {
      if (note.title && note.content) {
        const contentPreview = note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '');
        sheet.appendRow([
          userEmail,
          note.title,
          note.course || '',
          contentPreview,
          note.tags ? note.tags.join(', ') : '',
          note.isPublic || false,
          note.downloads || 0,
          note.rating || 0,
          new Date(timestamp),
          sessionId
        ]);
      }
    });
  }
}

function trackToolUsage(spreadsheet, toolName, userEmail, timestamp) {
  const sheet = spreadsheet.getSheetByName(SHEETS.TOOL_USAGE);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  let userRow = -1;
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === userEmail && values[i][1] === toolName) {
      userRow = i + 1;
      break;
    }
  }
  
  if (userRow > 0) {
    // Update existing record
    const currentCount = sheet.getRange(userRow, 3).getValue() || 0;
    sheet.getRange(userRow, 3).setValue(currentCount + 1);
    sheet.getRange(userRow, 5).setValue(new Date(timestamp)); // Last Used
  } else {
    // Create new record
    sheet.appendRow([
      userEmail,
      toolName,
      1, // Usage Count
      0, // Total Time (will be updated separately)
      new Date(timestamp), // Last Used
      new Date(timestamp)  // First Used
    ]);
  }
}

function startUserSession(spreadsheet, userEmail, timestamp) {
  const sessionId = generateSessionId(userEmail, timestamp);
  const sheet = spreadsheet.getSheetByName(SHEETS.USER_SESSIONS);
  
  sheet.appendRow([
    sessionId,
    userEmail,
    new Date(timestamp),
    '', // End time (empty for now)
    0,  // Duration (will be calculated on end)
    '' // Tools used (will be updated)
  ]);
  
  return sessionId;
}

function endUserSession(spreadsheet, userEmail, timestamp) {
  const sheet = spreadsheet.getSheetByName(SHEETS.USER_SESSIONS);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Find the most recent session for this user without an end time
  for (let i = values.length - 1; i >= 1; i--) {
    if (values[i][1] === userEmail && !values[i][3]) {
      const startTime = new Date(values[i][2]);
      const endTime = new Date(timestamp);
      const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
      
      sheet.getRange(i + 1, 4).setValue(endTime); // End time
      sheet.getRange(i + 1, 5).setValue(duration); // Duration
      break;
    }
  }
}

function getUserData(spreadsheet, userEmail, toolName) {
  const userData = {};
  
  if (!toolName || toolName === 'all') {
    // Get data from all tools
    Object.values(SHEETS).forEach(sheetName => {
      if (sheetName !== SHEETS.USERS) {
        userData[sheetName] = getSheetDataForUser(spreadsheet, sheetName, userEmail);
      }
    });
  } else {
    // Get data for specific tool
    const sheetName = getSheetNameForTool(toolName);
    if (sheetName) {
      userData[toolName] = getSheetDataForUser(spreadsheet, sheetName, userEmail);
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ 
      success: true, 
      data: userData 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheetDataForUser(spreadsheet, sheetName, userEmail) {
  try {
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) return [];
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const headers = values[0];
    
    const userData = [];
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === userEmail) {
        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = values[i][index];
        });
        userData.push(rowData);
      }
    }
    
    return userData;
  } catch (error) {
    console.error('Error getting sheet data:', error);
    return [];
  }
}

function getAnalytics(spreadsheet, userEmail) {
  const analytics = {
    totalSessions: 0,
    totalTimeSpent: 0,
    toolsUsed: {},
    mostUsedTool: '',
    recentActivity: []
  };
  
  try {
    // Get session data
    const sessionsSheet = spreadsheet.getSheetByName(SHEETS.USER_SESSIONS);
    if (sessionsSheet) {
      const sessionData = getSheetDataForUser(spreadsheet, SHEETS.USER_SESSIONS, userEmail);
      analytics.totalSessions = sessionData.length;
      analytics.totalTimeSpent = sessionData.reduce((sum, session) => {
        return sum + (session['Duration (minutes)'] || 0);
      }, 0);
    }
    
    // Get tool usage data
    const usageSheet = spreadsheet.getSheetByName(SHEETS.TOOL_USAGE);
    if (usageSheet) {
      const usageData = getSheetDataForUser(spreadsheet, SHEETS.TOOL_USAGE, userEmail);
      usageData.forEach(usage => {
        analytics.toolsUsed[usage['Tool Name']] = usage['Usage Count'];
      });
      
      // Find most used tool
      let maxUsage = 0;
      Object.entries(analytics.toolsUsed).forEach(([tool, count]) => {
        if (count > maxUsage) {
          maxUsage = count;
          analytics.mostUsedTool = tool;
        }
      });
    }
    
  } catch (error) {
    console.error('Error getting analytics:', error);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ 
      success: true, 
      analytics: analytics 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Helper functions
function generateSessionId(userEmail, timestamp) {
  return userEmail.split('@')[0] + '_' + new Date(timestamp).getTime();
}

function getGradePoints(grade) {
  const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };
  return gradePoints[grade] || 0;
}

function getSheetNameForTool(toolName) {
  const toolSheetMap = {
    'gpa': SHEETS.GPA_DATA,
    'attendance': SHEETS.ATTENDANCE_DATA,
    'timer': SHEETS.TIMER_DATA,
    'grades': SHEETS.GRADES_DATA,
    'schedule': SHEETS.SCHEDULE_DATA,
    'flashcards': SHEETS.FLASHCARDS_DATA,
    'expenses': SHEETS.EXPENSES_DATA,
    'reviews': SHEETS.REVIEWS_DATA,
    'chat': SHEETS.CHAT_DATA,
    'notes': SHEETS.NOTES_DATA
  };
  return toolSheetMap[toolName];
}

function createSuccessResponse(message, data = null) {
  const response = { success: true, message };
  if (data) response.data = data;
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function createErrorResponse(message) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      success: false, 
      error: message 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test functions
function testDataTracking() {
  const testData = {
    action: 'save_data',
    toolName: 'chat',
    userEmail: 'test@example.com',
    data: {
      channelName: 'general',
      channelType: 'public',
      messages: [
        { 
          content: 'Test message', 
          type: 'text', 
          author: 'test@example.com',
          timestamp: new Date().toISOString()
        }
      ]
    },
    timestamp: new Date().toISOString()
  };
  
  const result = doPost({
    postData: {
      contents: JSON.stringify(testData)
    }
  });
  
  console.log('Test result:', result.getContent());
  return result.getContent();
}

function testGetUserData() {
  const result = getUserData(
    SpreadsheetApp.openById(SPREADSHEET_ID),
    'test@example.com',
    'chat'
  );
  
  console.log('User data:', result.getContent());
  return result.getContent();
}