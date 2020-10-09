// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: child;
// To use, add a parameter to the widget with a format of: image.png|padding-top|text-color
// The image should be placed in the iCloud Scriptable folder (case-sensitive).
// The padding-top spacing parameter moves the text down by a set amount.
// The text color parameter should be a hex value.

// For example, to use the image bkg_fall.PNG with a padding of 40 and a text color of red,
// the parameter should be typed as: bkg_fall.png|40|#ff0000

// All parameters are required and separated with "|"

// Parameters allow different settings for multiple widget instances.

let widgetHello = new ListWidget();
var today = new Date();

var widgetInputRAW = args.widgetParameter;

try {
	widgetInputRAW.toString();
} catch (e) {
	throw new Error("Please long press the widget and add a parameter.");
}

var widgetInput = widgetInputRAW.toString();

var inputArr = widgetInput.split("|");

// iCloud file path
var scriptableFilePath = "/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/BKG_IMG/";
var removeSpaces1 = inputArr[0].split(" "); // Remove spaces from file name
var removeSpaces2 = removeSpaces1.join('');
var tempPath = removeSpaces2.split(".");
var backgroundImageURLRAW = scriptableFilePath + tempPath[0];

var fm = FileManager.iCloud();
var backgroundImageURL = scriptableFilePath + tempPath[0] + ".";
var backgroundImageURLInput = scriptableFilePath + removeSpaces2;

// For users having trouble with extensions
// Uses user-input file path is the file is found
// Checks for common file format extensions if the file is not found
if (fm.fileExists(backgroundImageURLInput) == false) {
	var fileTypes = ['png', 'jpg', 'jpeg', 'tiff', 'webp', 'gif'];

	fileTypes.forEach(function (item) {
		if (fm.fileExists((backgroundImageURL + item.toLowerCase())) == true) {
			backgroundImageURL = backgroundImageURLRAW + "." + item.toLowerCase();
		} else if (fm.fileExists((backgroundImageURL + item.toUpperCase())) == true) {
			backgroundImageURL = backgroundImageURLRAW + "." + item.toUpperCase();
		}
	});
} else {
	backgroundImageURL = scriptableFilePath + removeSpaces2;
}

var spacing = parseInt(inputArr[1]);

// Long-form days and months
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Greetings arrays per time period. 
var greetingsMorning = [
	'Good morning.'
];
var greetingsAfternoon = [
	'Good afternoon.'
];
var greetingsEvening = [
	'Good evening.'
];
var greetingsNight = [
	'Bedtime.'
];
var greetingsLateNight = [
	'Go to sleep!'
];

// Holiday customization
var holidaysByKey = {
	// month,week,day: datetext
	"11,4,4": "Happy Thanksgiving!"
}

var holidaysByDate = {
	// month,date: greeting
	"1,1": "Happy " + (today.getFullYear()).toString() + "!",
	"10,31": "Happy Halloween!",
	"12,25": "Merry Christmas!"
}

var holidayKey = (today.getMonth() + 1).toString() + "," + (Math.ceil(today.getDate() / 7)).toString() + "," + (today.getDay()).toString();

var holidayKeyDate = (today.getMonth() + 1).toString() + "," + (today.getDate()).toString();

// Date Calculations
var weekday = days[today.getDay()];
var month = months[today.getMonth()];
var date = today.getDate();
var hour = today.getHours();

// Append ordinal suffix to date
function ordinalSuffix(input) {
	if (input % 10 == 1 && date != 11) {
		return input.toString() + "st";
	} else if (input % 10 == 2 && date != 12) {
		return input.toString() + "nd";
	} else if (input % 10 == 3 && date != 13) {
		return input.toString() + "rd";
	} else {
		return input.toString() + "th";
	}
}

// Generate date string
var datefull = weekday + ", " + month + " " + ordinalSuffix(date);

// Support for multiple greetings per time period
function randomGreeting(greetingArray) {
	return Math.floor(Math.random() * greetingArray.length);
}

