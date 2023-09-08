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

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Helpers from './helpers.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

 let eortologioPopup;
 let currentDateTime;

const EortologioPopup = GObject.registerClass(
class EortologioPopup extends PanelMenu.Button {
    _init(currentDateTime) {
            super._init(0);

            this.currentDateTime = currentDateTime;

            let label = new St.Label({
                text: "Eortologio",
                y_align: Clutter.ActorAlign.CENTER,
            });

            this.add_child(label);

            let currentNamedays = Helpers.getNameDays(this.currentDateTime);
            if (currentNamedays.length === 0){
                this.menu.addMenuItem(new PopupMenu.PopupMenuItem('No Celebrations today...'));
            }
            else {
                let popupMenuExpander = new PopupMenu.PopupSubMenuMenuItem('Today');
                for (let i = 0; i < currentNamedays.length; i++){
                    popupMenuExpander.menu.addMenuItem(new PopupMenu.PopupMenuItem(currentNamedays[i]));
                }
                this.menu.addMenuItem(popupMenuExpander);
            }
        }
    }
);

export default class EortologioPopupExtension extends Extension {
    enable() {
        currentDateTime = GLib.DateTime.new_now_local();
        this._eortologioPopup = new EortologioPopup(currentDateTime);
        Main.panel.addToStatusArea(this.uuid, this._eortologioPopup);
    }

    disable() {
        currentDateTime = null
        this._eortologioPopup.destroy();
        this._eortologioPopup = null;
    }
}
