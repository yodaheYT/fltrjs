const fs = require("fs").promises;

class Filter {
    constructor() {
        this.TargetWord = undefined;
        this.FilterFlags = undefined;
        this.ReplaceWith = undefined;
        this.RegEx = undefined;
    }

    async compile() {
        this.RegEx = new RegExp(this.TargetWord, this.FilterFlags);
    }

    async createFromFile(filePath) {
        if (!filePath) {
            console.error("[FLTRJS:] Filepath is null.");
            return "Filepath is null";
        }
        if (!filePath.endsWith(".fltrjssingle")) {
            console.error(
                "[FLTRJS:] Not a fltrjs file, acceptable formats for Filter.createFromFile() are: .fltrjssingle"
            );
            return "Not a fltrjs file, acceptable formats Filter.createFromFile() are: .fltrjssingle";
        }

        let result = null;
        try {
            result = await fs.readFile(filePath, "utf8");
        } catch (err) {
            console.error(
                "[FLTRJS:] An error occured reading the file. Outputting stack trace."
            );
            console.error(err);
            return "An error occured reading the file. The stack trace has been outputted to console";
        }
        if (!result) {
            console.error("[FLTRJS:] Cannot find file: " + filePath + ".");
            return "Cannot find file: " + filePath + ".";
        }
        result.split("\n").forEach(async (line) => {
            line = line.replace("    ", "");
            line = line.replace("\r", "");
            if (line.startsWith("TARGET")) {
                this.TargetWord = line.split(" ")[1];
            }
            if (line.startsWith("FLAGS")) {
                this.FilterFlags = line.split(" ")[1];
            }
            if (line.startsWith("REPLACEWITH ")) {
                this.ReplaceWith = line.split(" ")[1];
            }
            if (line.startsWith("COMPILE")) {
                await this.compile();
            }
        });
        if (this.RegEx) {
            return "Success";
        } else {
            console.error("[FLTRJS:] Failed to create Filter from file.")
            return "Failed to create Filter from file.";
        }
    }
    async apply(text) {
        if (text) {
            return text.replace(this.RegEx, this.ReplaceWith);
        } else if (!text) {
            console.error("[FLTRJS:] Text is undefined.");
            return "Text is undefined";
        }
    }
}

class Parser {
    constructor() {}

    async applySingle(text, filter) {
        if (filter && text) {
            return text.replace(filter.RegEx, filter.ReplaceWith);
        } else if (!filter) {
            console.error("[FLTRJS:] Filter is undefined;");
            return  "Filter is undefined.";
        } else if (!text) {
            console.error("[FLTRJS:] Text is undefined.");
            return "Text is undefined";
        }
    }

    async applyMany(text, filterList) {
        if (filterList && text) {
            let finalText = text;
            for (const filter in filterList) {
                finalText = await filterList[filter].apply(finalText);
            }
            return finalText;
        } else if (!filterList) {
            console.error("[FLTRJS:] FilterList is undefined.");
            return "FilterList is undefined.";
        } else if (!text) {
            console.error("[FLTRJS:] Text is undefined.");
            return "Text is undefined";
        }
    }

    async parseFltrjs(filePath) {
        if (!filePath) {
            console.error("[FLTRJS:] Filepath is null.");
            return "Filepath is null";
        }
        if (!filePath.endsWith(".fltrjs")) {
            console.error(
                "[FLTRJS:] Not a fltrjs file, acceptable formats for Parser.parseFltrjs() are: .fltrjs"
            );
            return "Not a fltrjs file, acceptable formats for Parser.parseFltrjs() are: .fltrjs";
        }
        let result = null;
        try {
            result = await fs.readFile(filePath, "utf8");
        } catch (err) {
            console.error(
                "[FLTRJS:] An error occured reading the file. Outputting stack trace."
            );
            console.error(err);
            return "An error occured reading the file. The stack trace has been outputted to console";
        }
        if (!result) {
            console.error("[FLTRJS:] Cannot find file: " + filePath + ".");
            return "Cannot find file: " + filePath + ".";
        }
        let object = {};
        let currentFilter = -1;
        result.split("\n").forEach(async (line) => {
            line = line.replace("    ", "");
            line = line.replace("\r", "");
            line = line.split("#")[0];
            if (line.startsWith("FILTER:")) {
                currentFilter++;
            }
            if (object[currentFilter] == undefined) {
                object[currentFilter] = new Filter();
            }
            if (line.startsWith("TARGET")) {
                object[currentFilter].TargetWord = line.split(" ")[1];
            }
            if (line.startsWith("FLAGS")) {
                object[currentFilter].FilterFlags = line.split(" ")[1];
            }
            if (line.startsWith("REPLACEWITH ")) {
                object[currentFilter].ReplaceWith = line.split(" ")[1];
            }
            if (line.startsWith("COMPILE")) {
                await object[currentFilter].compile();
            }
        });
        return object;
    }
}

module.exports = {
    Filter,
    Parser,
};