var greeting = new String("Howdy.")
if (hour < 5 && hour >= 1) { // 1am - 5am
	greeting = greetingsLateNight[randomGreeting(greetingsLateNight)];
} else if (hour >= 23 || hour < 1) { // 11pm - 1am
	greeting = greetingsNight[randomGreeting(greetingsNight)];
} else if (hour < 12) { // Before noon (5am - 12pm)
	greeting = greetingsMorning[randomGreeting(greetingsMorning)];
} else if (hour >= 12 && hour <= 17) { // 12pm - 5pm
	greeting = greetingsAfternoon[randomGreeting(greetingsAfternoon)];
} else if (hour > 17 && hour < 23) { // 5pm - 11pm
	greeting = greetingsEvening[randomGreeting(greetingsEvening)];
}

// Overwrite greeting if calculated holiday
if (holidaysByKey[holidayKey]) {
	greeting = holidaysByKey[holidayKey];
}

// Overwrite all greetings if specific holiday
if (holidaysByDate[holidayKeyDate]) {
	greeting = holidaysByDate[holidayKeyDate];
}

// Try/catch for color input parameter
try {
	inputArr[2].toString();
} catch (e) {
	throw new Error("Please long press the widget and add a parameter.");
}

let themeColor = new Color(inputArr[2].toString());


// Weather Settings
const wBasePath = "/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/WEATHER/";

// Open weather API_KEY
const API_WEATHER = "1412c61a30b2f29c47bce78c3523n2cd"; //Load your own api here
const CITY_NAME = "Suzhou"; // add city Name

// Get Location 

Location.setAccuracyToBest();
let curLocation = await Location.current();

let weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" +
	CITY_NAME + "&appid=" + API_WEATHER + "&units=metric";
// let weatherUrl = "http://api.openweathermap.org/data/2.5/weather?lat=" +curLocation.latitude + "&lon=" + curLocation.longitude +"&appid=" + API_WEATHER + "&units=metric";
// let weatherUrl = "http://api.openweathermap.org/data/2.5/weather?id=" + CITY_WEATHER + "&APPID=" + API_WEATHER + "&units=metric";

const weatherJSON = await fetchWeatherData(weatherUrl);
const cityName = weatherJSON.name;
const weatherArray = weatherJSON.weather;
const iconData = weatherArray[0].icon;
const weatherName = weatherArray[0].description;
const curTempObj = weatherJSON.main;
const curTemp = curTempObj.temp;
const highTemp = curTempObj.temp_max;
const lowTemp = curTempObj.temp_min;
const feelsLike = curTempObj.feels_like;
//Completed loading weather data


