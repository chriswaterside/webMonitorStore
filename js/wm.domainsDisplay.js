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

wm.domainsDisplay = function (domains, extras) {
    this.domains = domains;
    this.extras = extras;

    this.options = {div: null,
        tabs: {id0: {title: "Status"},
            id10: {title: "two"},
            id20: {title: "three"},
            idjbackup: {title: "Joomla Backup"},
            id30: {title: "No WM info", enabled: false}}};



    if (extras !== null) {
        this.options.tabs.id30.enabled = true;
    }


    this.load = function (div) {
        this.options.div = div;
        var _this = this;
        div.addEventListener("displayTabContents", function (e) {
            var option = e.tabDisplay.tab;
            var div = e.tabDisplay.displayInElement;
            _this._display(div, option);
        });
        var tabs = new ra.tabs(this.options);
        tabs.display();
    };
    this._display = function (div, option) {
        switch (option) {
            case "id0":
                this.displayStatus(div);
                break;
            case "id30":
                this.displayExtras(div);

                break;
            case "id20":
                this.displayDomains(div);
                break
            case "idjbackup":
                this.displayJoomlaBackup(div);
                break
            default:
            // code block
        }


    };
    this.displayDomains = function (div) {
        var title = document.createElement("h2");
        title.textContent = "Domains";
        div.appendChild(title);
        var list = document.createElement("ul");
        div.appendChild(list);
        this.domains.forEachAll((item) => {
            var line = document.createElement("li");
            line.textContent = item.getDomainName();
            list.appendChild(line);
        });
    };
    this.displayStatus = function (div) {
        var format = [{"title": "Domain", "items": ["{domain}"]},
            {"title": "Status", "items": ["{status}"], "options": {align: "right"}},
            {"title": "WM Version", "items": ["{webmonitorversion}"], "options": {align: "right"}},
            {"title": "Report Version", "items": ["{reportversion}"], "options": {align: "right"}},
            {"title": "No files scanned", "items": ["{nofilesscanned}"], "options": {align: "right"}},
            {"title": "Total size scanned", "items": ["{totalsizescanned}"], "options": {align: "right"}},
            {"title": "Log file", "items": ["{creationdate}"], "options": {align: "right"}},
            {"title": "Last file changed", "items": ["{latestfile}"], "options": {align: "right"}}];


        var dl = new ra.paginatedDataList(div);
        dl.tableHeading(format);

        this.domains.forEachAll(domain => {
            dl.tableRowStart();
            format.forEach(item => {
                var value = domain.getValue(item.items[0]);
                dl.tableRowItem(value, item.options);
            });
            dl.tableRowEnd();

        });
    };
    this.displayExtras = function (div) {
        var format = [{"title": "Domain", "options": {align: "right"}},
            {"title": "Status", "options": {align: "right"}},
            {"title": "Additional Info", "options": {align: "right"}}];
        var title = document.createElement("h2");
        title.textContent = "Domains that have no Web Monitor information";
        div.appendChild(title);

        var dl = new ra.paginatedDataList(div);
        dl.tableHeading(format);

        this.extras.forEach(item => {
            var additionalInfo = '';
            for (var propt in item) {
                if (propt !== "domain" && propt !== 'status') {
                    additionalInfo += propt + ": " + item[propt] + "<br/>";
                }
            }
            dl.tableRowStart();
            dl.tableRowItem(item.domain);
            dl.tableRowItem(item.status);
            dl.tableRowItem(additionalInfo);
            dl.tableRowEnd();
        });
    };
    this.displayJoomlaBackup = function (div) {
        var format = [{"title": "Domain", "options": {align: "left"}},
            {"title": "Status", "options": {align: "left"}},
            {"title": "Folder", "options": {align: "left"}},
            {"title": "Number", "options": {align: "left"}},
            {"title": "Size", "options": {align: "left"}},
            {"title": "File", "options": {align: "left"}}];
        var title = document.createElement("h2");
        title.textContent = "Domains that have Joomla jpa backup files";
        div.appendChild(title);

        var dl = new ra.paginatedDataList(div);
        dl.tableHeading(format);

        this.domains.forEachAll(domain => {
            var backups = domain.getJoomlaBackups();
            if (backups.length > 0) {
                dl.tableRowStart();
                var td = dl.tableRowItem(domain.getValue("{domain}"));
                this.addDetailsLink(td, domain.getDomainName());
                dl.tableRowItem(domain.getValue("{status}"));
                dl.tableRowItem(this.getBackupInfo(backups, "folder"));
                dl.tableRowItem(this.getBackupInfo(backups, "nofiles"));
                dl.tableRowItem(this.getBackupInfo(backups, "totalsize"));
                dl.tableRowItem(this.getBackupInfo(backups, "file"));

                dl.tableRowEnd();
            }

        });
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


};