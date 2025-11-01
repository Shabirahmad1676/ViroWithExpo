# VTour - AR-Powered Billboard & Location Explorer

An innovative augmented reality application that transforms traditional billboards into interactive AR experiences. Built with React Native, Expo, and ViroReact, VTour enables users to discover businesses, view AR content, and explore locations through immersive 3D experiences.

## 📱 About

VTour revolutionizes location-based advertising by combining AR technology with traditional billboard marketing. Scan markers with your phone to unlock interactive AR content, 3D models, and personalized experiences for businesses in your area.

## ✨ Features

### Core Functionality
- **AR Marker Detection**: Scan image markers to trigger AR experiences
- **3D Object Rendering**: Interactive 3D models and animations
- **Interactive Billboards**: Business cards and product information in AR
- **Plane Detection**: Horizontal and vertical surface tracking
- **Location-Based Discovery**: Map integration with custom markers

### User Experience
- **Trending Ads Feed**: Discover popular businesses and promotions
- **Map Explorer**: Visual location browsing with Mapbox
- **Saved Places**: Bookmark favorite locations and businesses
- **User Authentication**: Secure login with Supabase
- **Profile Management**: Customizable user settings

### AR Capabilities
- **Image Target Tracking**: Precise marker recognition
- **Object Manipulation**: Drag, rotate, and interact with AR objects
- **Material Rendering**: Realistic textures and lighting
- **Animation System**: Smooth 3D object animations

## 🛠️ Tech Stack

### Frontend
- **Framework**: React Native 0.76.9
- **Platform**: Expo SDK 52
- **Navigation**: Expo Router 4.0.20 (File-based routing)
- **AR Engine**: @reactvision/react-viro 2.43.0
- **Mapping**: @rnmapbox/maps 10.1.40
- **UI**: React Native Elements, Custom Components

### Backend & Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

### Development Tools
- **Language**: JavaScript/TypeScript
- **Testing**: Jest with jest-expo
- **Linting**: Expo ESLint
- **Build**: EAS Build

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js**: v16.17.3 or higher
- **npm**: Latest version
- **Expo CLI**: `npm install -g expo-cli`
- **EAS CLI**: `npm install -g eas-cli`
- **iOS**: Xcode 14+ and CocoaPods
- **Android**: Android Studio, Java JDK 11+

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ViroWithExpo
```

### 2. Install Dependencies

   ```bash
   npm install
   ```

**Note**: This project uses npm. If you encounter yarn-related errors, ensure you're using npm commands.

### 3. Environment Setup

Create a `.env` file in the root directory (copy from `.env.example` if available):

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Mapbox Configuration
MAPBOX_API_KEY=your_mapbox_access_token

# Google Maps Configuration
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**Important**: 
- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Environment variables are loaded via `app.config.js` using Expo Constants

### 4. Configure Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create the following tables:
   - `billboards`: Store billboard information
   - `favorites`: User saved locations
   - `users`: User profiles
3. Set up Row Level Security (RLS) policies

### 5. Run the Application

#### Development Server
```bash
npm start
```

#### Platform-Specific Commands
```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

### 6. Development Build

Since this app uses native AR modules, you need a development build:

```bash
# iOS
eas build --profile development --platform ios

# Android
eas build --profile development --platform android
```

Install the build on your device and run `npm start`.

## 📁 Project Structure

```
ViroWithExpo/
├── app/                          # Expo Router file-based routing
│   ├── (auth)/                   # Authentication group
│   │   ├── _layout.jsx          # Auth layout
│   │   ├── LogIn.jsx            # Login screen
│   │   ├── SignUp.jsx           # Registration
│   │   ├── ForgotPass.jsx       # Password recovery
│   │   └── ResetPass.jsx        # Password reset
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── _layout.jsx          # Tab layout
│   │   ├── index.jsx            # Home/Discover feed
│   │   ├── MapScreen.jsx        # Map view
│   │   ├── Camera.jsx           # AR Camera
│   │   ├── Saved.jsx            # Saved places
│   │   └── Settings.jsx         # User settings
│   ├── post/
│   │   └── [id].jsx             # Dynamic post details
│   ├── Intrest.jsx              # Interest selection
│   ├── PrivacyPolicy.jsx        # Privacy policy
│   └── +not-found.tsx           # 404 page
├── components/                   # Reusable components
│   ├── AR/                      # AR components
│   │   ├── HelloAR.jsx         # Basic AR scene
│   │   ├── MarkerScene.jsx     # AR marker detection
│   │   ├── Object3d.jsx        # 3D objects
│   │   ├── ViroARImageMarker.jsx # Image markers
│   │   └── BusinessCardARScene.js # Business AR
│   ├── Map/                     # Map components
│   │   ├── Map.jsx             # Map container
│   │   └── CustomMark.jsx      # Custom markers
│   ├── BillBoardCard.jsx       # Billboard display
│   └── ui/                      # UI components
├── AuthContext/                 # Auth state management
│   └── UserAuth.js
├── utils/                       # Utility functions
│   └── supabase.js             # Supabase client
├── constants/                   # App constants
│   └── Colors.ts               # Color scheme
├── hooks/                       # Custom React hooks
│   ├── useColorScheme.ts
│   └── useThemeColor.ts
├── assets/                      # Images, fonts, markers
│   ├── images/                 # App images
│   └── fonts/                  # Custom fonts
├── android/                     # Android native code
├── app.json                     # Expo configuration
├── eas.json                     # EAS Build configuration
└── package.json                 # Dependencies
```

