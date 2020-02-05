# Discord CSS Injector
This NodeJS script will inject bootstrapping code into Discord, which will then load your **custom.css** file whenever Discord starts or reloads.

# Supported Platforms

- Windows

# How To Run
Clone or download the repository. Make sure to place the **discord-css-injector** folder somewhere where you won't move it again, since Discord will load the **custom.css** file from that folder after executing this script.

Make sure to exit Discord before running this script.

Once you are prepared, run the following commands inside the **discord-css-injector** folder:

- `npm install`
- `npm start`

That's it. Start Discord and your **custom.css** file will be loaded.

This script will create a backup of your original Discord core.asar file. You can restore it again whenever you feel like it. See instructions below.

Enjoy.

# How To Restore The Backup

Make sure to exit Discord before running this script.

Run the following command inside the **discord-css-injector** folder:

- `npm run restore`

After that start Discord and you're back to the vanilla experience.
