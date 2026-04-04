import type { CapacitorConfig } from '@capacitor/cli';

const devServer = process.env['CAP_DEV_URL']
  ? {
      server: {
        url: process.env['CAP_DEV_URL'],
        cleartext: true,
      },
    }
  : {};

const config: CapacitorConfig = {
  appId: 'com.controlcenter.app',
  appName: 'Control Center',
  webDir: 'dist/control-center/browser',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
  ...devServer,
};

export default config;
