/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import St from 'gi://St';
import Clutter from 'gi://Clutter';

import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Helpers from './helpers.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';


const EortologioPopup = GObject.registerClass(
class EortologioPopup extends PanelMenu.Button {
    _init() {
        super._init(0);
        let label = new St.Label({
            text: _("Eortologio"),
            y_align: Clutter.ActorAlign.CENTER,
        });

        this.add_child(label);

        // Set the label for screen readers
        this.set_label_actor(label);

        // Initial time and nameday population
        this.dateTime = GLib.DateTime.new_now_local();
        let todayNames = Helpers.getNameDays(this.dateTime);
        let tomorrowNames = Helpers.getNameDays(this.dateTime.add_days(1));
        updateMenu(this.menu, todayNames, tomorrowNames);

        // Update every hour
        this._timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 60 * 60, () => {
            let currDateTime = GLib.DateTime.new_now_local();
            if (this.dateTime.get_day_of_month() !== currDateTime.get_day_of_month() ||
                this.dateTime.get_month() !== currDateTime.get_month() ||
                this.dateTime.get_year() !== currDateTime.get_year()) {
                
                this.dateTime = currDateTime;
                let todayNames = Helpers.getNameDays(this.dateTime);
                let tomorrowNames = Helpers.getNameDays(this.dateTime.add_days(1));
                updateMenu(this.menu, todayNames, tomorrowNames);
            }
            return GLib.SOURCE_CONTINUE;
        });

        this.connect('destroy', () => {
            GLib.Source.remove(this._timeoutId);
            this._timeoutId = null;
        });
    }
});

export default class EortologioPopupExtension extends Extension {
    enable() {
        this._EortologioPopup = new EortologioPopup();
        Main.panel.addToStatusArea(this.uuid, this._EortologioPopup);
    }

    disable() {
        this._EortologioPopup.destroy();
        this._EortologioPopup = null;
    }
}

function updateMenu(menu, todayNames, tomorrowNames) {
    if (!menu.isEmpty()) {
        menu.removeAll();
    }

    // Today section
    if (todayNames.length === 0) {
        menu.addMenuItem(new PopupMenu.PopupMenuItem(_('No Celebrations today...')));
    } else {
        let todaySubmenu = new PopupMenu.PopupSubMenuMenuItem(_('Today'));
        for (let name of todayNames) {
            todaySubmenu.menu.addMenuItem(new PopupMenu.PopupMenuItem(name));
        }
        menu.addMenuItem(todaySubmenu);
    }

    // Tomorrow section
    if (tomorrowNames.length === 0) {
        menu.addMenuItem(new PopupMenu.PopupMenuItem(_('No Celebrations tomorrow...')));
    } else {
        let tomorrowSubmenu = new PopupMenu.PopupSubMenuMenuItem(_('Tomorrow'));
        for (let name of tomorrowNames) {
            tomorrowSubmenu.menu.addMenuItem(new PopupMenu.PopupMenuItem(name));
        }
        menu.addMenuItem(tomorrowSubmenu);
    }
}
