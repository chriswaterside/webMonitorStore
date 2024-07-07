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


ra.paginatedDataList = function (contentDiv) {
    this.contentDiv = contentDiv;
    jplistGroup: ra.uniqueID();
    //   this.myjplist = new ra.jplist(this.settings.jplistGroup);
    jplistName: "name1";
    this.jplistName = 'jpl' + ra.uniqueID();
    this.tableClass = "paginatedTable";
    this.oddRow = true;

    this.setTableClass = function (tableClass) {
        this.tableClass = tableClass;
    }
    this.tableHeading = function (format) {
        this.table = document.createElement("table");
        this.table.classList.add(this.tableClass);
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
        this.row = document.createElement("tr");
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
};