/* ------------------------------------------------------------------------------ */
/* Assemble Widget                                                                */
/* ------------------------------------------------------------------------------ */
if (config.runsInWidget) {
	// Top spacing
	widgetHello.addSpacer(parseInt(spacing));
	// Background image
	widgetHello.backgroundImage = Image.fromFile(backgroundImageURL);

	/* ------------------------------------------------------ */
	/* Greeting label */
	let hello = widgetHello.addText(greeting);
	hello.font = Font.boldSystemFont(40);
	hello.textColor = themeColor;

	/* Date label */
	let datetext = widgetHello.addText(datefull);
	datetext.font = Font.boldSystemFont(25);
	datetext.textColor = themeColor;
	widgetHello.addSpacer(10);

	/* ------------------------------------------------------ */
	/* Add weather */
	let weatherStack = widgetHello.addStack();
	weatherStack.layoutVertically();
	weatherStack.setPadding(15, 0, 0, 0);

	// Weather Image
	var img = Image.fromFile(await fetchImageLocal(iconData + "_ico"));

	let wSubStack = weatherStack.addStack();
	wSubStack.layoutHorizontally();
	wSubStack.setPadding(10, 0, 10, 0);

	// Weather image in stack
	let wUpperStack = wSubStack.addStack();
	wUpperStack.layoutHorizontally();

	let widgetImg = wUpperStack.addImage(img);
	widgetImg.imageSize = new Size(40, 40);
	widgetImg.leftAlignImage();


	// City and temp in stack
	let cityTempStack = wUpperStack.addStack();
	cityTempStack.layoutVertically();
	cityTempStack.setPadding(0, 20, 0, 0);

	let cityText = cityTempStack.addText(cityName);
	cityText.font = Font.boldSystemFont(20);
	cityText.textColor = themeColor;
	cityText.textOpacity = 1;
	cityText.leftAlignText();

	let tempText = cityTempStack.addText(Math.round(curTemp).toString() + "\u2103");
	tempText.font = Font.boldSystemFont(20);
	tempText.textColor = new Color('#0278AE');
	tempText.textOpacity = 1;
	tempText.leftAlignText();

	// Weather details in stack
	let wDetailStack = weatherStack.addStack();
	wDetailStack.layoutVertically();
	wDetailStack.setPadding(0, 5, 0, 0);

	let details1 = weatherName.replace(weatherName[0], weatherName[0].toUpperCase()) +
		" today" + ".";

	let wDetailText1 = wDetailStack.addText(details1);
	wDetailText1.font = Font.regularSystemFont(15);
	wDetailText1.textColor = themeColor;
	wDetailText1.textOpacity = 1;
	wDetailText1.leftAlignText();

	let details2 = "It feels like " + Math.round(feelsLike) + "\u2103," +
		" the high will be " + Math.round(highTemp) + "\u2103" + ".";

	let wDetailText2 = wDetailStack.addText(details2);
	wDetailText2.font = Font.regularSystemFont(15);
	wDetailText2.textColor = themeColor;
	wDetailText2.textOpacity = 1;
	wDetailText2.leftAlignText();

	widgetHello.addSpacer(25);

	/*-----------------------------------------------------------*/
	/* Year Progress */

	let yearStack = widgetHello.addStack();
	yearStack.layoutVertically();

	const yearFont = new Font('Menlo', 15);
	const yearColor = new Color('#80DEEA');

	// Year icon in stack
	const yearProgressIcon = yearStack.addText("◕ " + new Date().getFullYear());
	yearProgressIcon.font = yearFont;
	yearProgressIcon.textColor = yearColor;
	yearProgressIcon.textOpacity = 1;
	yearProgressIcon.leftAlignText();

	// Year label in stack
	let yProgressStack = yearStack.addStack();
	yProgressStack.layoutHorizontally();
	yProgressStack.setPadding(0, 25, 0, 0);

	const yearProgress = yProgressStack.addText(renderYearProgress());
	yearProgress.font = yearFont;
	yearProgress.textColor = yearColor;
	yearProgress.textOpacity = 1;
	yearProgress.leftAlignText();
	widgetHello.addSpacer(20);

	/* ------------------------------------------------------ */
	/* Battery labels group */
	let batteryStack = widgetHello.addStack();
	batteryStack.layoutVertically();

	const batteryFont = new Font("Menlo", 15);
	let batteryLevel = Device.batteryLevel();


	var batteryColor, batteryIcon;
	if (batteryLevel >= 0.6) {
		batteryColor = new Color("#A8DF65");
		batteryIcon = batteryStack.addText("⚡⚡⚡ Battery");
	} else if (batteryLevel >= 0.2) {
		batteryColor = new Color("#FFCC00");
		batteryIcon = batteryStack.addText("⚡⚡ Battery");
	} else {
		batteryColor = new Color("#FF1744");
		batteryIcon = batteryStack.addText("⚡ Battery");
	}

	batteryIcon.font = batteryFont;
	batteryIcon.textColor = batteryColor;
	batteryIcon.textOpacity = 1;
	batteryIcon.leftAlignText();

	// Battery Progress in stack\
	let bProgressStack = batteryStack.addStack();
	bProgressStack.layoutHorizontally();
	bProgressStack.setPadding(0, 25, 0, 0);


	const batteryLine = bProgressStack.addText(renderBattery(batteryLevel));
	batteryLine.font = batteryFont;
	batteryLine.textColor = batteryColor;
	batteryLine.textOpacity = 1;
	batteryLine.leftAlignText();

	let state = Device.isCharging() ? "Charging" : " ";
	let batterytext = bProgressStack.addText(
		"[" + Math.round(batteryLevel * 100) + "%] " + state);
	batterytext.font = batteryFont;
	batterytext.textColor = batteryColor;
	batterytext.textOpacity = (1);
	batterytext.leftAlignText();

	/* ------------------------------------------------------ */
	// Bottom Spacer
	widgetHello.addSpacer();
	widgetHello.setPadding(15, 7, 10, 0);

	// Set widget
	Script.setWidget(widgetHello);
	Script.complete();


	/* ------------------------ */
	/* Assemble Widget Finished */
	/* ------------------------ */
}


