const https = require("https");

function request(options, body){
  return new Promise((resolve, reject) => {

    const req = https.request(options, res => {

      const buffer = [];
      res.on("data", data => buffer.push(data));
      res.on("end", () => {
        const data = buffer.join("");
        if(data == "") resolve({ });
        else resolve(JSON.parse(buffer.join("")));
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
    return request(options, JSON.stringify(jsonBody));
  }

  patch(path, jsonBody){
    const options = {
      "hostname": this.hostname,
      "path": this.path + path,
      "method": "PATCH",
      "headers": this.headers
    };
    return request(options, JSON.stringify(jsonBody));
  }

  put(path){
    const options = {
      "hostname": this.hostname,
      "path": this.path + path,
      "method": "PUT",
      "headers": this.headers
    };
    return request(options);
  }

  get(path){
    const options = {
      "hostname": this.hostname,
      "path": this.path + path,
      "method": "GET",
      "headers": this.headers
    };
    return request(options);
  }

  del(path){
    const options = {
      "hostname": this.hostname,
      "path": this.path + path,
      "method": "DELETE",
      "headers": this.headers
    };
    return request(options);
  }

}

module.exports = Rest;