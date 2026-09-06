import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sainaturals.grocery',
  appName: 'Sri Sai Natural Foods',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#166534",
      showSpinner: false
    }
  }
};

export default config;
