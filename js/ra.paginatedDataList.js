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


var ra;
if (typeof (ra) === "undefined") {
    ra = {};
}


ra.paginatedDataList = function (tag) {
    this.filtersDiv = document.createElement("div");
    this.filtersDiv.classList.add("pagination-filter");
    tag.appendChild(this.filtersDiv);
    this.rapagination1 = document.createElement("div");
    this.rapagination1.classList.add("pagination");
    this.rapagination1.classList.add("top");
    tag.appendChild(this.rapagination1);
    this.contentDiv = document.createElement("div");
    tag.appendChild(this.contentDiv);
    this.rapagination2 = document.createElement("div");
    this.rapagination2.classList.add("pagination");
    this.rapagination2.classList.add("bottom");
    tag.appendChild(this.rapagination2);

    this.jplistGroup = ra.uniqueID();

    //   this.myjplist = new ra.jplist(this.settings.jplistGroup);
    this.itemsPerPage = 20;
    jplistName: "name1";
    this.jplistName = 'jpl' + ra.uniqueID();

    this.myjplist = new ra.jplist(this.jplistGroup);
    this.noPagination = false;
    this.tableClass = "paginatedTable";
    this.oddRow = true;

//  out += this.myjplist.addFilter('wTitle', 'Title', 'text');

    this.addPagination = function (no, tag) {
        this.myjplist.addPagination(no, tag, this.jplistName, this.itemsPerPage);
        return;
    };
    this.addPagination(22, this.rapagination1);
    this.addPagination(22, this.rapagination2);

    this.setTableClass = function (tableClass) {
        this.tableClass = tableClass;
    };
    this.tableHeading = function (format) {

        this.table = document.createElement("table");
        this.table.classList.add(this.tableClass);
        this.table.setAttribute("data-jplist-group", this.jplistGroup);
        this.contentDiv.appendChild(this.table);
        var row = document.createElement("tr");
        this.table.appendChild(row);
        format.forEach(item => {
            var th = document.createElement("th");
            th.textContent = item.title;
            row.appendChild(th);
            if ('options' in item) {
                if ('align' in item.options) {
                    th.classList.add(item.options.align);
                }
            }
        });
        this.oddRow = true;
    };
    this.tableRowStart = function () {
        //  $out += "<tr data-jplist-item ><td>";
        this.row = document.createElement("tr");
        this.row.setAttribute("data-jplist-item", true);
        if (this.oddRow === true) {
            this.row.classList.add("odd");
        }
        this.table.appendChild(this.row);
        this.oddRow = !this.oddRow;
        return this.row;
    };
    this.tableRowItem = function (value, options = null) {
        var td = document.createElement("td");
        td.innerHTML = value;
        this.row.appendChild(td);
        if (options !== null) {
            if ('align' in options) {
                td.classList.add(options.align);
            }
        }
        return td;
    };
    this.tableRowEnd = function () {

    };
    this.tableEnd = function () {
        if (!this.noPagination) {
            this.myjplist.init('ra-display');
        }
    };
    this.addFilters = function (tag) {
        var out = '';
        out += this.myjplist.addFilter('wTitle', 'Title', 'text');
        var min, max;
        var result = this.routes;
        min = result.reduce(function (a, b) {
            var km = Math.floor(b.distance / 1000);
            return Math.min(a, km);
        }, 99999);
        max = result.reduce(function (a, b) {
            var km = Math.ceil(b.distance / 1000);
            return Math.max(a, km);
        }, -99999);
        out += this.myjplist.addFilter('wDistance', 'Distance Km', 'number', min, max);
        tag.innerHTML = out;

    };
};