const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("phising.db", (err) => {
  if (err) return console.log("Error", err.message);

  console.log("database is connected");
});

const login_credential = `CREATE TABLE IF NOT EXISTS
    login_credential(id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT)
`;

const dropTable = `DROP TABLE IF EXISTS login_credential`;

db.serialize(() => {
  db.run(login_credential);

  // droping the table
  // db.run(dropTable, (err)=>{
  //   if (err) return console.log(err.message);
  //   console.log('table has been drop');
    
  // });
});

module.exports = db;
