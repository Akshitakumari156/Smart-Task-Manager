const moongose=require("mongoose");
const mainConnection = moongose.createConnection(
  "mongodb+srv://akshitakumari156_db_user:70iPkLXfgiGSGaKo@cluster0.jcmnw64.mongodb.net/auth-db"
);
const taskConnection = moongose.createConnection(
  "mongodb+srv://akshitakumari156_db_user:70iPkLXfgiGSGaKo@cluster0.jcmnw64.mongodb.net/task-db"
);

const teamsConnection=moongose.createConnection(
   "mongodb+srv://akshitakumari156_db_user:70iPkLXfgiGSGaKo@cluster0.jcmnw64.mongodb.net/teams-db"
);

const connectionRequest=moongose.createConnection(
  "mongodb+srv://akshitakumari156_db_user:70iPkLXfgiGSGaKo@cluster0.jcmnw64.mongodb.net/connection-db"
)
mainConnection.on("connected", () => {
  console.log("✅ Connected to auth-db");
});

taskConnection.on("connected", () => {
  console.log("✅ Connected to task-db");
});

module.exports = { mainConnection, taskConnection ,teamsConnection ,connectionRequest};