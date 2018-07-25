var env = require("dotenv").config();
var keys = require("./keys.js");

var Twitter = require('twitter');
var input = process.argv[3];
var client = new Twitter(keys.twitter);

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var request = require('request');

var fs = require('fs');

if (process.argv[2] == "my-tweets") {
    twitter();
}

if (process.argv[2] == "spotify-this-song") {
	spot(input);
}

if (process.argv[2] == "movie-this") {
	omdb(input);
}

if (process.argv[2] == "do-what-it-says") {
	random();
}

function twitter() {
	var params = {screen_name: "EngineerinWins", count: 20};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			for (i = 0; i < tweets.length; i ++){
				console.log("Tweet: " + "'" + tweets[i].text + "'" + " Tweeted At: " + tweets[i].created_at);
			}
		} else {
			console.log(error);
		}
	});

}

function spot(input) {
	// console.log(input)
	if (input === void(0)){
		input = "The Sign Ace of Base"
	}
	// console.log(input)
	spotify.search({ type: 'track', query: input }, function(err, data) {
		if (err){
			console.log('Error occurred: ' + err);
			return;
		}
		var songInfo = data.tracks.items;
		console.log("Artist(s): " + songInfo[0].artists[0].name);
		console.log("Song Name: " + songInfo[0].name);
		console.log("Preview Link: " + songInfo[0].preview_url);
		console.log("Album: " + songInfo[0].album.name);
	});
}

function omdb(input) {
	if (input === void(0)){
		input = 'Mr Nobody';
	}
	var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";
	request(queryUrl, function(error, response, body) {
		    console.log("Title: " + JSON.parse(body).Title);
		    console.log("Year Released: " + JSON.parse(body).Year);
		    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
		    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
		    console.log("Country Produced: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
		    console.log("Plot: " + JSON.parse(body).Plot);
		    console.log("Actors: " + JSON.parse(body).Actors)
	});
};

function random() {
	fs.readFile('random.txt', "utf8", function(error, data){
		if (error) {
			return console.log(error);
		}
	  var dataArr = data.split(",");
	  if (dataArr[0] === "spotify-this-song") {
		  var playSpot = dataArr[1].slice(1, -1);
		  spot(playSpot);
	  } else if (dataArr[0] === "my-tweets") {
		  var lookTweets = dataArr[1].slice(1, -1);
		  twitter(lookTweets);
	  } else if(dataArr[0] === "movie-this") {
		  var movieInfo = dataArr[1].slice(1, -1);
		  movie(movieInfo);
	  } 
	  
	});

};
