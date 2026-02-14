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

    this.displayDetails = function (event, domainName) {
        var domain = this._domains[domainName];
        domain.displayInModal(event);
    };
    this.displayControlFile = function (event, domain, controlFile) {
        var domain = this._domains[domain];
        domain.displayControlFile(controlFile);
    };

};
wm.domain = function (item) {
    this._domain = item.domain;
    this._path = item.path;
    this._webMonitorVersion = item.webMonitorVersion;
    this._reportVersion = item.reportVersion;
    this._noFilesScanned = item.noFilesScanned;
    this._totalSizeScanned = item.totalSizeScanned;
    this._topLevelDirectories = item.topLevelDirectories;
    this._controlFiles = item.controlFiles;
    this._wordPressVersions = item.wordPressVersions;
    this._joomlaVersions = item.joomlaVersions;
    this._joomlaBackups = item.joomlaBackups;
    this._config = item.config;
    this._creationDate = ra.date.getDateTime(item.creationDate);
    this._latestFiles = item.latestFiles;
    this._largestFiles = item.largestFiles;
    this._status = "";

    for (const i in this._largestFiles) {
        var item = this._largestFiles[i];
        item.size = Number(item.size);
    }
    for (const i in this._latestFiles) {
        var item = this._latestFiles[i];
        item.date = ra.date.getDateTime(item.date);
    }

    this.getValues = function (items, link = true) {
        var out, lastItem, thisItem;
        var options;
        out = "";
        lastItem = '';
        items.forEach(item => {
            options = this.getPrefix(item);
            thisItem = this.getValue(options.walkValue);
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
//        if (link) {
//            return this.addWalkLink(out);
//        } else {
        return  out;
        // }

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
    this.getValue = function ($option) {
        var BR = '<br/>';
        var out = "";
        switch ($option) {
            case "{lf}":
                out = BR;
                break;
            case "{domain}":
                out = "<span data-domaindetails='" + this._domain + "'>" + this._domain + "</span>";
                break;
            case "{path}":
                out = this._path;
                break;
            case "{webmonitorversion}":
                out = this._webMonitorVersion;
                break;
            case "{reportversion}":
                out = this._reportVersion;
                break;
            case "{nofilesscanned}":
                out = this._noFilesScanned.toLocaleString();
                break;
            case "{totalsizescanned}":
                out = this._totalSizeScanned.toLocaleString();
                break;
            case "{directory}":
                out = this._directory;
                break;
            case "{config}":
                out = this._config;
                break;
            case "{creationdate}":
                var date = ra.date.YYYYMMDDmmhhss(this._creationDate);
                var diff = ra.date.periodInDays(this._creationDate, Date.now());
                if (diff > 7) {
                    diff = 7;
                }
                out = "<span data-creation-days='" + diff;
                out += "' title='Last scanned " + diff + " days ago'>" + date + "</span>";
                break;
            case "{latestchange}":
                out = "";
                for (const i in this._latestFiles) {
                    var item = this._latestFiles[i];
                    out = ra.date.YYYYMMDDmmhhss(item.date) + " - " + item.path;
                    break;
                }
                break;
            case "{latestchangedate}":
                out = "";
                for (const i in this._latestFiles) {
                    var item = this._latestFiles[i];
                    out = ra.date.YYYYMMDDmmhhss(item.date);
                    break;
                }
                break;
            case "{largestfile}":
                out = "";
                for (const i in this._largestFiles) {
                    var item = this._largestFiles[i];
                    out = item.size.toLocaleString() + " - " + item.path;
                    break;
                }
                break;
            case "{largestfilesize}":
                out = "";
                for (const i in this._largestFiles) {
                    var item = this._largestFiles[i];
                    out = item.size.toLocaleString();
                    break;
                }
                break;
            case "{status}":
                out = "<span class='status " + this._status + "'>" + this._status + "</span>";
                break;
            case "{topLevelDirectories}":
                out = this.arrayAsVerticalList(this._topLevelDirectories);
                break;
            case "{controlFiles}":
                out = this.getControlFiles();
                break;
            case "{joomlaVersions}":
                out = this.getJoomlaVersions();
                break;
            case "{wordPressVersions}":
                out = this.getWordPressVersions();
                break;
            case "{joomlaConfig}":
                out = this.getJoomlaConfigs();
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
        return this._joomlaBackups;
    };
    this.displayInModal = function (event) {
        var div = document.createElement("div");
        div.style.display = "inline-block";
        ra.modals.createModal(div);
        if (event.ctrlKey && event.altKey) {
            this.diagnostics(div);
        } else {
            this.detailsDisplay(div);
        }
    };
    this.diagnostics = function (tag) {
        var div = document.createElement("pre");
        div.classList.add("diagnostics");
        tag.appendChild(div);
        var t = JSON.stringify(this, null, 4);
        div.innerHTML = ra.syntaxHighlight(t);
    };
    this.detailsDisplay = function (tag) {
        var div = document.createElement("h2");
        div.textContent = this._domain;
        tag.appendChild(div);
        var div = document.createElement("h4");
        div.textContent = "Path: " + this._path;
        tag.appendChild(div);
        var div = document.createElement("p");
        div.textContent = "No file scanned: " + this._noFilesScanned.toLocaleString();
        tag.appendChild(div);
        var div = document.createElement("p");
        div.textContent = "Total size scanned: " + this._totalSizeScanned.toLocaleString();
        tag.appendChild(div);
        var div = document.createElement("p");
        div.textContent = "Date of scan: " + ra.date.dowShortddmmyyyy(this._creationDate) + " " + ra.time.HHMM(this._creationDate);
        tag.appendChild(div);

        tag.appendChild(document.createElement("hr"));
        this.displayLatestChanges(tag);
        tag.appendChild(document.createElement("hr"));

        var div = document.createElement("h4");
        div.textContent = "Top level folders";
        tag.appendChild(div);
        var ul = document.createElement("ul");
        tag.appendChild(ul);
        this._topLevelDirectories.forEach(item => {
            if (item !== "") {
                var li = document.createElement("li");
                li.textContent = item;
                ul.appendChild(li);
            }
        });
        tag.appendChild(document.createElement("hr"));
        this.displayLargestFiles(tag);
        tag.appendChild(document.createElement("hr"));

        this.displayControlFiles(tag);
        tag.appendChild(document.createElement("hr"));
        this.displayWordPressVersions(tag);
        this.displayJoomlaVersions(tag);
        this.displayJoomlaConfigs(tag);

        var div = document.createElement("p");
        div.textContent = "Web Monitor version: " + this._webMonitorVersion;
        tag.appendChild(div);
        var div = document.createElement("p");
        div.textContent = "Report version version: " + this._reportVersion;
        tag.appendChild(div);
    };
    this.displayLatestChanges = function (tag) {
        var div = document.createElement("h4");
        div.textContent = "Latest Changes";
        tag.appendChild(div);
        var ul = document.createElement("ul");
        tag.appendChild(ul);
        for (const i in this._latestFiles) {
            var item = this._latestFiles[i];
            var li = document.createElement("li");
            li.textContent = ra.date.YYYYMMDDmmhhss(item.date) + " - " + item.path;
            ul.appendChild(li);
        }
    };
    this.displayLargestFiles = function (tag) {
        var div = document.createElement("h4");
        div.textContent = "Largest Files";
        tag.appendChild(div);
        var ul = document.createElement("ul");
        tag.appendChild(ul);
        for (const i in this._largestFiles) {
            var item = this._largestFiles[i];
            var li = document.createElement("li");
            li.textContent = item.size.toLocaleString() + " - " + item.path;
            ul.appendChild(li);
        }
    };
    this.displayJoomlaVersions = function (tag) {
        if (Object.getOwnPropertyNames(this._joomlaVersions).length > 0) {
            var div = document.createElement("h4");
            div.textContent = "Joomla Installs";
            tag.appendChild(div);
            var ul = document.createElement("ul");
            tag.appendChild(ul);
            for (const key in this._joomlaVersions) {
                var li = document.createElement("li");
                li.textContent = this._joomlaVersions[key] + " - " + key;
                ul.appendChild(li);
            }
            tag.appendChild(document.createElement("hr"));
        }
    };
    this.displayJoomlaConfigs = function (tag) {
        var div = document.createElement("h4");
        div.textContent = "Joomla Config";
        tag.appendChild(div);
        var contentDiv = document.createElement("div");
        tag.appendChild(contentDiv);
        contentDiv.innerHTML = this.getJoomlaConfigs();
        tag.appendChild(document.createElement("hr"));
    };
    this.displayWordPressVersions = function (tag) {
        if (Object.getOwnPropertyNames(this._wordPressVersions).length > 0) {
            var div = document.createElement("h4");
            div.textContent = "WordPress Installs";
            tag.appendChild(div);
            var ul = document.createElement("ul");
            tag.appendChild(ul);
            for (const key in this._wordPressVersions) {
                var li = document.createElement("li");
                li.textContent = key + " - " + this._wordPressVersions[key];
                ul.appendChild(li);
            }
            tag.appendChild(document.createElement("hr"));
        }
    };
    this.displayControlFiles = function (tag) {
        var div = document.createElement("h4");
        div.textContent = "Control Files";
        tag.appendChild(div);
        var ul = document.createElement("ul");
        tag.appendChild(ul);
        var _this = this;
        for (const item in this._controlFiles) {
            var li = document.createElement("li");
            li.textContent = item;
            li.classList.add("pointer");
            li.setAttribute("data-controlfile", item);
            ul.appendChild(li);
            li.addEventListener("click", function (e) {
                var controlFile = e.target.dataset.controlfile;
                _this.displayControlFile(controlFile);
            });
        }

    };
    this.displayControlFile = function (controlFile) {
        var div = document.createElement("div");
        div.style.display = "inline-block";
        var heading = document.createElement("h4");
        heading.textContent = "Control File - " + controlFile;
        div.appendChild(heading);
        var content = document.createElement("code");
        content.innerText = this._controlFiles[controlFile];
        div.appendChild(content);

        ra.modals.createModal(div);

    };

    this.getControlFiles = function () {
        var out = "";
        for (const item in this._controlFiles) {
            out += "<span data-domain='" + this._domain + "' data-controlfile='" + item + "'>" + item + "</span><br/>";
        }
        return out;
    };
    this.getJoomlaVersions = function () {
        var out = "";
        for (const key in this._joomlaVersions) {
            out += this._joomlaVersions[key] + " - " + key + "<br/>";
        }
        return out;
    };
    this.getWordPressVersions = function () {
        var out = "";
        for (const key in this._wordPressVersions) {
            out += this._wordPressVersions[key] + " - " + key + "<br/>";
        }
        return out;
    };
    this.getJoomlaConfigs = function () {
        var out = "<table>";
        for (const key in this._config) {
            out += "</tr>";
            out += "<td>" + key + "</td>";
            out += "<td>" + this.getJoomlaConfig(this._config[key]) + "</td>";
            out += "</tr>";
        }
        out += "</table>";
        return out;
    };
    this.getJoomlaConfig = function (item) {
        var out = "";
        for (const key in item) {
            out += key + " - " + item[key] + "<br/>";
        }
        return out;
    };
    this.arrayAsVerticalList = function (arr) {
        var out = "";
        arr.forEach(item => {
            if (item !== "") {
                out += item + "<br/>";
            }
        });
        return out;
    };
};
