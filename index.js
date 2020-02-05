const glob = require("glob");
const path = require('path');
const slash = require('slash');
const asar = require('asar');
const sh = require('shelljs');
const fs = require('fs');

glob(path.join(process.env.HOME, 'AppData/Roaming/discord/0.0.*/modules/discord_desktop_core/core.asar'), async (_, matches) => {
  if (matches.length === 1) {
    const asarPath = matches[0];
    const asarBackupPath = `${asarPath}.bak`;
    const corePath = asarPath.substring(0, asarPath.length - 5);
    const injectPath = path.join(corePath, 'app/mainScreen.js');
    const cssPath = slash(path.join(__dirname, 'custom.css'));

    if (fs.existsSync(asarBackupPath)) {
      sh.cp(asarBackupPath, asarPath);
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
    await asar.createPackage(corePath, asarPath);
    sh.rm('-rf', corePath);
  }
});
