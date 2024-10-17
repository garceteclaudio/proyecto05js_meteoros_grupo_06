const express = require("express");

const app = express();

//endpoint get o post
app.get("/", (req, res) => {
  //res.end("Bienvenidos a mi server backend");
  //console.log(__dirname);
  res.sendFile(__dirname + "/public/views/index.html");
});

//routing, accesos directos a los recursos con los q trabajamos
app.use("/src", express.static(__dirname + "/src"));
app.use("/public", express.static(__dirname + "/public"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));

//listening
app.listen(5000, () => {
  console.log("Iniciando el servidor Node...");
  console.log("¡El servidor node se está ejecutando!");
});

