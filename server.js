import express from 'express';
const server = express()
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

server.use(express.urlencoded({extended: true}));
server.use(express.json());

import fileUpload from 'express-fileupload';
server.use(fileUpload());

server.set("view engine", "pug")

const port = 3000

import routes from "./routes.js";
server.use(express.static(__dirname));
server.use("/", routes);

server.listen(port);
console.log(`http://localhost:${port}`)
