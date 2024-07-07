/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var wm, jplist;

if (typeof (wm) === "undefined") {
    wm = {};
}
if (typeof (wm.display) === "undefined") {
    wm.display = {};
}
wm.display.tabTable = function (options, items) {
    this.items = items;

    this.elements = null;
    this.settings = {

        displayClass: "detailsView",

        tabOrder: ["Table"],

//        tableFormat = ["domain", "path", "webmonitorversion", "reportversion", "nofilesscanned", "totalsizescanned",
//            "directory", "directories", "files", "wordpressversions", "joomlaversions",
//            "joomlabackups", "config", "creationdate", "latestfile", "largestfiles"],

        tableFormat: [{"title": "Domain", "items": ["{domain}"]},
            {"title": "WM Version", "items": ["{webmonitorversion}"]},
            {"title": "Report Version", "items": ["{reportversion}"]},
            {"title": "No files scanned", "items": [ "{nofilesscanned}"]},
            {"title": "Total size scanned", "items": ["{totalsizescanned}"]},
            {"title": "Creation date", "items": ["{creationdate}"]}],

        tableFormatold2: [{"title": "Date", "items": ["{dowddmm}"]}, {"title": "Meet", "items": ["{meet}", "{,meetGR}", "{,meetPC}"]}, {"title": "Start", "items": ["{start}", "{,startGR}", "{,startPC}"]}, {"title": "Title", "items": ["{title}", "{mediathumbr}"]}, {"title": "Difficulty", "items": ["{difficulty+}"]}, {"title": "Contact", "items": ["{contact}"]}],
        listFormat: ["{dowdd}", "{,meet}", "{,start}", "{,title}", "{,distance}", "{,contactname}", "{,telephone}"],

        jplistGroup: ra.uniqueID(),
        jplistName: "name1",
        itemsPerPage: 20,
        currentView: "Grades",
        options: null
    };
    this.myjplist = new ra.jplist(this.settings.jplistGroup);
    this.optionTag = {};
    this.options = options;
    this.settings.jplistName = 'jpl' + options.divId;

    this.load = function () {

        var tags = [
            {name: 'outer', parent: 'root', tag: 'div'},
            {name: 'walksFilter', parent: 'outer', tag: 'div', attrs: {class: 'walksFilter'}},
            {name: 'raoptions', parent: 'outer', tag: 'div'},
            {name: 'inner', parent: 'outer', tag: 'div', attrs: {id: 'rainner'}},
            {name: 'rapagination1', parent: 'inner', tag: 'div'},
            {name: 'rawalks', parent: 'inner', tag: 'div', textContent: 'Processing data - this should be replaced shortly.'},
            {name: 'rapagination2', parent: 'inner', tag: 'div'}
        ];
        this.masterdiv = document.getElementById(this.options.divId);
        this.elements = ra.html.generateTags(this.masterdiv, tags);
        if (!this.options.paginationTop) {
            this.elements.rapagination1.style.diaplay = 'none';
        }
        if (!this.options.paginationBottom) {
            this.elements.rapagination2.style.diaplay = 'none';
        }


        this.processOptions(this.elements.raoptions);
        this.items.setAllFilters();
        this.checkColumnNotBlank(this.settings.tableFormat);
        this.items.setFilters(this.elements.walksFilter);
        setTimeout(function () {
            // lets the map/list tabs be displayed straight away
            _this.displayItems(_this.settings.currentView);
        }, 0);
        var _this = this;
        document.addEventListener("reDisplayWalks", function () {
            _this.items.setDisplayFilter();
            _this.displayWalks();
        });
    };
    this.displayWalks = function () {
        var no = this.items.getNoEventsToDisplay();
        switch (this.settings.currentView) {
            case "Grades":
            case "List":
            case "Table":
                this.displayMap("hidden");
                if (this.items.length() === 0) {
                    ra.html.setTag(this.elements.rawalks, '<h3>Sorry there are no walks at the moment.</h3>');
                    return;
                }
                this.addPagination(no, this.elements.rapagination1);
                this.addPagination(no, this.elements.rapagination2);
                ra.html.setTag(this.elements.rawalks, this.displayWalksText(false));
                if (!this.settings.noPagination) {
                    this.myjplist.init('ra-display');
                }

                break;

        }
    };

    this.setPaginationMargin = function (which) {
        var tag1 = this.elements.rapagination1;
        var tag2 = this.elements.rapagination2;
        if (tag1 && tag2) {
            if (which === "on") {
                tag1.style.paddingBottom = "5px";
                tag2.style.paddingTop = "5px";
            } else {
                tag1.style.paddingBottom = "0px";
                tag2.style.paddingTop = "0px";
            }
        }
    };
    this.displayWalksText = function (printing) {

        var $out = "";
        var header = "";
        var footer = "";
        var odd = true;
        var month = "";
        var $class = "";
        var no = 0;
        var should = this.shouldDisplayMonth();
        this.items.forEachFiltered($walk => {
            no += 1;
            if (odd) {
                $class = "odd";
            } else {
                $class = "even";
            }
            var displayMonth = month !== $walk.getIntValue("basics", "displayMonth") && should;
            switch (this.settings.currentView) {
                case "Grades":
                    $out += this.displayWalk_Grades($walk, $class, displayMonth);
                    break;
                case "List":
                    $out += this.displayWalk_List($walk, $class, displayMonth);
                    break;
                case "Table":
                    $out += this.displayWalk_Table($walk, $class, displayMonth);
                    break;
            }
            month = $walk.getIntValue("basics", "displayMonth");
            odd = !odd;
        });
        if (no === 0) {
            $out = "<h3>Sorry, but no walks meet your filter search</h3>";
            ra.html.setTag(this.elements.rapagination1, "");
            ra.html.setTag(this.elements.rapagination2, "");
        } else {
            header = this.displayWalksHeader(printing);
            footer = this.displayWalksFooter();
        }
        return  header + $out + footer;
    };
    this.checkColumnNotBlank = function (tableformat) {
        var content;
        // check if any columns are blank
        tableformat.forEach($col => {
            $col.blank = true;
            this.items.forEachFiltered($walk => {
                if ($col.blank) {
                    content = $walk.getEventValues($col.items);
                    if (content !== '') {
                        $col.blank = false;
                    }
                }
            });
        });
    };
    this.displayWalksHeader = function (printing = false) {
        var $out = "";
        switch (this.settings.currentView) {
            case "Grades":
            case "List":
            case "Table":
                if (printing) {
                    $out += "<h3>Walks programme</h3>";
                }
                break;
        }
        switch (this.settings.currentView) {
            case "Grades":
                if (!printing) {
                    $out += "<p class='noprint'>Click on item to display full details of walk</p>";
                }
                $out += "<div data-jplist-group=\"" + this.settings.jplistGroup + "\">";
                break;
            case "List":
                if (!printing) {
                    $out += "<p class='noprint'>Click on item to display full details of walk</p>";
                }
                $out += "<div data-jplist-group=\"" + this.settings.jplistGroup + "\">";
                break;
            case "Table":
                if (!printing) {
                    $out += "<p class='noprint'>Click on item to display full details of walk</p>";
                }
                $out += "<table class='" + this.settings.displayClass + "'>\n";
                var should = this.shouldDisplayMonth();
                if (!should) {
                    $out += this.displayTableHeader();
                }
                $out += "<tbody data-jplist-group=\"" + this.settings.jplistGroup + "\">";
                break;
        }
        return $out;
    };
    this.displayWalksFooter = function () {
        var $out = "";
        switch (this.settings.currentView) {
            case "Grades":
                $out += "</div>";
                $out += "<div style='height:5px;'>  </div>";
                break;
            case "List":
                $out += "</div>";
                $out += "<div style='height:5px;'>  </div>";
                break;
            case "Table":
                $out += "</tbody></table>\n";
                break;
        }
        return $out;
    };
    this.displayWalk_Grades = function ($walk, $class, $displayMonth) {
        var $text, $image;
        var $out = "", $out1 = "";
        var $customClass = $class;

        $out1 += "<div data-jplist-item >";
        if ($displayMonth) {

            $out1 += "<h3>" + $walk.getIntValue("basics", "displayMonth") + "</h3>";
        }
        $out1 += "<div  class='" + $customClass + " walk" + $walk.admin.status + "' >";
        $image = '<span class="walkdetail" >';
        $out += $walk.getEventValues(this.settings.gradesFormat);
        $text = $out1 + $image + $walk.addTooltip($out) + "\n</span></div>\n";
        $text += "</div>\n";
        return $text;
    };
    this.displayWalk_List = function ($walk, $class, $displayMonth) {
        var $items = this.settings.listFormat;
        var $out = "";
        var $customClass = $class;

        $out += "<div data-jplist-item >";
        if ($displayMonth) {
            $out += "<h3>" + $walk.getIntValue("basics", "displayMonth") + "</h3>";
        }
        $out += "<div class='" + $customClass + " walk" + $walk.admin.status + "' >";
        $out += $walk.addTooltip($walk.getEventValues($items));
        return  $out + "</div>\n";
    };
    this.displayTableHeader = function () {
        var $out = "<tr>";
        this.settings.tableFormat.forEach($col => {
            if (!$col.blank) {
                $out += "<th>" + $col.title + "</th>";
            }
        });
        return $out + "</tr>";
    };
    this.displayWalk_Table = function ($walk, $class, $displayMonth) {
        //  var $out = "<tr data-jplist-item class='" + $class + " walk" + $walk.admin.status + "' >"
        var $out = "";
        var $customClass = "";
        if ($displayMonth) {
            $out += "<tr data-jplist-item ><td>";
            $out += "<h3>" + $walk.getIntValue("basics", "displayMonth") + "</h3>";
            $out += "</td></tr>";
        }

        $out += "<tr data-jplist-item class='" + $class + " walk" + $walk.admin.status + "' >";

        this.settings.tableFormat.forEach($col => {
            if (!$col.blank) {
                $out += "<td>" + $walk.addTooltip($walk.getEventValues($col.items)) + "</td>";
            }
        });
        $out += "</tr>";
        return $out;
    };

    this.addPagination = function (no, tag) {
        this.myjplist.addPagination(no, tag, this.settings.jplistName, this.settings.itemsPerPage);
        this.addPrintButton(tag);
        this.addToDiaryButton(tag);
        return;
    };
    this.addPrintButton = function (tag) {
        var printButton = document.createElement('button');
        printButton.setAttribute('class', 'link-button tiny button mintcake right');
        printButton.textContent = 'Print';
        tag.appendChild(printButton);
        var _this = this;
        printButton.addEventListener('click', function () {
            _this.items.setDisplayFilter();
            var content = _this.displayWalksText(true);
            ra.html.printHTML(content);
        });
    };

    this.processOptions = function (optionsDiv) {
        var table = document.createElement('table');
        table.setAttribute('class', 'ra-tab-options');
        optionsDiv.appendChild(table);
        var row = document.createElement('tr');
        table.appendChild(row);
        var first = true;
        var _this = this;
        this.settings.tabOrder.forEach(function (value, index, array) {
            switch (value) {
                case "List":
                case "Table":
                    break;
                default:
                    ra.showError("Invalid tab option " + value);
            }
        });
        this.settings.defaultOptions += "</tr></table>";
    };
    this.addDisplayOption = function (name, active, row) {
        var col = document.createElement('td');
        row.appendChild(col);
        col.setAttribute('class', 'ra-tab');
        col.setAttribute('data-display-option', name);
        col.textContent = name;
        this.optionTag[name] = col;
        if (active) {
            col.classList.add('active');
        }
        var _this = this;
        col.addEventListener("click", function () {
            var option = this.getAttribute('data-display-option');
            var oldOption = _this.settings.currentView;
            _this.optionTag[oldOption].classList.remove('active');
            _this.settings.currentView = option;
            _this.optionTag[option].classList.add('active');
            let e = new Event("reDisplayWalks", {bubbles: true});
            document.dispatchEvent(e);
        });
    };
};
