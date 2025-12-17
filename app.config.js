require('dotenv').config();

module.exports = {
  expo: {
    name: "vtour",
    slug: "vtour",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: false,
    jsEngine: "hermes",
    ios: {
      supportsTablet: true,
      jsEngine: "hermes",
      infoPlist: {
        NSPhotoLibraryUsageDescription: "Allow $(PRODUCT_NAME) to access your photos",
        NSPhotoLibraryAddUsageDescription: "Allow $(PRODUCT_NAME) to save photos",
        NSCameraUsageDescription: "Allow $(PRODUCT_NAME) to use your camera",
        NSMicrophoneUsageDescription: "Allow $(PRODUCT_NAME) to use your microphone"
      },
      bundleIdentifier: "com.bircube.vtour",
      appleTeamId: "XPBS8GY4Q3"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.bircube.vtour",
      jsEngine: "hermes",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "@reactvision/react-viro",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "expo-router",
      [
        "@rnmapbox/maps",
        {
          RNMapboxMapsDownloadToken: process.env.MAPBOX_API_KEY
        }
      ],
      [
        "expo-location",
        {
          locationWhenInUsePermission: "Show Current location on map"
        }
      ],
      [
        "expo-build-properties",
        {
          "android": {
            "compileSdkVersion": 35,
            "targetSdkVersion": 34,
            "buildToolsVersion": "35.0.0",
            "packagingOptions": {
              "pickFirst": [
                "lib/x86/libc++_shared.so",
                "lib/x86_64/libc++_shared.so",
                "lib/armeabi-v7a/libc++_shared.so",
                "lib/arm64-v8a/libc++_shared.so"
              ]
            }
          }
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "dba58267-5b96-494f-8306-27ca4c6bb670"
      },
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      mapboxApiKey: process.env.MAPBOX_API_KEY,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
    }
  }
};

