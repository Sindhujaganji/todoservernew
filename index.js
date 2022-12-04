const http = require("http");
const path = require("path");
const fs = require("fs");
const todo = require("./controllers");
const { getReqData } = require("./utils");

const server = http.createServer(async (req, res) => {
    console.log('req',req.method);
    if (req.url === '/') {
        // read public.html file from public folder
        fs.readFile(path.join(__dirname, 'public', 'index.html'),
            (err, content) => {

                if (err) throw err;
                res.setHeader("Access-Control-Allow-Origin", "*")
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(content);
            }
        );
    } else if (req.url === '/about') {
        // read the about.html file public folder
        fs.readFile(
            path.join(__dirname, 'public', 'about.html'),
            (err, content) => {

                if (err) throw err;
                res.setHeader("Access-Control-Allow-Origin", "*")
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(content);
            }
        );
    }


    /*else if (req.url==='/api')
    {
        fs.readFile(
            path.join(__dirname, 'public', 'db.json'),'utf-8',
            (err, content) => {

                if (err) throw err;
                // Please note the content-type here is application/json
                res.setHeader("Access-Control-Allow-Origin", "*")
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(content);
            }
        );
    }*/


        else if (req.url === "/api" && req.method === "GET") {
        // get the todos.
        const todos = await new todo().getTodos();
        // set the status code, and content-type
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.writeHead(200, {"Content-Type": "application/json"});
        // send the data
        res.end(JSON.stringify(todos));
    }
    // /api/todos/:id : UPDATE
    else if (req.url.match(/\/api\/([0-9]+)/) && req.method === "POST") {
        const {headers, method, url} = req;
        console.log('POST',req.method);
        try {
            // get the id from the url
            const id = req.url.split("/")[2];
            console.log('id',id);
            // update todo
            let updated_todos = await new todo().updateTodo(id);
            console.log('updated_todos list',updated_todos);
            res.setHeader("Access-Control-Allow-Origin", "*")
            // set the status code and content-type
            res.writeHead(200, { "Content-Type": "application/json"});
          //  const responseBody = { headers, method, url, body:updated_todos };

         //   response.write(JSON.stringify(responseBody));
          //  response.end(JSON.stringify(responseBody));
            // send the message
          //  res.end(JSON.stringify(updated_todos));
           res.end(JSON.stringify(updated_todos));
        } catch (error) {
            // set the status code and content type
            res.writeHead(404, { "Content-Type": "application/json" });
            // send the error
            res.end(JSON.stringify({ message: error }));
        }
    }
    else{
        res.end("<h1> 404 nothing is here</h1>");
    }
});

const PORT= process.env.PORT || 5959;

server.listen(PORT,()=> console.log(`Great our server is running on port ${PORT} `));