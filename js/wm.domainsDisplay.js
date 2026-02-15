/* 
 * Copyright (C) 2024 Chris Vaughan
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

wm.domainsDisplay = function (domains, extras) {
    this.domains = domains;
    this.extras = extras;
    this.options = {
        tabs: {"status": {title: "Status"},
            "control files": {title: "Control Files"},
            "latest": {title: "Latest Change"},
            "cms": {title: "CMS"},
            "joomlaConfig": {title: "Joomla Config"},
            "idjbackup": {title: "Joomla Backup"},
            "notFound": {title: "No WM info", enabled: false}}};
    if (extras !== null) {
        this.options.tabs["notFound"].enabled = true;
    }
    this.formats = {"domain": {"title": "Domain", "items": ["{domain}"], field: {type: 'text', filter: true, sort: true}},
        status: {"title": "Status", "items": ["{status}"], field: {type: 'text', filter: true, sort: true}, "options": {align: "right"}},
        wmVersion: {"title": "WM Version", "items": ["{webmonitorversion}"], field: {type: 'number', filter: false, sort: true}, "options": {align: "right"}},
        reportVersion: {"title": "Report Version", "items": ["{reportversion}"], field: {type: 'number', filter: false, sort: true}, "options": {align: "right"}},
        noFilesScanned: {"title": "No files scanned", "items": ["{nofilesscanned}"], field: {type: 'number', filter: false, sort: true}, "options": {align: "right"}},
        sizeScanned: {"title": "Total size scanned", "items": ["{totalsizescanned}"], field: {type: 'number', filter: false, sort: true}, "options": {align: "right"}},
        latestChangeDate: {"title": "Latest change", "items": ["{latestchangedate}"], field: {type: 'text', filter: false, sort: true}, "options": {align: "right"}},
        largestFile: {"title": "Largest file", "items": ["{largestfilesize}"], field: {type: 'number', filter: false, sort: true}, "options": {align: "right"}},
        creationDate: {"title": "Log file", "items": ["{creationdate}"], field: {type: 'text', filter: false, sort: true}, "options": {align: "right"}},
        folders: {"title": "Folder", "items": ["{topLevelDirectories}"], "options": {align: "left"}},
        controlFiles: {"title": "Control Files", "items": ["{controlFiles}"], "options": {align: "left"}},
        latestChange: {"title": "Latest Change", "items": ["{latestchange}"], field: {type: 'text', filter: false, sort: true}},
        joomla: {"title": "Joomla", "items": ["{joomlaVersions}"], "options": {align: "left"}},
        wordpress: {"title": "WordPress", "items": ["{wordPressVersions}"], "options": {align: "left"}},
        joomlaConfig: {"title": "Config", "items": ["{joomlaConfig}"], "options": {align: "left"}}
    };

    this.load = function (div) {
        this.div = div;
        var _this = this;
        div.addEventListener("displayTabContents", function (e) {
            var option = e.tabDisplay.tab;
            var div = e.tabDisplay.displayInElement;
            _this._display(div, option);
        });
        var tabs = new ra.tabs( this.div,this.options);
        tabs.display();
    };
    this.getDomains = function () {
        return this.domains;
    };
    this._display = function (div, option) {
        switch (option) {
            case "status":
                this.displayStatus(div);
                break;
            case "control files":
                this.displayControlFiles(div);
                break
            case "latest":
                this.displayLatest(div);
                break
            case "cms":
                this.displayCMS(div);
                break
            case "joomlaConfig":
                this.displayJoomlaConfig(div);
                break;
            case "notFound":
                this.displayExtras(div);
                break;
            case "idjbackup":
                this.displayJoomlaBackup(div);
                break
            default:
            // code block
        }
    };
    this.displayStatus = function (div) {
        var format = [this.formats.domain,
            this.formats.status,
            this.formats.wmVersion,
            this.formats.reportVersion,
            this.formats.noFilesScanned,
            this.formats.sizeScanned,
            this.formats.latestChangeDate,
            this.formats.largestFile,
            this.formats.creationDate
        ];
        var title = document.createElement("h2");
        title.textContent = "Status of Web Monitor files";
        div.appendChild(title);
        this._displayTable(div, format);
    };
    this.displayControlFiles = function (div) {
        var format = [this.formats.domain,
            this.formats.folders,
            this.formats.controlFiles];
        var title = document.createElement("h2");
        title.textContent = "Control Files in top two levels of folder";
        div.appendChild(title);
        this._displayTable(div, format);
    };
    this.displayLatest = function (div) {
        var format = [this.formats.domain,
            this.formats.latestChange];
        var title = document.createElement("h2");
        title.textContent = "The last change in each account";
        div.appendChild(title);
        this._displayTable(div, format);
    };
    this.displayCMS = function (div) {
        var format = [this.formats.domain,
            this.formats.joomla,
            this.formats.wordpress];
        var title = document.createElement("h2");
        title.textContent = "Joomla/WordPress installs in top two levels of folder";
        div.appendChild(title);
        this._displayTable(div, format);
    };
    this.displayJoomlaConfig = function (div) {
        var format = [this.formats.domain,
            this.formats.joomlaConfig];
        var title = document.createElement("h2");
        title.textContent = "Joomla configuration settings";
        div.appendChild(title);
        this._displayTable(div, format);
    };
    this.displayExtras = function (div) {
        var format = [this.formats.domain,
            this.formats.status,
            {"title": "Additional Info", "options": {align: "right"}}];
        var title = document.createElement("h2");
        title.textContent = "Domains that have no Web Monitor information";
        div.appendChild(title);
        var dl = new ra.paginatedTable(div);
        dl.tableHeading(format);
        this.extras.forEach(item => {
            var additionalInfo = '';
            for (var propt in item) {
                if (propt !== "domain" && propt !== 'status') {
                    additionalInfo += propt + ": " + item[propt] + "<br/>";
                }
            }
            dl.tableRowStart();
            dl.tableRowItem(item.domain, format[0]);
            dl.tableRowItem(item.status, format[1]);
            dl.tableRowItem(additionalInfo);
            dl.tableRowEnd();
        });
        //  this.addDomainLinks();
        //  this.addControlFileLinks();
        dl.tableEnd();
    };
    this.displayJoomlaBackup = function (div) {
        // {"title": "Domain", "items": ["{domain}"], id: "var1", filter: {type: 'text'}, sort: {type: "text"}},
        var format = [{"title": "Domain", "options": {align: "left"}},
            {"title": "Status", "options": {align: "left"}},
            {"title": "Folder", "options": {align: "left"}},
            {"title": "Number", "options": {align: "left"}},
            {"title": "Size", "options": {align: "left"}},
            {"title": "File", "options": {align: "left"}}];
        var title = document.createElement("h2");
        title.textContent = "Domains that have Joomla jpa backup files";
        div.appendChild(title);
        var dl = new ra.paginatedTable(div);
        dl.tableHeading(format);
        this.domains.forEachAll(domain => {
            var backups = domain.getJoomlaBackups();
            if (backups.length > 0) {
                dl.tableRowStart();
                var td = dl.tableRowItem(domain.getValue("{domain}"));
                this.addDomainLink(td);
                dl.tableRowItem(domain.getValue("{status}"));
                dl.tableRowItem(this.getBackupInfo(backups, "folder"));
                dl.tableRowItem(this.getBackupInfo(backups, "nofiles"));
                dl.tableRowItem(this.getBackupInfo(backups, "totalsize"));
                dl.tableRowItem(this.getBackupInfo(backups, "file"));
                dl.tableRowEnd();
            }
        });
        dl.tableEnd();
    };
    this._displayTable = function (div, format) {
        var dl = new ra.paginatedTable(div);
        dl.tableHeading(format);
        this.domains.forEachAll(domain => {
            dl.tableRowStart();
            format.forEach(item => {
                var value = domain.getValues(item.items);
                var td = dl.tableRowItem(value, item);
                if (item.title === 'Domain') {
                    this.addDomainLink(td);
                }
                if (item.title === 'Control Files') {
                    this.addControlFileLink(td);
                }
            });
            dl.tableRowEnd();
        });
        dl.tableEnd();
    };
    this.getBackupInfo = function (backup, option) {
        var out = "";
        backup.forEach(item => {
            out += item[option] + "<br/>";
        });
        return out;
    };
    this.addDetailsLink = function (td, domainName) {
        var _this = this;
        td.addEventListener("click", function (e) {
            _this.domains.displayDetails(e, domainName);
        });
    };
    this.addDomainLink = function (node) {
        var _this = this;
        node.classList.add("pointer");
        node.addEventListener("click", function (e) {
            var domainName = e.target.dataset.domaindetails;
            _this.domains.displayDetails(e, domainName);
        });

    };
    this.addControlFileLink = function (node) {
        var _this = this;
        node.classList.add("pointer");
        node.addEventListener("click", function (e) {
            var controlFile = e.target.dataset.controlfile;
            var domainName = e.target.dataset.domain;
            _this.domains.displayControlFile(e, domainName, controlFile);
        });
    };
};
