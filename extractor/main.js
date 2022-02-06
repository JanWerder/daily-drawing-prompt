import got from "got";
import fs from "fs";
import * as cheerio from "cheerio";

var year = new Date().getFullYear();

var date = new Date().getMonth() + 1;
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

var monthText = (new Date(`${year}-${month}-01`)).toLocaleString("en-us", { month: "long" }).toLowerCase();
const currentMonthUrl = `https://www.simpledailydrawing.com/drawing-prompts/${monthText}-${year}`;

got(currentMonthUrl)
	.then((response) => {
		const $ = cheerio.load(response.body);

		//Parse all p tags, but catch the special case where the text is bold
		var texts = $(".sqsrte-large")[0]
			.next.children.filter((child) => child.type === "text")
			.map((text) => (text.data.trim().substr(-1) === "•" ? text.data + text.next.children[0].data.trim() : text.data));

		//Filter out the Share Alert
		texts = texts.map((text) => text.replace("*** Share Alert** (see below)", ""));

		//Now map it onto an object
		var out = {};
		texts.map((text) => (out[text.split("•")[0].trim()] = text.split("•")[1].trim()));

		//Write out to a json file
		fs.writeFileSync(`../static/${year}-${month}.json`, JSON.stringify(out));
		console.log(out);
	})
	.catch((err) => {
		console.log(`${year}-${month} URL does not exist. Exiting`);
	});