## 🎯 Key Features Explained

### AR Marker System
The app uses ViroReact's image tracking to detect printed markers:
1. Scan a registered marker image with your camera
2. AR content (3D models, videos, info) appears over the marker
3. Interact with AR elements (tap, drag, rotate)

### Billboard Management
- Businesses create billboard entries in Supabase
- Each billboard has a unique marker_id
- Content syncs across devices in real-time
- Users can save favorites for offline access

### Map Integration
- Mapbox for high-performance mapping
- Custom markers for business locations
- Real-time location tracking
- Route visualization

## 🧪 Testing

```bash
npm test
```

Run tests in watch mode:
```bash
npm run test
```

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Run on Android device/emulator |
| `npm run ios` | Run on iOS device/simulator |
| `npm run web` | Run in web browser |
| `npm test` | Run Jest tests |
| `npm run lint` | Run ESLint |
| `npm run reset-project` | Reset to blank template |

## 🔧 Configuration

### EAS Build Profiles

Three build profiles in `eas.json`:

- **development**: Development client with hot reload
- **preview**: Internal distribution for testing
- **production**: App Store/Play Store builds

```bash
# Development builds
eas build --profile development --platform ios
eas build --profile development --platform android

# Production builds
eas build --profile production --platform ios
eas build --profile production --platform android
```

### Build Configuration

- **Bundle ID**: `com.bircube.vtour`
- **Android Package**: `com.bircube.vtour`
- **iOS Team**: `XPBS8GY4Q3`
- **Hermes**: Enabled
- **New Architecture**: Enabled

## 📦 Deployment

### Using EAS Submit

   ```bash
# Configure credentials
eas build:configure

# Submit to App Store
eas submit --platform ios --latest

# Submit to Google Play
eas submit --platform android --latest
```

### Pre-submission Checklist

- [ ] Update version in `app.json`
- [ ] Test on physical devices
- [ ] Verify all API keys are valid
- [ ] Check offline functionality
- [ ] Review privacy policy
- [ ] Test AR markers on various lighting conditions

## 🔐 Security Best Practices

1. **API Keys**: Never commit API keys. Use `.env` and add to `.gitignore`
2. **Supabase RLS**: Implement Row Level Security policies
3. **Auth Tokens**: Store tokens securely with AsyncStorage
4. **HTTPS**: Always use HTTPS for API calls
5. **Regular Updates**: Keep dependencies updated

## 🐛 Troubleshooting

### Common Issues

**Problem**: `yarnpkg is not recognized`
**Solution**: This project uses npm. Run `npm install` instead of yarn commands.

**Problem**: AR not working
**Solution**: AR requires a development build, not Expo Go. Build with `eas build --profile development`.

**Problem**: Map not loading
**Solution**: Verify Mapbox and Google Maps API keys in `app.json`.

**Problem**: Supabase connection failed
**Solution**: Check `.env` file exists and contains correct credentials.

**Problem**: Build failures
**Solution**: Clear cache with `npx expo start -c` and rebuild.

### Debugging Tips

```bash
# Clear cache and restart
npx expo start -c

# Reset Metro bundler
npx react-native start --reset-cache

# Clean iOS build
cd ios && pod install && cd ..

# Clean Android build
cd android && ./gradlew clean && cd ..
```

## 📚 Documentation Links

### Core Technologies
- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)

### AR Development
- [ViroReact Docs](https://viromedia.com/docs/react-viro)
- [ARMarker Tracking](https://docs.viro.com/docs/image-marker-tracking)
- [Viro3D Objects](https://docs.viro.com/docs/viro3dobject)

### Mapping & Location
- [Mapbox React Native](https://github.com/rnmapbox/maps)
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)

### Backend & Auth
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow ESLint configuration
- Use meaningful variable names
- Add comments for complex logic
- Write tests for new features

## 📄 License

This project is private and proprietary. All rights reserved.

## 👥 Team & Contact

- **Organization**: Bircube
- **Bundle ID**: com.bircube.vtour
- **Project**: VTour

## 🙏 Acknowledgments

- [Expo](https://expo.dev) for the amazing development platform
- [ViroMedia](https://viromedia.com) for AR capabilities
- [Mapbox](https://www.mapbox.com) for mapping services
- [Supabase](https://supabase.com) for backend infrastructure

## 📊 Roadmap

### Planned Features
- [ ] Multi-language support
- [ ] AR occlusion with environment
- [ ] Social sharing integration
- [ ] Analytics dashboard
- [ ] Push notifications
- [ ] Offline AR marker caching
- [ ] AR video playback
- [ ] Advanced 3D model interactions

---

**Built with ❤️ using Expo, React Native, and ViroReact**

For questions or support, please open an issue on GitHub.
