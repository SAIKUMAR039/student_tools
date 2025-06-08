# AcademicFlow

**The Complete Academic Success Platform for Students**

AcademicFlow is a comprehensive suite of academic tools designed to help students excel in their studies. Built with modern web technologies and featuring a beautiful, iOS-inspired design, it provides everything students need to track their academic progress, manage their time, and achieve their educational goals.

## 🌟 Features

### 📊 **GPA Calculator**
- Calculate semester and cumulative GPA with precision
- Support for multiple grading scales (A+, A, A-, B+, etc.)
- Real-time GPA updates as you add courses
- Credit hour weighting for accurate calculations
- Clean, intuitive interface for easy grade entry

### 📅 **Attendance Tracker**
- Monitor class attendance across multiple courses
- Visual attendance percentage indicators
- Color-coded status system (Excellent, Good, Warning, Critical)
- Overall attendance statistics and insights
- Helps maintain minimum attendance requirements

### ⏱️ **Pomodoro Study Timer**
- Scientifically-proven 25-minute focus sessions
- Automatic break scheduling (5-min short, 15-min long breaks)
- Session tracking and productivity analytics
- Beautiful circular progress indicator
- Daily study time accumulation

### 📈 **Grade Tracker**
- Comprehensive assignment and exam grade management
- Multiple course support with individual grade calculations
- Weighted scoring system for different assignment types
- Letter grade conversion with customizable scales
- Performance trends and analytics

### 🗓️ **Schedule Planner**
- Weekly schedule organization
- Multiple event types (Classes, Study Sessions, Exams, etc.)
- Time and location tracking
- Color-coded schedule visualization
- Week overview with activity density indicators

### 🔐 **Email-Gated Access System**
- Secure email-based authentication
- Google Sheets integration for user management
- Duplicate prevention and access tracking
- Persistent login sessions
- User analytics and engagement metrics

## 🚀 Live Demo

[Visit AcademicFlow](https://your-domain.com) *(Replace with your actual domain)*

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Backend**: Google Apps Script + Google Sheets
- **Deployment**: Netlify (or your preferred platform)

## 📦 Installation & Setup

### Prerequisites

- Node.js 16+ and npm
- Google account for backend setup
- Modern web browser

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/academicflow.git
   cd academicflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Backend Setup (Google Apps Script)

#### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "AcademicFlow Users"
3. Copy the spreadsheet ID from the URL
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

#### Step 2: Deploy Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Create new project named "AcademicFlow Backend"
3. Replace default code with content from `google-apps-script/newsletter-collector-fixed.gs`
4. Update `SPREADSHEET_ID` with your sheet ID
5. Deploy as web app:
   - **Execute as**: Me
   - **Who has access**: Anyone
6. Copy the web app URL

#### Step 3: Update Frontend Configuration
1. Open `src/contexts/AuthContext.tsx`
2. Replace `GOOGLE_SCRIPT_URL` with your web app URL
3. Open `src/components/Newsletter.tsx`
4. Replace `GOOGLE_SCRIPT_URL` with your web app URL

## 🧪 Testing

### Test Google Apps Script
```javascript
// Run in Google Apps Script console
testAddUser(); // Test user addition
getUserStats(); // Check user statistics
debugSpreadsheetAccess(); // Verify sheet access
```

### Test Frontend Integration
1. Start development server
2. Enter test email in access gate
3. Verify user appears in Google Sheet
4. Test duplicate prevention with same email

### Run Linting
```bash
npm run lint
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push to main branch

### Environment Variables
No environment variables required - all configuration is done through Google Apps Script URLs.

## 📊 User Analytics

The Google Sheets backend automatically tracks:
- **User Registration**: Email, timestamp, source
- **Access Patterns**: Login frequency, last access time
- **Engagement Metrics**: Session count, feature usage
- **User Retention**: Return visitor identification

### Analytics Dashboard
Access your Google Sheet to view:
- Total registered users
- Daily/weekly active users
- Most popular features
- User acquisition sources

## 🎨 Design Philosophy

AcademicFlow follows Apple's design principles:
- **Simplicity**: Clean, uncluttered interfaces
- **Consistency**: Unified design language across all tools
- **Accessibility**: High contrast ratios and readable typography
- **Responsiveness**: Seamless experience across all devices
- **Delight**: Smooth animations and micro-interactions

### Color System
- **Primary**: Blue gradient (#3B82F6 to #8B5CF6)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)
- **Neutral**: Gray scale for text and backgrounds

## 🔧 Customization

### Adding New Tools
1. Create component in `src/components/`
2. Add route to `src/App.tsx`
3. Update navigation in `src/components/Navigation.tsx`
4. Add icon and metadata to home page

### Modifying Themes
1. Update Tailwind configuration in `tailwind.config.js`
2. Modify color classes throughout components
3. Adjust gradient definitions in CSS

### Backend Customization
1. Add new fields to Google Sheets schema
2. Update Google Apps Script to handle new data
3. Modify frontend to send additional information

## 📱 Mobile Experience

AcademicFlow is fully responsive with:
- **Mobile-first design**: Optimized for small screens
- **Touch-friendly interfaces**: Large tap targets and gestures
- **Progressive Web App features**: Installable on mobile devices
- **Offline capabilities**: Core functionality works without internet

## 🔒 Privacy & Security

- **Data Minimization**: Only email addresses are collected
- **Secure Storage**: Data stored in private Google Sheets
- **No Tracking**: No third-party analytics or tracking
- **User Control**: Easy logout and data deletion
- **GDPR Compliant**: Transparent data handling practices

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Add proper error handling
- Include responsive design
- Test on multiple devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**Email gate not working?**
- Verify Google Apps Script deployment
- Check web app URL in frontend code
- Ensure "Anyone" access in script settings

**Grades not calculating correctly?**
- Check credit hour values
- Verify grade point mappings
- Ensure all required fields are filled

**Timer not starting?**
- Check browser permissions for notifications
- Verify JavaScript is enabled
- Try refreshing the page

### Getting Help

- 📧 **Email**: support@academicflow.com
- 💬 **Discord**: [Join our community](https://discord.gg/academicflow)
- 📖 **Documentation**: [Full docs](https://docs.academicflow.com)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/academicflow/issues)

## 🙏 Acknowledgments

- **Design Inspiration**: Apple's Human Interface Guidelines
- **Icons**: Lucide React icon library
- **Animations**: Framer Motion community
- **Backend**: Google Apps Script platform
- **Hosting**: Netlify for seamless deployment

## 📈 Roadmap

### Version 2.0 (Coming Soon)
- [ ] Dark mode support
- [ ] Export data functionality
- [ ] Calendar integration
- [ ] Study group features
- [ ] Mobile app (React Native)

### Version 2.1
- [ ] AI-powered study recommendations
- [ ] Integration with learning management systems
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Offline-first architecture

---

**Built with ❤️ for students, by students**

*AcademicFlow - Where academic success meets beautiful design*