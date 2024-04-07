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
 
 
const EortologioPopup = GObject.registerClass(
  class EortologioPopup extends PanelMenu.Button {
    _init() {
      super._init(0);
      let label = new St.Label({
        text: "Eortologio",
        y_align: Clutter.ActorAlign.CENTER,
      });
 
      this.add_child(label);
      
      // set the label that describes the button for screenreader users
      this.set_label_actor(label);
 
      // This is the time at construction, which is the same as the time
      // when `enable()` is called.
      this.dateTime = GLib.DateTime.new_now_local();
      let initialNamedays = Helpers.getNameDays(this.dateTime);
      updateMenu(this.menu, initialNamedays);
      
      this._timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT,
        60 * 60, () => {
 
          // This is current time when the callback is invoked we are now inside
          let currDateTime = GLib.DateTime.new_now_local();
          if (this.dateTime.get_day_of_month() != currDateTime.get_day_of_month() ||
            this.dateTime.get_month() != currDateTime.get_month() ||
            this.dateTime.get_year() != currDateTime.get_year()
          ) {
            // The day has changed, so we update the reference time and menu
            this.dateTime = currDateTime;
            let currentNamedays = Helpers.getNameDays(this.dateTime);
            updateMenu(this.menu, currentNamedays);
          }
          return GLib.SOURCE_CONTINUE;
        });
        
      this.connect('destroy', () => {
        GLib.Source.remove(this._timeoutId);
        this._timeoutId = null;
      });

    }
  }
);
 
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
 
function updateMenu(menu, names) {
 
  if (!menu.isEmpty()) {
    menu.removeAll()
  }
 
  if (names.length === 0){
    menu.addMenuItem(new PopupMenu.PopupMenuItem('No Celebrations today...'));
  }
  else {
    let popupMenuExpander = new PopupMenu.PopupSubMenuMenuItem('Today');
    for (let i = 0; i < names.length; i++){
      popupMenuExpander.menu.addMenuItem(new PopupMenu.PopupMenuItem(names[i]));
    }
    menu.addMenuItem(popupMenuExpander);
  }
}
