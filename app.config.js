import 'dotenv/config';

export default {
  expo: {
    name: "SeniorDesignProject",
    slug: "SeniorDesignProject",
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF'
      }
    },
    web: {
      favicon: './assets/favicon.png'
    },
    extra: {
      apiKey: pro.env.API_KEY,
      authDomain: proc.env.AUTH_DOMAIN,
      projectId: proc.env.PROJECT_ID,
      storageBucket: pro.env.STORAGE_BUCKET,
      messagingSenderId: pro.env.MESSAGING_SENDER_ID,
      appId: pro.env.APP_ID
    }
  }
};