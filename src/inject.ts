import path from 'path';
import slash from 'slash';
import asar from 'asar';
import sh from 'shelljs';
import fs from 'fs';

import { fetchDiscordCore } from './fetch';

fetchDiscordCore(async match => {
  console.log('Injecting code...');
  const asarPath = match;
  const asarBackupPath = `${asarPath}.bak`;
  const asarOutputPath = `${asarPath}.out`;
  const corePath = asarPath.substring(0, asarPath.length - 5);
  const injectPath = path.join(corePath, 'app/mainScreen.js');
  const cssPath = slash(path.join(__dirname, '../custom.css'));

  if (fs.existsSync(asarBackupPath)) {
    sh.mv(asarBackupPath, asarPath);

    // Re-check backup path to make sure the backup succeeded.
    if (fs.existsSync(asarBackupPath)) {
      console.error('Error: Please exit Discord before running this script.');
      return;
    }
  }

  sh.cp(asarPath, asarBackupPath);
  await asar.extractAll(asarPath, corePath);
  let content = fs.readFileSync(injectPath, 'utf-8');

  const cssInjection = `
    require('fs').readFile('${cssPath}', 'utf-8', (err, userCss) => {
      const style = document.createElement('style');
      style.innerHTML = userCss;
      document.head.appendChild(style);
    });
  `;

  content = content.replace('nodeIntegration: false,', 'nodeIntegration: true,');

  content = content.replace(`mainWindow.webContents.on('new-window'`, `mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.executeJavaScript(\`${cssInjection}\`);
  });mainWindow.webContents.on('new-window'`);

  fs.writeFileSync(injectPath, content);
  await asar.createPackage(corePath, asarOutputPath);
  sh.rm('-rf', corePath);
  sh.mv(asarOutputPath, asarPath);

  // Re-check output path to make sure the injection succeeded.
  if (fs.existsSync(asarOutputPath)) {
    console.error('Error: Please exit Discord before running this script.');
    sh.rm(asarOutputPath);
    return;
  }

  console.log('Injection succeeded! Please do not move this folder or rename the "custom.css" file.');
});
