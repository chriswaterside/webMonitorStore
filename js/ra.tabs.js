/* 
 * Copyright (C) 2024 chris vaughan
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */

var document;
if (typeof (ra) === "undefined") {
    ra = {};
}

ra.tabs = function (options) {
//  this.options = {div: null,
//        tabs: {id0: {title: "one"},
//            id10: {title: "two"},
//            id20: {title: "three"},
//            id30: {title: "extras", enabled: false}},
//            tabClass: 'myclass'};

    this.options = options;
    this.buttons = [];
    this.display = function () {
        var tags = [
            {name: 'container', parent: 'root', tag: 'div', attrs: {class: 'ra tabs'}},
            {name: 'tabContainer', parent: 'container', tag: 'div', attrs: {class: 'ra tabContainer'}},
            {name: 'contentContainer', parent: 'container', tag: 'div', attrs: {class: 'ra contentContainer'}}
        ];
        this.tabsContainer = this.options.div;
        this.elements = ra.html.generateTags(this.options.div, tags);
        if ('tabClass' in options) {
            this.elements.container.classList.add(options.tabClass);
        }
        for (const property in this.options.tabs) {
            var id = property;
            var item = this.options.tabs[id];
            var enabled = true;
            var title = item.title;
            if (typeof (item.enabled) !== "undefined" && item.enabled !== null) {
                enabled = item.enabled;
            }
            if (enabled) {
                var button = document.createElement('button');
                button.textContent = title;
                button.setAttribute("data-id", id);
                this.elements.tabContainer.appendChild(button);
                this.buttons.push(button);
            }
        }
        var _this = this;
        this.buttons.forEach((button) => {
            button.addEventListener("click", function (e) {
                _this.buttons.forEach((item) => {
                    item.classList.remove("active");
                });
                _this._displayContent(this);
            });
        });

        this._displayContent(this.buttons[0]);
    };

    this._displayContent = function (button) {
        var id = button.getAttribute("data-id");
        button.classList.add("active");
        const displayEvent = new Event("displayTabContents");
        displayEvent.tabDisplay = {tab: id,
            displayInElement: this.elements.contentContainer};
        // set attribute to allow different styling for each content
        this.elements.contentContainer.setAttribute('data-tab', id);
        this.elements.contentContainer.textContent = "";
        this.tabsContainer.dispatchEvent(displayEvent);
    };
};
