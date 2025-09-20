const moongose=require("mongoose");
const mainConnection = moongose.createConnection(
  "mongodb+srv://akshita:OJUpX2U63DrM381X@cluster0.k3jpfnc.mongodb.net/auth-db"
);
const taskConnection = moongose.createConnection(
  "mongodb+srv://akshita:OJUpX2U63DrM381X@cluster0.k3jpfnc.mongodb.net/task-db"
);

const teamsConnection=moongose.createConnection(
   "mongodb+srv://akshita:OJUpX2U63DrM381X@cluster0.k3jpfnc.mongodb.net/teams-db"
);

const connectionRequest=moongose.createConnection(
  "mongodb+srv://akshita:OJUpX2U63DrM381X@cluster0.k3jpfnc.mongodb.net/connection-db"
)
mainConnection.on("connected", () => {
  console.log("✅ Connected to auth-db");
});

taskConnection.on("connected", () => {
  console.log("✅ Connected to task-db");
});

module.exports = { mainConnection, taskConnection ,teamsConnection ,connectionRequest};