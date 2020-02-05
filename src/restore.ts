import sh from 'shelljs';
import fs from 'fs';

import { fetchDiscordCore } from './fetch';

fetchDiscordCore(match => {
  const asarPath = match;
  const asarBackupPath = `${asarPath}.bak`;

  if (fs.existsSync(asarBackupPath)) {
    sh.mv(asarBackupPath, asarPath);

    // Re-check backup path to make sure the backup succeeded.
    if (!fs.existsSync(asarBackupPath)) {
      console.log('Backup restored.');
    } else {
      console.error('Error: Please exit Discord before running this script.');
    }
  } else {
    console.log('No backup found. You are probably already running the original and unmodified Discord core.asar file.');
  }
});
