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
if (typeof (wm) === "undefined") {
    wm = {};
}

wm.domains = function () {
    this._domains = {};
    this.filter = null;
    this.registerDomain = function (domain) {
        // this._domains.push(domain);
        this._domains[domain.getDomainName()] = domain;
    };

    this.forEachAll = function (fcn) {

        for (var propt in this._domains) {
            fcn(this._domains[propt]);
        }
    };
    this.forEachFiltered = function (fcn) {
//        this._domains.forEachAll(domain => {
//            if (domain._displayFiltered) {
//                fcn(domain);
//            }
//        });
        for (var propt in this._domains) {
            var domain = this._domains[propt];
            if (domain._displayFiltered) {
                fcn(domain);
            }
        }
    };
    this.setAllFilters = function () {
        for (var propt in this._domains) {
            var domain = this._domains[propt];
            domain._displayFiltered = true;
        }
    };
    this.setDisplayFilter = function () {
        for (var propt in this._domains) {
            var domain = this._domains[propt];
            domain.setDisplayFilter(this.filter);
        }
    };
    this.getDomain = function (name) {
        if (name in this._domains) {
            return this._domains[name];
        }
        return null;
    };
    this.getNoEventsToDisplay = function () {
        var no = 0;
        for (var propt in this._domains) {
            var domain = this._domains[propt];
            if (domain._displayFiltered) {
                no += 1;
            }
        }
        return no;
    };
    this.length = function () {
        return this._domains.length;
    };

    this.displayItems = function (view) {
        for (var propt in this._domains) {
            var domain = this._domains[propt];
            if (domain._displayFiltered) {
                domain.displayItem(view);
            }
        }

    };
    this.getValues = function (items, link = true) {
        var out, lastItem, thisItem;
        var options;
        out = "";
        lastItem = '';
        items.forEach(item => {
            options = this.getPrefix(item);
            thisItem = this.getEventValue(options.walkValue);
            if (lastItem !== '' && thisItem !== '') {
                out += options.previousPrefix;
            }
            if (thisItem !== "") {
                out += options.prefix;
            }
            out += thisItem;
            lastItem = thisItem;
        });
        if (out === '') {
            return out;
        }
        if (link) {
            return this.addWalkLink(out);
        } else {
            return  out;
    }

    };
    this.getPrefix = function (option) {
        var options = {};
        options.previousPrefix = '';
        options.prefix = "";
        options.walkValue = option;
        var $loop = true;
        do {
            switch (options.walkValue.substr(0, 2)) {
                case "{;":
                    options.prefix += '<br/>';
                    options.walkValue = options.walkValue.replace("{;", "{");
                    break;
                case "{,":
                    options.prefix += ", ";
                    options.walkValue = options.walkValue.replace("{,", "{");
                    break;
                case "{[":
                    var $close = options.walkValue.indexOf("]");
                    if ($close > 0) {
                        options.prefix += options.walkValue.substr(2, $close - 2);
                        options.walkValue = "{" + options.walkValue.substr($close + 1);
                    } else {
                        options.prefix += options.walkValue;
                        options.walkValue = "{}";
                    }
                    break;
                case "{<":
                    var $close = options.walkValue.indexOf(">");
                    if ($close > 0) {
                        options.previousPrefix += options.walkValue.substr(2, $close - 2);
                        options.walkValue = "{" + options.walkValue.substr($close + 1);
                    } else {
                        options.previousPrefix += options.walkValue;
                        options.walkValue = "{}";
                    }
                    break;
                default:
                    $loop = false;
            }
        } while ($loop);
        return options;
    };
    this.displayDetails = function (event, domainName) {
        alert(domainName);
        var domain = this._domains[domainName];

        domain.displayInModal(event);
    };
//    this._addWalkLink = function ($text, $class = "") {
//        if ($text !== '') {
//            return  "<span class='pointer " + $class + "' onclick=\"javascript:" + ra.walk.DisplayWalkFunction + "(event,'" + this.admin.id + "')\" title='Click to display walk details'>" + $text + "</span>";
//        }
//        return $text;
//    };

//    this.setFilters = function (tag) {
//        var filter = new ra.filter(document, "reDisplayWalks");
//        this.filter = filter;
//        var groupOptions = {displaySingle: false};
//        var typeOptions = {displaySingle: false};
//        var statusOptions = {displaySingle: false};
//
//        var gradesOptions = {order: [
//                'Easy Access',
//                'Easy',
//                'Leisurely',
//                'Moderate',
//                'Strenuous',
//                'Technical']};
//
//        var dowOptions = {order: ['Monday',
//                'Tuesday',
//                'Wednesday',
//                'Thursday',
//                'Friday',
//                'Saturday',
//                'Sunday']};
//        var shapeOptions = {displaySingle: false};
//        var distanceOptions = {displaySingle: true,
//            order: ['See description',
//                'Up to 3 miles (5 km)',
//                '3+ to 5 miles (5-8 km)',
//                '5+ to 8 miles (8-13 km)',
//                '8+ to 10 miles (13-16 km)',
//                '10+ to 13 miles (16-21 km)',
//                '13+ to 15 miles (21-24 km)',
//                '15+ miles (24 km)']};
//        var updateOptions = {
//            order: [{title: 'All walks', limit: 0},
//                {title: 'In last 3 months', limit: 93},
//                {title: 'In last month', limit: 31},
//                {title: 'In last 2 weeks', limit: 14},
//                {title: 'In last week', limit: 7}
//            ]};
//        filter.addGroup(new ra.filter.groupText("idGroup", "Group", groupOptions));
//        filter.addGroup(new ra.filter.groupText("idType", "Type", typeOptions));
//        filter.addGroup(new ra.filter.groupText("idDOW", "Day of the week", dowOptions));
//        filter.addGroup(new ra.filter.groupText("idShape", "Walk Shape/Type", shapeOptions));
//        filter.addGroup(new ra.filter.groupText("idDistance", "Distance", distanceOptions));
//        filter.addGroup(new ra.filter.groupText("idGrade", "Grade", gradesOptions));
//        filter.addGroup(new ra.filter.groupDate("idDate", "Dates"));
//        filter.addGroup(new ra.filter.groupLimit("idUpdate", "Updated", updateOptions));
//        filter.addGroup(new ra.filter.groupText("idStatus", "Status", statusOptions));
//        filter.addGroup(new ra.filter.groupText("idFacilities", "Facilities"));
//        filter.addGroup(new ra.filter.groupText("idTransport", "Transport"));
//        filter.addGroup(new ra.filter.groupText("idAccessibility", "Accessibility"));
//
//        this.domains.forEach(event => {
//            event.initialiseFilter(filter);
//        });
//
//        filter.display(tag);
//        //  var fred = filter.getJson();
//    };
};
wm.domain = function (item) {
    this._domain = item.domain;
    this._path = item.path;
    this._webmonitorversion = item.webmonitorversion;
    this._reportversion = item.reportversion;
    this._nofilesscanned = item.nofilesscanned;
    this._totalsizescanned = item.totalsizescanned;
    this._directory = item.directory;
    this._directories = item.directories;
    this._files = item.files;
    this._wordpressversions = item.wordpressversions;
    this._joomlaversions = item.joomlaversions;
    this._joomlabackups = item.joomlabackups;
    this._config = item.config;
    this._creationdate = item.creationdate;
    this._latestfile = item.latestfile;
    this._largestfiles = item.largestfiles;
    this._status = "Unknown";
    this.getValue = function ($option) {
        var BR = '<br/>';
        var out = "";
        switch ($option) {
            case "{lf}":
                out = BR;
                break;
            case "{domain}":
                out = this._domain;
                break;
            case "{path}":
                out = this._path;
                break;
            case "{webmonitorversion}":
                out = this._webmonitorversion;
                break;
            case "{reportversion}":
                out = this._reportversion;
                break;
            case "{nofilesscanned}":
                out = this._nofilesscanned;
                break;
            case "{totalsizescanned}":
                out = this._totalsizescanned;
                break;
            case "{directory}":
                out = this._directory;
                break;
            case "{config}":
                out = this._config;
                break;
            case "{creationdate}":
                out = this._creationdate;
                break;
            case "{latestfile}":
                out = this._latestfile;
                break;
            case "{largestfiles}":
                out = this._largestfiles;
                break;
            case "{status}":
                out = this._status;
                break;
            default:
        }
        return out;
    };
    this._displayFiltered = function () {

    };
    this.setFilters = function (filter) {

    };
    this.setStatus = function (status) {
        this._status = status;
    };
    this.getDomainName = function () {
        return this._domain;
    };
    this.getJoomlaBackups = function () {
        return this._joomlabackups;
    };
    this.displayInModal = function (event) {
        var div = document.createElement("div");
        div.style.display = "inline-block";
        var modal = ra.modals.createModal(div);
        if (event.ctrlKey && event.altKey) {
            this.diagnostics(div);
        } else {
            this.detailsDisplay(div);
        }
    };
     this.diagnostics = function (tag) {
    var div = document.createElement("pre");
        div.classList.add( "diagnostics");
        tag.appendChild(div);

        var t = JSON.stringify(this, null, 4);
        div.innerHTML = ra.syntaxHighlight(t);
    };
};
