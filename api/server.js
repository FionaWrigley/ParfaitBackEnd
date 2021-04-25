//server.js
const app = require("./app");
const port = process.env.API_PORT;


app.listen(port, () => console.log(`Parfait listening on port ${port}!`));





