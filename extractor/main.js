import got from "got";
import fs from "fs";
import * as cheerio from "cheerio";

var date = new Date().getMonth() + 1;

if (process.argv.length > 2) {
	var dateParsed = new Date(process.argv[2] + "-01");
	if (dateParsed.toString() !== "Invalid Date") {
		date = dateParsed.getMonth() + 1;
	}
}

var year = dateParsed.getFullYear();
var month = date.toString().length == 1 ? "0" + date : date;

if (fs.existsSync(`../static/${year}-${month}.json`)) {
	console.log(`${year}-${month}.json already exists. Trying next month`);

	date = date + 1 < 13 ? date + 1 : 1;
	year = date === 1 ? year + 1 : year;
	month = date.toString().length == 1 ? "0" + date : date;

	if (fs.existsSync(`../static/${year}-${month}.json`)) {
		console.log(`${year}-${month}.json also already exists. Exiting`);
		process.exit(0);
	} else {
		console.log(`${year}-${month}.json does not exist. Continuing`);
	}
}

let monthText = new Date(`${year}-${month}-01`).toLocaleString("en-us", { month: "long" }).toLowerCase();
let firstUrlPart = ["https://www.simpledailydrawing.com/drawing-prompts/", "https://www.simpledailydrawing.com/drawing-prompt-lists/"];
let SecondUrlPart = [`${monthText}-${year}`];

let possibleUrls = firstUrlPart.map((first) => SecondUrlPart.map((second) => first + second)).flat();

//try to reach the url with the firstUrlPart
possibleUrls.forEach((url) => {
	got(url)
		.then((response) => {
			const $ = cheerio.load(response.body);

			//Parse all p tags, but catch the special case where the text is bold
			try {
				let texts = $(".sqsrte-large")[0]
					.next.children.filter((child) => child.type === "text")
					.map((text) => (text.data.trim().substr(-1) === "•" ? text.data + text.next.children[0].data.trim() : text.data));

				//Filter out the Share Alert
				texts = texts.map((text) => text.replace("*** Share Alert** (see below)", ""));

				//Now map it onto an object
				let out = {};
				texts.map((text) => (out[text.split("•")[0].trim()] = text.split("•")[1].trim()));

				//Write out to a json file
				fs.writeFileSync(`../static/${year}-${month}.json`, JSON.stringify(out, null, "\t"));
				console.log(out);
			} catch (error) {
				console.log(`Error during extract: ${error}`);
			}
		})
		.catch((err) => {
			console.log(`${url} does not exist. Trying next url`);
		});
});
