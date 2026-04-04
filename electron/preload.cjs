const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('controlCenterDesktop', {
  platform: process.platform,
  isDesktop: true,
});
