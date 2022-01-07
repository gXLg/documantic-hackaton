const https = require("https");

function request(options, limit, body){

  return new Promise(async (resolve, reject) => {

    // ratelimit handling
    let i = false
    for(let bucket in limit){
      if(options.path in limit[bucket].paths){
        if(limit[bucket].remaining == 0){
          i = true;
          while((new Date().valueOf() / 1000) < limit[bucket].reset){}
        }
        break;
      }
    }

    const req = https.request(options, res => {

      const buffer = [];
      res.on("data", data => buffer.push(data));
      res.on("end", () => {

        // ratelimit setup
        if(!i){
          if("x-ratelimit-bucket" in res.headers){
            const bucket = res.headers["x-ratelimit-bucket"];
            if(bucket in limit){
              limit[bucket].paths.push(options.path);
            } else {
              limit[bucket] = {
                "paths": [options.path],
              };
            }
            limit[bucket].remaining = parseInt(res.headers["x-ratelimit-remaining"]);
            limit[bucket].reset = parseFloat(res.headers["x-ratelimit-reset"]);
          }
        }

        const data = buffer.join("");
        if(data == "") resolve({ });
        else resolve(JSON.parse(data));
      });
    })

    req.on("error", error => {
      reject(error);
    });

    if(body) req.write(body);
    req.end();

  });
}

// rest api request maker
// since will use this for discord,
// can simplify and use the same base url all the time
class Rest {

  limit = { };

  constructor(url, headers){
    const urlObject = new URL(url);
    this.hostname = urlObject.hostname;
    this.path = urlObject.pathname;
    headers["Content-Type"] = "application/json";
    this.headers = headers;
  }

  post(path, jsonBody){
    const options = {
      "hostname": this.hostname,
      "path": this.path + path,
      "method": "POST",
      "headers": this.headers
    };
    return request(options, this.limit, JSON.stringify(jsonBody));
  }

  patch(path, jsonBody){
    const options = {
      "hostname": this.hostname,
      "path": this.path + path,
      "method": "PATCH",
      "headers": this.headers
    };
    return request(options, this.limit, JSON.stringify(jsonBody));
  }

  put(path){
    const options = {
      "hostname": this.hostname,
      "path": this.path + path,
      "method": "PUT",
      "headers": this.headers
    };
    return request(options, this.limit);
  }

  get(path){
    const options = {
      "hostname": this.hostname,
      "path": this.path + path,
      "method": "GET",
      "headers": this.headers
    };
    return request(options, this.limit);
  }

  del(path){
    const options = {
      "hostname": this.hostname,
      "path": this.path + path,
      "method": "DELETE",
      "headers": this.headers
    };
    return request(options, this.limit);
  }

}

module.exports = Rest;