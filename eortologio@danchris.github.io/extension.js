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

const GETTEXT_DOMAIN = 'my-indicator-extension';

const { GObject, St } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Me = ExtensionUtils.getCurrentExtension();


const _ = ExtensionUtils.gettext;

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        // panelButton = new St.Bin({
        //     style_class : "panel-button"
        // });
        // panelButtonText = new St.Label({
        //     style_class : "examplePanelText",
        //     text : "starting..."
        // });
        // panelButton.set_child(panelButtonText);
        super._init(0.0, _('My Shiny Indicator'));

        // this.add_child(new St.Icon({
        //     icon_name: 'face-smile-symbolic',
        //     style_class: 'system-status-icon',
        // }));
        let my_var = "daniel"
        let label = new St.Label({
            text: my_var,
            style_class: 'example-style',
            y_align: St.TextAlign.CENTER,
        });
        log(`Creating new label ${label.get_text()}`);
        this.add_child(label);
        // let item = new PopupMenu.PopupMenuItem(_('Show Notification'));
        // item.connect('activate', () => {
        //     Main.notify(_('Whatʼs up, folks?'));
        // });
        // this.menu.addMenuItem(item);
        // log('ela re');
        // let label = new St.Label({text:'Item 1'});
        // log(`creating label ${label}`);
        // this.menu.addMenuItem(label);
    }
});

class Extension {
    constructor(uuid) {
        this._uuid = uuid;

        ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
    }

    enable() {
        log(`enabling ${Me.metadata.name}`);
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this._uuid, this._indicator);
    }

    disable() {
        log(`disabling ${Me.metadata.name}`);
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
