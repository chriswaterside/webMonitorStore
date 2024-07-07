/* 
 * Copyright (C) 2024 chris
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

var wm, jplist;
if (typeof (wm) === "undefined") {
    wm = {};
}
wm.loader = function (options, data) {
    console.log("Loader");
    this.options = options;
    this.data = data.wmData;
    this.domainsList = data.domains.data;
    this.displayOptions = {divId: options.divId,
        paginationTop: true,
        paginationBottom: true};
    this.domains = new wm.domains();

    this.load = function () {
        console.log("Load");
        this.data.forEach(item => {
            var domain = item.domain;
            console.log(domain);
        });

        this.data.forEach(item => {
            var domain = new wm.domain(item);
            this.domains.registerDomain(domain);
        });
        var extraDomains = this.addDomainStatus();
        var div = document.getElementById(this.options.divId);
        var display = new wm.domainsDisplay(this.domains, extraDomains);
        display.load(div);

    };
    this.addDomainStatus = function () {
        var extras = [];
        this.domainsList.forEach(item => {
            var dom = this.domains.getDomain(item.domain);
            if (dom !== null) {
                dom.setStatus(item.status);
            } else {
                extras.push(item);
            }
        });
        return extras;
    };
};
