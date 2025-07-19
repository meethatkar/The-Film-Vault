// API key = f5ea5c37

let api_url = "http://www.omdbapi.com/?t=";
let api_key = "f5ea5c37";
let movieName = "";

var formDiv = document.querySelector("#input-Form");

formDiv.addEventListener("submit", (event) => {
    // alert("fomr clicked");
    event.preventDefault();
    movieName = document.querySelector("input").value;
    movieName = movieName.replace(/\s/g, "+");
    callApi(movieName);
})


async function callApi(movieName) {
    document.querySelector("#display-wrapper").style.opacity = "0";
    document.querySelector("#loader").style.opacity = "1";
    var apiData = await fetch(api_url + movieName + "&apikey=" + api_key)
        .then(async (res) => {
            if (res.ok) {
                // console.log("res: ", res);

                let Api_data = await res.json();
                console.log(Api_data);

                return Api_data;
            }
            else {
                throw { status: res.status };
            }
        })
        .catch((error) => {
            if (error.status == 404) {
                console.log("NotFound");
            }
            else if (error.status == 500) {
                console.log("Server Error");
            }
            // NO INTERNET CONNECTION
            else if (!navigator.onLine) {
                console.log("NO INTERNET CONNECTION");

            }
            // JSON ERROR PARSING OR SYNTAX
            else if (error instanceof SyntaxError) {
                console.log("JSON ERROR PARSING OR SYNTAX");
            }
            // TYPE OR CORS ERROR
            else if (error instanceof TypeError) {
                console.log("TYPE OR CORS ERROR");
            }

        })
    return extractData(apiData);
}

function extractData(apiData) {
    if (apiData.Response == "False") {
        // alert("no such movie found")
        setTimeout(() => {
            document.querySelector("#not-found").style.opacity = "1";
            document.querySelector("#loader").style.opacity = "0";
            document.querySelector("#start-div").style.opacity = "0";
            document.querySelector("#display-wrapper").style.opacity = "0";
        }, 2000);
    }
    else {
        console.log("API DATA: ", apiData);
        document.querySelector("img").src = apiData.Poster;
        document.querySelector("img").onload = () => {
            renderDetails();
        }
        // if(!document.querySelector("img")){
        //     document.querySelector("#msg").style.display = "block";
        //     renderDetails();
        // }
    }

    function renderDetails() {
        document.querySelector("#title").innerText = apiData.Title;
        document.querySelector("#date>p").innerText = apiData.Released;
        document.querySelector("#actor>p").innerText = apiData.Actors;
        document.querySelector("#rating>p").innerText = `⭐ ${apiData.imdbRating} by ${apiData.imdbVotes}`;
        document.querySelector("#box-office>p").innerText = apiData.BoxOffice;
        document.querySelector("#plot>p").innerText = apiData.Plot;
        let genreArr = apiData.Genre.split(",");
        genreArr.forEach((genre) => {
            // console.log(genre);
            let spanDiv = document.createElement("span");
            spanDiv.innerText = genre;
            document.querySelector("#span-div").appendChild(spanDiv);
        })
        setTimeout(() => {
            document.querySelector("#loader").style.opacity = "0";
            document.querySelector("#loader video").autoplay = false;
            document.querySelector("#start-div").style.opacity = "0";
            document.querySelector("#display-wrapper").style.opacity = "1";
        }, 2000);
    }
}