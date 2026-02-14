/* 
 * Copyright (C) 2025 chris vaughan
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

ra.paginatedTable = function (tag) {
    this.options = {pagination: {
            "10 per page": 10,
            "20 per page": 20,
            "25 per page": 25,
            "50 per page": 50,
            "100 per page": 100,
            "View all": 0
        },
        itemsPerPage: 20,
        className: "paginatedList"
    };
    this.oddRow = false;
    this.fields = [];
    var tags = [
        {name: 'home', parent: 'root', tag: 'div', attrs: {class: this.options.className}},
        {name: 'filtersDiv', parent: 'home', tag: 'div', attrs: {class: 'filter'}},
        {name: 'rapagination1', parent: 'home', tag: 'div', attrs: {class: 'pagination top'}},
        {name: 'items1', parent: 'rapagination1', tag: 'div'},
        {name: 'pagination1', parent: 'rapagination1', tag: 'div'},
        {name: 'itemsSelect1', parent: 'rapagination1', tag: 'div'},
        {name: 'table', parent: 'home', tag: 'table', attrs: {class: 'table'}},
        {name: 'thead', parent: 'table', tag: 'thead'},
        {name: 'tbody', parent: 'table', tag: 'tbody'},
        {name: 'rapagination2', parent: 'home', tag: 'div', attrs: {class: 'pagination bottom'}},
        {name: 'items2', parent: 'rapagination2', tag: 'div'},
        {name: 'pagination2', parent: 'rapagination2', tag: 'div'},
        {name: 'itemsSelect2', parent: 'rapagination2', tag: 'div'}
    ];

    this.elements = ra.html.generateTags(tag, tags);

    this.list = new cvList(this.elements.tbody);

    var pag = this.list.createPagination(this.options.pagination, this.options.itemsPerPage);
    pag.addPaginationDisplay(this.elements.items1, 'Item {startItem} to {endItem} of {itemsNumber}');
    pag.addPaginationDisplay(this.elements.pagination1, '{paginationButtons}');
    pag.addPaginationDisplay(this.elements.itemsSelect1, '{itemsPerPage}');
    pag.addPaginationDisplay(this.elements.items2, 'Item {startItem} to {endItem} of {itemsNumber}');
    pag.addPaginationDisplay(this.elements.pagination2, '{paginationButtons}');
    pag.addPaginationDisplay(this.elements.itemsSelect2, '{itemsPerPage}');

    this._createFields = function (format) {
        format.forEach(item => {
            if ('field' in item) {
                this.fields[item.title] = this.list.createField(item.title, item.field.type);
            }
        });
    };
    this.createFilters = function (format) {
        format.forEach(item => {
            if ('field' in item) {
                var field = item.field;
                if (field.filter) {
                    this.fields[item.title].setFilter(this.elements.filtersDiv);
                }
            }
        });
    };
    //     var format = [{"title": "Domain", "options": {align: "left"}},
    //                   {"title": "File", "options": {align: "left"}}];
    this.tableHeading = function (format) {
        this._createFields(format);
        this.createFilters(format);
        var row = document.createElement("tr");
        format.forEach(item => {
            var th = document.createElement("th");
            row.appendChild(th);
            if ('options' in item) {
                if ('align' in item.options) {
                    th.classList.add(item.options.align);
                }
            }
            if ('field' in item) {
                if (item.field.sort) {
                    var field = this.fields[item.title];
                    field.addSortArrows(th);
                }
            }
            var h = document.createElement("span");
            h.innerHTML = item.title;
            th.appendChild(h);
        });
        this.elements.thead.appendChild(row);
    };
    this.tableRowStart = function () {
        this.row = document.createElement("tr");
        if (this.oddRow) {
            this.row.classList.add("odd");
        }
        this.oddRow = !this.oddRow;
        return this.row;
    };
    this.tableRowItem = function (value, item = null) {
        var td = document.createElement("td");
        td.innerHTML = value;
        this.row.appendChild(td);
        if (item !== null) {
            if ('field' in item) {
                var field = this.fields[item.title];
                field.setValue(td, value);
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
        this.list.addItem(this.row);
        this.row=null;
    };
    this.tableEnd = function () {
        this.list.display();
    };
};
ra.paginatedList = function (tag) {
    this.options = {pagination: {
            "10 per page": 10,
            "20 per page": 20,
            "25 per page": 25,
            "50 per page": 50,
            "100 per page": 100,
            "View all": 0
        },
        itemsPerPage: 20,
        className: "paginatedList"
    };
    this.oddRow = true;
    this.fields = [];
    var tags = [
        {name: 'home', parent: 'root', tag: 'div', attrs: {class: this.options.className}},
        {name: 'filtersDiv', parent: 'home', tag: 'div', attrs: {class: 'filter'}},
        {name: 'rapagination1', parent: 'home', tag: 'div', attrs: {class: 'pagination top'}},
        {name: 'items1', parent: 'rapagination1', tag: 'div'},
        {name: 'pagination1', parent: 'rapagination1', tag: 'div'},
        {name: 'itemsSelect1', parent: 'rapagination1', tag: 'div'},
        {name: 'content', parent: 'home', tag: 'div'},
        {name: 'rapagination2', parent: 'home', tag: 'div', attrs: {class: 'pagination bottom'}},
        {name: 'items2', parent: 'rapagination2', tag: 'div'},
        {name: 'pagination2', parent: 'rapagination2', tag: 'div'},
        {name: 'itemsSelect2', parent: 'rapagination2', tag: 'div'}
    ];

    this.elements = ra.html.generateTags(tag, tags);

    this.list = new cvList(this.elements.content);
    var pag = this.list.createPagination(this.options.pagination, this.options.itemsPerPage);
    pag.addPaginationDisplay(this.elements.items1, 'Item {startItem} to {endItem} of {itemsNumber}');
    pag.addPaginationDisplay(this.elements.pagination1, '{paginationButtons}');
    pag.addPaginationDisplay(this.elements.itemsSelect1, '{itemsPerPage}');
    pag.addPaginationDisplay(this.elements.items2, 'Item {startItem} to {endItem} of {itemsNumber}');
    pag.addPaginationDisplay(this.elements.pagination2, '{paginationButtons}');
    pag.addPaginationDisplay(this.elements.itemsSelect2, '{itemsPerPage}');

    this.listItem = function (tag) {
        if (this.oddRow) {
            tag.classList.add("odd");
        }
        this.oddRow = !this.oddRow;
        this.list.addItem(tag);

    };
    this.listEnd = function () {
        this.list.display();
    };
};