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
        format.forEach(item => {
            if ('filter' in item) {
                this.addFilters(this.filtersDiv, item);
            }
        });

        this.table = document.createElement("table");
        this.table.classList.add(this.tableClass);
        this.table.setAttribute("data-jplist-group", this.jplistGroup);
        this.contentDiv.appendChild(this.table);
        var row = document.createElement("tr");
        this.table.appendChild(row);
        format.forEach(item => {
            var th = document.createElement("th");
            th.innerHTML = item.title;
            row.appendChild(th);
            if ('options' in item) {
                if ('align' in item.options) {
                    th.classList.add(item.options.align);
                }
            }
            if (item.sort) {
                this.myjplist.sortButton(th, item.id, item.sort.type, "asc", "▲");
                this.myjplist.sortButton(th, item.id, item.sort.type, "desc", "▼");
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
    this.tableRowItem = function (value, item = null) {
        var td = document.createElement("td");
        td.innerHTML = value;
        this.row.appendChild(td);
        if (item!==null) {
            if ('id' in item) {
                td.classList.add(item.id);
            }
            var options = item.options;
            if (options) {
                if ('align' in options) {
                    td.classList.add(options.align);
                }
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
    this.addFilters = function (tag, item) {
        var filter = item.filter;
        var min = 0;
        var max = 999999;
        if (item.type === "number") {
            var result = item.values.map(Number);
            min = result.reduce(function (a, b) {
                return Math.min(a, b);
            }, 99999);
            max = result.reduce(function (a, b) {
                return Math.max(a, b);
            }, -99999);
        }
        tag.innerHTML += this.myjplist.addFilter(item.id, item.title, filter.type, min, max);

    };
};