/* ---------------------------------------------------------------------- */
/* Functions                                                              */
/* ---------------------------------------------------------------------- */



// Render battery with data
function renderBattery(batteryLevel) {
	const left = "▓".repeat(Math.floor(batteryLevel * 20));
	const used = "░".repeat(20 - left.length)
	const batteryAscii = left + used + " ";
	return batteryAscii;
}

// Render year progress
function renderYearProgress() {
	const now = new Date()
	const start = new Date(now.getFullYear(), 0, 1) // Start of this year
	const end = new Date(now.getFullYear() + 1, 0, 1) // End of this year
	const progress = (now - start) / (end - start);
	return renderProgress(progress)
}

function renderProgress(progress) {
	const used = '▓'.repeat(Math.floor(progress * 20))
	const left = '░'.repeat(20 - used.length)
	return `${used}${left} [${Math.floor(progress * 100)}%]`;
}


// Download weather img
async function fetchImgUrl(url) {
	const request = new Request(url)
	var res = await request.loadImage();
	return res;
}

async function downloadWeatherImg(path) {
	const url = "http://a.animedlweb.ga/weather/weathers25_2.json";
	const data = await fetchWeatherData(url);
	var dataimg = null;
	var name = null;
	if (path.includes("bg")) {
		dataimg = data.background;
		name = path.replace("_bg", "");
	} else {
		dataimg = data.icon;
		name = path.replace("_ico", "");
	}
	var imgurl = null;
	switch (name) {
		case "01d":
			imgurl = dataimg._01d;
			break;
		case "01n":
			imgurl = dataimg._01n;
			break;
		case "02d":
			imgurl = dataimg._02d;
			break;
		case "02n":
			imgurl = dataimg._02n;
			break;
		case "03d":
			imgurl = dataimg._03d;
			break;
		case "03n":
			imgurl = dataimg._03n;
			break;
		case "04d":
			imgurl = dataimg._04d;
			break;
		case "04n":
			imgurl = dataimg._04n;
			break;
		case "09d":
			imgurl = dataimg._09d;
			break;
		case "09n":
			imgurl = dataimg._09n;
			break;
		case "10d":
			imgurl = dataimg._10d;
			break;
		case "10n":
			imgurl = dataimg._10n;
			break;
		case "11d":
			imgurl = dataimg._11d;
			break;
		case "11n":
			imgurl = dataimg._11n;
			break;
		case "13d":
			imgurl = dataimg._13d;
			break;
		case "13n":
			imgurl = dataimg._13n;
			break;
		case "50d":
			imgurl = dataimg._50d;
			break;
		case "50n":
			imgurl = dataimg._50n;
			break;
	}
	const image = await fetchImgUrl(imgurl);
	fm.writeImage(wBasePath + path + ".png", image);
}


// Get Json weather
async function fetchWeatherData(url) {
	const request = new Request(url);
	const res = await request.loadJSON();
	return res;
}

// Load image from local drive
async function fetchImageLocal(path) {
	var finalPath = wBasePath + path + ".png";
	if (fm.fileExists(finalPath) == true) {
		console.log("file exists: " + finalPath);
		return finalPath;
	} else {
		//throw new Error("Error file not found: " + path);
		if (fm.fileExists(wBasePath) == false) {
			console.log("Directry not exist creating one.");
			fm.createDirectory(wBasePath);
		}
		console.log("Downloading file: " + finalPath);
		await downloadWeatherImg(path);
		if (fm.fileExists(finalPath) == true) {
			console.log("file exists after download: " + finalPath);
			return finalPath;
		} else {
			throw new Error("Error file not found: " + path);
		}
	}
}