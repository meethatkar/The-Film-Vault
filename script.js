// API key = f5ea5c37

let api_url = "http://www.omdbapi.com/?t=";
let api_key = "f5ea5c37";
let movieName = "";

var formDiv = document.querySelector("#input-Form");

formDiv.addEventListener("submit", async (event) => {
    // alert("fomr clicked");
    event.preventDefault();
    movieName = document.querySelector("input").value;
    movieName = movieName.replace(/\s/g, "+");
    const response = await fetch("/.netlify/functions/api_call")
    .then(res => res);
    console.log(response);
    
    // callApi(movieName);
})


async function callApi(movieName) {
    document.querySelector("#display-wrapper").style.opacity = "0";
    document.querySelector("#start-div").style.opacity = "0";
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
        const imgUrl = apiData.Poster;
        console.log(imgUrl);
        
        if(imgUrl == "N/A" || !imgUrl.endsWith(".jpg")){
                document.querySelector("#msg").style.display = "block";
                renderDetails();
        }
        else{
            // debugger;
            // alert("onload")
            document.querySelector("img").src = imgUrl;
            document.querySelector("img").onload = () => {
            renderDetails();
        }
        }
        // if(!document.querySelector("img")){
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
var cursor = document.querySelector("#cursor");
var cursor_blur = document.querySelector("#cursor-blur");

// CURSOR
    if(window.innerWidth>768){
        window.addEventListener("load",()=>{
        // alert("loaded");
        document.querySelector("body").addEventListener("mousemove",(dets)=>{
            // console.log(dets);
            
            cursor.style.top = dets.y+(-5)+"px";
            cursor.style.left = dets.x+(-7)+"px";
            cursor_blur.style.top = dets.y+(-17)+"px";
            cursor_blur.style.left = dets.x+(-17)+"px";
        })
    })

    }
    let initialPos = `M 10 20 Q 300 20 590 20`;
    let finalPos = `M 10 20 Q 300 20 590 20`;

    window.addEventListener("DOMContentLoaded",()=>{
        document.querySelector("svg").addEventListener("mousemove",(dets)=>{
            // console.log(dets);
            
            cursor.style.display = "none";
            cursor_blur.style.display = "none";
            initialPos = `M 10 20 Q ${dets.layerX} ${dets.layerY} 590 20`
            gsap.to("svg path",{
                attr: {d:initialPos},
                duration:0.2,
            })            
        })
        document.querySelector("svg").addEventListener("mouseleave",(dets)=>{
            cursor.style.display = "block";
            cursor_blur.style.display = "block";
            gsap.to("svg path",{
                attr: {d:finalPos},
                duration:1,
                ease:"elastic.out(1,0.2)",
            })
        })
    })