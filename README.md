# Eortologio Gnome Shell Extension
Simple gnome extension to display the greek namedays. Shows only the namedays of current day (today). 

**Note**: *Some namedays may missing.*

# How it works

Eortologio Extension has two JSON files with most of Greek namedays, that act as the database. These files called `recurring_namedays.json` and `relative_to_easter.json` and I found it on [Greek-namedays](https://github.com/alexstyl/Greek-namedays) repo. Special thanks to [@alexstyl](https://github.com/alexstyl) for his great work.

Feel free to open an issue if you have found a bug or wish to see a feature implemented.

## Development

Place the project to 
```sh
$HOME/.local/share/gnome-shell/extensions/
```
and reload **gnome-shell**

## Debugging
```sh
journalctl -f -o cat /usr/bin/gnome-shell 
```
> **_NOTE:_**  For Wayland desktops use `debug.sh` to run a nested instance of GNOME Shell.
