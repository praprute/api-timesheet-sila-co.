const express      = require('express')
const app          = express()
const cors         = require('cors')
const bodyParser   = require('body-parser')
const mysql        = require('mysql')
const myConnection = require('express-myconnection')
const configdata   = require('./confix')
const routes       = require('./route')

const PORT = 3021;

app.use(cors())
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true
    })
);
app.use(
    bodyParser.json({
        limit: "50mb"
    })
);

var connection = mysql.createConnection({
    host: '128.199.179.127',
     user: 'silaadmin',
     password: 'silaapp4920',
     port: 3306,
     database: 'sila'
   });

// var connection = mysql.createConnection({
//      host: 'localhost',
//      user: 'root',
//      password: '',
//      port: 3306,
//      database: 'sila-lawer'
//    });

   connection.connect((err) => {
       if (err) {
           return console.error(err);
       }
   });

app.use(myConnection(mysql, configdata.dbOption, "pool"));
routes(app);

app.listen(PORT, () => {
    console.log("ready server on http://128.199.179.127:" + PORT);
});


