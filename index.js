const express = require("express");
const app = express();
const cors = require("cors");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const db_config = require("./models/db");
const conn = db_config.init();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const front_api_Router = require("./routes/api/front_api");
const comp_api_Router = require("./routes/api/comp_api");

const hpp = require('hpp');
const helmet = require('helmet');
const http = require("http");
const https = require("https");
const fs = require("fs");
const moment = require('moment');
const { logger, error_logger } = require('./loger');



app.use(morgan(`log_${moment().format("YYYY-MM-DD")}`)); 
app.use("/upload", express.static("upload"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("Front"));
app.use(helmet());
app.disable("x-powered-by"); 
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);



if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
    app.use(morgan('combined'));
    app.use(hpp());
    app.use(helmet());
    app.use(cors({
        origin: process.env.ORIGIN_URL,
        credentials: true,
    }));
} else {
    app.use(morgan('dev'));
    app.use(cors({
        origin: true,
        credentials: true,
    }));
}


//app.use(cookieParser(process.env.COOKIE_SECRET));
//app.use(session({
//  saveUninitialized: false,
//  resave: false,
//  cookie: {
//    httpOnly: true,
//    secure: false,
//    domain: process.env.NODE_ENV === 'production' && '.grandskywind.net'
//  },
//}));




// const express = require('express');
// const cors = require('cors');
let corsOption = {
    origin: process.env.ORIGIN_URL,
    credentials: true 
}
app.use(cors(corsOption)); 




const corsOptions = {
    origin: process.env.ORIGIN_URL,
    //origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use("/api/front_api", cors(corsOptions), front_api_Router);
app.use("/api/comp_api", cors(corsOptions), comp_api_Router);



//app.use(express.static(path.join(__dirname, '../front/build')));
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.ORIGIN_URL);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // res.header('Access-Control-Allow-Headers',
    //     'Content-Type, Authorization, Content-Length, X-Requested-With');
    // next();
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});



app.get('/', (req, res) => {
    res.send('api server success');

})


app.listen(process.env.DEV_SERVER_PORT, () => {
  logger.info('server 8082 start')
  console.log(`port ${process.env.DEV_SERVER_PORT} server start`);
});


