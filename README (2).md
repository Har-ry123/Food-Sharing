# 🍽️ SharePlate - Community Food Sharing Platform

A full-stack social beneficial project that helps reduce food waste and build community connections by enabling neighbors to share excess food with each other.

## 🌟 Social Impact

**SharePlate** addresses several critical social issues:

- **Reduces Food Waste**: Connects people with excess food to those who need it
- **Builds Community**: Fosters meaningful connections between neighbors
- **Supports Sustainability**: Promotes environmental consciousness
- **Helps Those in Need**: Provides access to food for community members
- **Creates Local Networks**: Strengthens neighborhood bonds

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure registration and login system
- **Food Sharing**: Post excess food items with photos and details
- **Real-time Updates**: Live notifications using Socket.io
- **Request System**: Request food items and manage responses
- **Community Stats**: Track impact and participation metrics
- **Search & Filter**: Find specific food items easily

### User Experience
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Real-time Notifications**: Instant updates for requests and responses
- **Profile Management**: Track your sharing and receiving history
- **Community Dashboard**: View all available food items

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **Lucide React** - Beautiful icons
- **Date-fns** - Date formatting utilities

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing
- **JWT-like Authentication** - Secure user sessions

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd shareplate-fullstack
```

### 2. Install Dependencies
```bash
# Install root dependencies (backend)
npm install

# Install frontend dependencies
cd vite-project
npm install
```

### 3. Start the Development Servers

#### Option A: Start Both Servers (Recommended)
```bash
# From the root directory
npm run dev
```

#### Option B: Start Servers Separately
```bash
# Terminal 1 - Start backend server
npm run server

# Terminal 2 - Start frontend server
npm run client
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Backend Server**: http://localhost:3001

## 🎯 How to Use

### 1. Create an Account
- Visit the homepage and click "Get Started"
- Fill in your details and create your account
- Add your location to help with local matching

### 2. Share Food
- Click "Share Food" in the navigation
- Fill in the food item details:
  - Title and description
  - Quantity and expiry date
  - Pickup location
  - Optional image URL
- Submit to share with your community

### 3. Request Food
- Browse available items on the dashboard
- Click "Request This Food" on items you need
- Wait for the donor to accept or decline

### 4. Manage Requests
- Donors can accept or decline requests
- Real-time notifications keep everyone updated
- Track your sharing history in your profile

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Food Items
- `GET /api/food-items` - Get all food items
- `POST /api/food-items` - Add new food item
- `POST /api/food-items/:id/request` - Request food item
- `POST /api/food-items/:id/respond` - Accept/reject request

### User Profile
- `GET /api/profile` - Get user profile and activity
- `GET /api/stats` - Get community statistics

## 🌐 Real-time Features

- **Live Updates**: New food items appear instantly
- **Request Notifications**: Donors are notified of requests
- **Status Changes**: Real-time updates when items are claimed
- **Community Stats**: Live statistics updates

## 🎨 UI Components

- **Responsive Cards**: Food item display with status badges
- **Form Validation**: Client-side and server-side validation
- **Loading States**: Smooth user experience with loading indicators
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Confirmation messages for actions

## 🔒 Security Features

- **Token-based Authentication**: Secure user sessions
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin handling
- **Error Handling**: Graceful error responses

## 📊 Community Impact Tracking

- **Donation Counts**: Track items shared and received
- **User Statistics**: Monitor community participation
- **Success Metrics**: Measure successful food sharing
- **Activity History**: Personal sharing and receiving logs

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
# Build frontend
cd vite-project
npm run build

# Start production server
npm run server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Community Focus**: Built for social impact and community building
- **Sustainability**: Promoting environmental consciousness
- **Local Networks**: Strengthening neighborhood connections
- **Food Security**: Supporting access to food resources

---

**SharePlate** - Connecting communities through food sharing, one meal at a time. 🌱 