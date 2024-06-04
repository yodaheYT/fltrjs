const { Filter, Parser } = require("../index.js");

async function run() {
    const testFilter = new Filter();
    await testFilter.createFromFile("test/test.fltrjssingle");
    
    const testParser = new Parser();
    
    const testFilterList = await testParser.parseFltrjs("test/test.fltrjs");
    
    const testOneResult = await testParser.applyMany("This foo is very test.", testFilterList);
    if (testOneResult === "This bar is very tset.") {
        console.log("Test 1/3: PASS");
    } else {
        console.log("Test 1/3: FAIL");
    }

    const testTwoResult = await testParser.applySingle("This foo is very test.", testFilter);
    if (testTwoResult === "This foo is very tset.") {
        console.log("Test 2/3: PASS");
    } else {
        console.log("Test 2/3: FAIL");
    }

    const testThreeResult = await testParser.applySingle("This foo is very test.", testFilter);
    if (testThreeResult === "This foo is very tset.") {
        console.log("Test 3/3: PASS");
    } else {
        console.log("Test 3/3: FAIL");
    }
}

run();