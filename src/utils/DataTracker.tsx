import { useAuth } from '../contexts/AuthContext';

interface ToolData {
  [key: string]: any;
}

class DataTracker {
  private static instance: DataTracker;
  private googleScriptUrl: string;
  private userEmail: string | null = null;
  private sessionId: string | null = null;
  private pendingData: Array<{ toolName: string; data: ToolData; timestamp: string }> = [];
  private isOnline: boolean = navigator.onLine;

  constructor() {
    // Replace with your actual Google Apps Script URL
    this.googleScriptUrl = 'https://script.google.com/macros/s/AKfycbyD7Q7DMJAMlo0f8eo8EKSQwFDPwx-DGMVebUYeYrv2VCTWa5B2CHtdFvKi5_rp5hnNsQ/exec';
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingData();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Auto-save pending data every 30 seconds
    setInterval(() => {
      if (this.isOnline && this.pendingData.length > 0) {
        this.syncPendingData();
      }
    }, 30000);
  }

  static getInstance(): DataTracker {
    if (!DataTracker.instance) {
      DataTracker.instance = new DataTracker();
    }
    return DataTracker.instance;
  }

  setUser(email: string) {
    this.userEmail = email;
    this.startSession();
  }

  private async startSession() {
    if (!this.userEmail) return;

    try {
      const response = await this.sendRequest({
        action: 'start_session',
        toolName: 'session',
        userEmail: this.userEmail,
        data: {},
        timestamp: new Date().toISOString()
      });

      if (response.success) {
        this.sessionId = response.sessionId || this.generateSessionId();
      }
    } catch (error) {
      console.error('Error starting session:', error);
      this.sessionId = this.generateSessionId();
    }
  }

  async endSession() {
    if (!this.userEmail) return;

    try {
      await this.sendRequest({
        action: 'end_session',
        toolName: 'session',
        userEmail: this.userEmail,
        data: {},
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }

  async trackToolUsage(toolName: string) {
    if (!this.userEmail) return;

    try {
      await this.sendRequest({
        action: 'track_usage',
        toolName,
        userEmail: this.userEmail,
        data: {},
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking tool usage:', error);
    }
  }

  async saveToolData(toolName: string, data: ToolData) {
    if (!this.userEmail) return;

    const dataEntry = {
      toolName,
      data,
      timestamp: new Date().toISOString()
    };

    if (this.isOnline) {
      try {
        await this.sendRequest({
          action: 'save_data',
          userEmail: this.userEmail,
          ...dataEntry
        });
      } catch (error) {
        console.error('Error saving data online:', error);
        this.pendingData.push(dataEntry);
        this.savePendingDataLocally();
      }
    } else {
      this.pendingData.push(dataEntry);
      this.savePendingDataLocally();
    }
  }

  async getUserData(toolName?: string): Promise<any> {
    if (!this.userEmail) return null;

    try {
      const response = await this.sendRequest({
        action: 'get_user_data',
        toolName: toolName || 'all',
        userEmail: this.userEmail,
        data: {},
        timestamp: new Date().toISOString()
      });

      return response.data;
    } catch (error) {
      console.error('Error getting user data:', error);
      return this.getLocalData(toolName);
    }
  }

  async getUserAnalytics(): Promise<any> {
    if (!this.userEmail) return null;

    try {
      const response = await this.sendRequest({
        action: 'get_analytics',
        toolName: 'analytics',
        userEmail: this.userEmail,
        data: {},
        timestamp: new Date().toISOString()
      });

      return response.analytics;
    } catch (error) {
      console.error('Error getting analytics:', error);
      return null;
    }
  }

  private async sendRequest(data: any): Promise<any> {
    const response = await fetch(this.googleScriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    // Since we're using no-cors, we can't read the response
    // We'll assume success if no error is thrown
    return { success: true };
  }

  private async syncPendingData() {
    if (!this.userEmail || this.pendingData.length === 0) return;

    const dataToSync = [...this.pendingData];
    this.pendingData = [];

    for (const entry of dataToSync) {
      try {
        await this.sendRequest({
          action: 'save_data',
          userEmail: this.userEmail,
          ...entry
        });
      } catch (error) {
        console.error('Error syncing data:', error);
        this.pendingData.push(entry);
      }
    }

    this.savePendingDataLocally();
  }

  private savePendingDataLocally() {
    if (this.userEmail) {
      localStorage.setItem(
        `pendingData_${this.userEmail}`,
        JSON.stringify(this.pendingData)
      );
    }
  }

  private loadPendingDataLocally() {
    if (this.userEmail) {
      const stored = localStorage.getItem(`pendingData_${this.userEmail}`);
      if (stored) {
        this.pendingData = JSON.parse(stored);
      }
    }
  }

  private getLocalData(toolName?: string): any {
    if (!this.userEmail) return null;

    const allData: { [key: string]: any } = {};
    
    // Get data from localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(`${this.userEmail}_`)) {
        const tool = key.replace(`${this.userEmail}_`, '');
        if (!toolName || tool === toolName) {
          try {
            allData[tool] = JSON.parse(localStorage.getItem(key) || '{}');
          } catch (error) {
            console.error('Error parsing local data:', error);
          }
        }
      }
    });

    return toolName ? allData[toolName] : allData;
  }

  private generateSessionId(): string {
    return `${this.userEmail?.split('@')[0]}_${Date.now()}`;
  }

  // Tool-specific save methods
  async saveGPAData(courses: any[], gpa: number) {
    await this.saveToolData('gpa', { courses, gpa });
  }

  async saveAttendanceData(records: any[]) {
    await this.saveToolData('attendance', { records });
  }

  async saveTimerData(sessionType: string, duration: number, completed: boolean, totalSessions: number, totalStudyTime: number) {
    await this.saveToolData('timer', {
      sessionType,
      duration,
      completed,
      totalSessions,
      totalStudyTime
    });
  }

  async saveGradesData(courses: any[]) {
    await this.saveToolData('grades', { courses });
  }

  async saveScheduleData(items: any[]) {
    await this.saveToolData('schedule', { items });
  }

  async saveFlashcardsData(decks: any[]) {
    await this.saveToolData('flashcards', { decks });
  }

  async saveExpensesData(expenses: any[]) {
    await this.saveToolData('expenses', { expenses });
  }

  async saveReviewsData(reviews: any[]) {
    await this.saveToolData('reviews', { reviews });
  }

  async saveChatData(channelName: string, channelType: string, messages: any[]) {
    await this.saveToolData('chat', { channelName, channelType, messages });
  }
}

// React Hook for easy usage
export const useDataTracker = () => {
  const { userEmail } = useAuth();
  const tracker = DataTracker.getInstance();

  React.useEffect(() => {
    if (userEmail) {
      tracker.setUser(userEmail);
    }
  }, [userEmail, tracker]);

  React.useEffect(() => {
    const handleBeforeUnload = () => {
      tracker.endSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      tracker.endSession();
    };
  }, [tracker]);

  return tracker;
};

export default DataTracker;