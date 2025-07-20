let api_url = "http://www.omdbapi.com/?t=";
let API_KEY = process.env.api_key;

exports.handler = async function(event, context){
    const eventBody = JSON.parse(event.body);
    // console.log(eventBody);
    let movieName = eventBody.movieName;

    var apiData = await fetch(api_url + movieName + "&apikey=" + API_KEY)
        .then(async (res) => {
            if (res.ok) {
                // console.log("res: ", res);

                let Api_data = await res.json();
                // console.log(Api_data);

                return Api_data;
            }
            else {
                throw { status: res.status };
            }
        })
        .catch((error) => {
            if (error.status == 404) {
                // console.log("NotFound");
             return{
                statusCode: 404,
                body:JSON.stringify({
                    message:error,
                })
             }
            }
            else if (error.status == 500) {
                // console.log("Server Error");
             return{
                statusCode: 404,
                body:JSON.stringify({
                    message:error,
                })
             }
            }
            // NO INTERNET CONNECTION
            else if (!navigator.onLine) {
                // console.log("NO INTERNET CONNECTION");
                 return{
                    statusCode: 404,
                    body:JSON.stringify({
                        message:error,
                    })
                 }

            }
            // JSON ERROR PARSING OR SYNTAX
            else if (error instanceof SyntaxError) {
                // console.log("JSON ERROR PARSING OR SYNTAX");
             return{
                statusCode: 404,
                body:JSON.stringify({
                    message:error,
                })
             }
            }
            // TYPE OR CORS ERROR
            else if (error instanceof TypeError) {
                // console.log("TYPE OR CORS ERROR");
             return{
                statusCode: 404,
                body:JSON.stringify({
                    message:error,
                })
             }
            }

        })

    return{
        statusCode: 200,
        body:JSON.stringify(apiData)
    }
}

// temp change commmented