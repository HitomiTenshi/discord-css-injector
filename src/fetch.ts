import glob from 'glob';
import path from 'path';

export function fetchDiscordCore(callback: (match: string) => void) {
  glob(path.join(process.env.APPDATA, 'discord/0.0.*/modules/discord_desktop_core/core.asar'), (err, matches) => {
    if (err) {
      console.error(`Error while resolving Discord core.asar path: ${err.message}`);
      return;
    }

    if (matches.length === 1) {
      callback(matches[0]);
    } else {
      console.error('Error: Discord core.asar path could not be resolved.');
    }
  });
}
