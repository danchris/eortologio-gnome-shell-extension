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

/* exported init */

const GETTEXT_DOMAIN = 'eortologio-extension';

const { GObject, St, Clutter , GLib } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Me = ExtensionUtils.getCurrentExtension();
const helpers = Me.imports.helpers;


const _ = ExtensionUtils.gettext;

let eortologioPopup;
let currentDatetime;

const EortologioPopup = GObject.registerClass(
    class EortologioPopup extends PanelMenu.Button {
        _init(currentDatetime){
            super._init(0);
            
            this.currentDatetime = currentDatetime;

            let label = new St.Label({
                text: "Eortologio",
                y_align: Clutter.ActorAlign.CENTER,
            });

            this.add_child(label);

            let currentNamedays = helpers.getNameDays(currentDatetime);
            let popupMenuExpander = new PopupMenu.PopupSubMenuMenuItem('Today');
            for (let i = 0; i < currentNamedays.length; i++){
                popupMenuExpander.menu.addMenuItem(new PopupMenu.PopupMenuItem(currentNamedays[i]));
            }
            this.menu.addMenuItem(popupMenuExpander);

            if (currentNamedays.length === 0){
                this.menu.addMenuItem(new PopupMenu.PopupMenuItem('No Celebrations today...'));
            }
        }
    }
);


class Extension {
    constructor(uuid) {
        this._uuid = uuid;

        ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
    }

    enable() {
        log(`enabling ${Me.metadata.name}`);
        currentDatetime = GLib.DateTime.new_now_local();
        eortologioPopup = new EortologioPopup(currentDatetime);
        Main.panel.addToStatusArea(this._uuid, eortologioPopup);
    }

    disable() {
        log(`disabling ${Me.metadata.name}`);
        currentDatetime.unref();
        eortologioPopup.destroy();
        eortologioPopup = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
