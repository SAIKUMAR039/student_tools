/**
 * Google Apps Script for collecting newsletter emails and tool access
 * 
 * Setup Instructions:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Create a Google Sheet to store the emails
 * 5. Update the SPREADSHEET_ID below with your sheet's ID
 * 6. Deploy as a web app with execute permissions set to "Anyone"
 * 7. Copy the web app URL and update it in AuthContext.tsx and Newsletter.tsx
 */

// Replace with your Google Sheet ID
const SPREADSHEET_ID = '18gLoS-7DLfqxnMrzdau79kU6BeurMPteWCWFr3i1SxI';
const SHEET_NAME = 'Student Tool Users';

function doPost(e) {
  try {
    // Log the incoming request for debugging
    console.log('doPost called with event:', e);
    
    // Check if the event object and postData exist
    if (!e || !e.postData || !e.postData.contents) {
      console.error('Invalid request: missing postData');
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: false, 
          error: 'Invalid request format' 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Parse the request data
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: false, 
          error: 'Invalid JSON format' 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const email = data.email;
    const timestamp = data.timestamp || new Date().toISOString();
    const source = data.source || 'website';
    const action = data.action || 'subscribe';
    
    console.log('Processing request:', { email, timestamp, source, action });
    
    // Validate email
    if (!email || !isValidEmail(email)) {
      console.error('Invalid email:', email);
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: false, 
          error: 'Invalid email address' 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get or create the spreadsheet
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      console.log('Spreadsheet opened successfully');
    } catch (spreadsheetError) {
      console.error('Spreadsheet error:', spreadsheetError);
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: false, 
          error: 'Spreadsheet not found. Please check SPREADSHEET_ID.' 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      console.log('Creating new sheet:', SHEET_NAME);
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Add headers
      sheet.getRange(1, 1, 1, 6).setValues([['Email', 'First Access', 'Last Access', 'Access Count', 'Source', 'Status']]);
      sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
      console.log('Sheet created with headers');
    }
    
    // Check if email already exists
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    let emailRow = -1;
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === email) {
        emailRow = i + 1; // +1 because getRange is 1-indexed
        break;
      }
    }
    
    if (emailRow > 0) {
      // Email exists - update last access and increment count
      console.log('Updating existing user:', email);
      const currentCount = sheet.getRange(emailRow, 4).getValue() || 0;
      sheet.getRange(emailRow, 3).setValue(new Date(timestamp)); // Last Access
      sheet.getRange(emailRow, 4).setValue(currentCount + 1); // Access Count
      console.log('User updated successfully');
      
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: true, 
          message: 'Access granted',
          isNewUser: false 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      // New email - add new row
      console.log('Adding new user:', email);
      const newRow = [email, new Date(timestamp), new Date(timestamp), 1, source, 'Active'];
      sheet.appendRow(newRow);
      console.log('New user added successfully');
      
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: true, 
          message: 'Welcome! Access granted',
          isNewUser: true 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
      
  } catch (error) {
    console.error('Unexpected error in doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'Server error: ' + error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (for testing)
  console.log('GET request received');
  return ContentService
    .createTextOutput(JSON.stringify({ 
      message: 'Student Tools API is running',
      timestamp: new Date().toISOString(),
      status: 'healthy'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Test function for debugging
function testAddUser() {
  console.log('Running test function...');
  
  // Simulate a POST request
  const testData = {
    postData: {
      contents: JSON.stringify({
        email: 'manual-test@example.com',
        timestamp: new Date().toISOString(),
        source: 'manual-test',
        action: 'test'
      })
    }
  };
  
  const result = doPost(testData);
  console.log('Test result:', result.getContent());
  return result.getContent();
}

// Test function without postData (to simulate the error)
function testError() {
  console.log('Testing error handling...');
  
  // This should trigger the error handling
  const result = doPost({});
  console.log('Error test result:', result.getContent());
  return result.getContent();
}

// Function to get user statistics
function getUserStats() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return { 
        totalUsers: 0, 
        activeUsers: 0, 
        error: 'Sheet not found' 
      };
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    const totalUsers = values.length - 1; // Subtract header row
    const activeUsers = values.slice(1).filter(row => row[5] === 'Active').length;
    
    return {
      totalUsers: totalUsers,
      activeUsers: activeUsers,
      lastUpdated: new Date().toISOString(),
      sheetName: SHEET_NAME,
      spreadsheetId: SPREADSHEET_ID
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      error: error.toString(),
      totalUsers: 0,
      activeUsers: 0
    };
  }
}

// Function to manually add a user (for testing)
function addTestUser(email = 'manual-test@example.com') {
  const testData = {
    postData: {
      contents: JSON.stringify({
        email: email,
        timestamp: new Date().toISOString(),
        source: 'manual-test',
        action: 'test'
      })
    }
  };
  
  return doPost(testData);
}

// Debug function to check spreadsheet access
function debugSpreadsheetAccess() {
  try {
    console.log('Testing spreadsheet access...');
    console.log('Spreadsheet ID:', SPREADSHEET_ID);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('✅ Spreadsheet opened successfully');
    console.log('Spreadsheet name:', spreadsheet.getName());
    
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    console.log('Sheet name we are looking for:', SHEET_NAME);
    
    if (!sheet) {
      console.log('❌ Sheet not found, creating new sheet...');
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.getRange(1, 1, 1, 6).setValues([['Email', 'First Access', 'Last Access', 'Access Count', 'Source', 'Status']]);
      console.log('✅ New sheet created with headers');
    } else {
      console.log('✅ Sheet found');
    }
    
    // Try to add test data
    const testRow = ['debug-test@example.com', new Date(), new Date(), 1, 'debug-test', 'Active'];
    sheet.appendRow(testRow);
    console.log('✅ Test row added successfully');
    
    return 'Debug test completed successfully';
    
  } catch (error) {
    console.error('❌ Error in debug test:', error.toString());
    return 'Debug test failed: ' + error.toString();
  }
}