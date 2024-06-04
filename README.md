# fltrjs
## A Node.JS filtering library.
### <span style="color: #ffaaaa">This library is built for asynchronous applications. There will be no examples for synchronous applications.</span>

Documentation based on fltrjs V1.0.0<br>
All built in tests PASS

## Install:
Start by installing the library:
```bash
npm i fltrjs
```

## fltrjs Format
Both .fltrjs and .fltrjs single should be named \<name\>.\<extension\>. They will work without a name, it's just not recommended.

Create a .fltrjs file:<br>
>.fltrjs files are used when you need multiple filters at once.

(examples are included in the test folder)<br>

`<name>.fltrjs`
```fltrjs
FILTER: # create a new filter
    TARGET <word to target here>
    FLAGS <any regex flags, g/gi etc. (gi recommend for most purposes)>
    REPLACEWITH <what to replace the target with>
    COMPILE # finally compile it all
```

Create a .fltrjssingle file:<br>
>.fltrjssingle files are used when you only need one filter at a time.
><br>Note that .fltrjssingle files do NOT use the FILTER keyword at all.

(examples are included in the test folder)<br>

`<name>.fltrjssingle`
```fltrjs
TARGET <word to target here>
FLAGS <any regex flags, g/gi etc. (gi recommend for most purposes)>
REPLACEWITH <what to replace the target with>
COMPILE # finally compile it all
```

fltrjs Syntax:<br>
`FILTER` -> creates a new filter<br>
`TARGET` -> what is being replaced<br>
`FLAGS` -> general RegEx flags<br>
`REPLACEWITH` -> what to replace with<br>
`COMPILE` -> close the current filter so you can create a new one<br>
`#` -> set the rest of the line as a comment<br>


## Examples
Use a `Filter()` with fltrjssingle files.
```js
const { Filter, Parser } = require("fltrjs"); // Parser is not neccessary for .fltrjssingle files

// I prefer to create a function to run your main scripts, you don't have to though.
async function app() {
    const filter = new Filter();
    // If you don't want to create a file, you can manually set properties with testFilter.TargetWord = "<word>", just make sure to call Filter.compile() at the end.
    await filter.createFromFile("/path/to/.fltrjssingle/file");

    // You can either directly use the filter, or create a Parser()
    // Parser Example (recommended):
    const parser = new Parser();
    const text = await parser.applySingle("<text to filter>", filter);

    // Non Parser Example:
    const text2 = await filter.apply("<text to filter>");
}

app();
```


Use a `Parser()` with .fltrjs files.
```js
const { Parser } = require("fltrjs"); // Parser is neccessary for full .fltrjs files

// I prefer to create a function to run your main scripts, you don't have to though.
async function app() {
    // To use .fltrjs files, you must use a parser
    const parser = new Parser();
    
    // Import the entire .fltrjs file
    const filters = await parser.parseFltrjs("path/to/.fltrjs/file");
    // Fltrjs just returns a list of Filter() objects, 

    // Apply all filters to a string
    const parsedString = await parser.applyMany("<text to filter>", filters);
}

app();
```



## LICENSE: GNU GPLv3
