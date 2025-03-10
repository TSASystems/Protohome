const http = require("http");
const mariadb = require("mariadb");
const crypto = require("crypto");
const schedule = require("node-schedule");

const pool = mariadb.createPool({
    host: "database-1.cj4yamaa8tq2.eu-west-2.rds.amazonaws.com",
    port: 3306,
    database: "Protohome",
    user: "admin",
    password: "4ISm53ets9FZMLgelYS5"
});

let authIds = new Map();
let auths = new Set();

const job = schedule.scheduleJob('0 0 * * *', () => {
    authIds.forEach((un, v) => {
        v[1] -= 1;
    });
});


const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", "application/json");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        return res.end();
    }

    console.log("requested!");
    if (req.method === "POST") {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            let reqBody = JSON.parse(body);
            switch(req.url) {
                case "/API/login":
                    if (userAuth.get(crypto.createHash("sha256").update(reqBody.username)) === reqBody.sessionToken) {
                        res.writeHead(200);
                        res.end()
                    } else {
                        login(reqBody.username, reqBody.password)
                            .then(r => {
                                if (r) {
                                    res.writeHead(200);
                                    if (reqBody.staySignedIn) {
                                        let userAuth = crypto.randomBytes(32).toString("hex");
                                        while (auths.has(userAuth)) {
                                            userAuth = crypto.randomBytes(32).toString("hex");
                                        }
                                        authIds.set(crypto.createHash("sha256").update(reqBody.username), [userAuth, 30]);
                                        auths.add(userAuth);
                                        res.write(JSON.stringify({sessionToken: userAuth}))
                                    }
                                } else {
                                    res.writeHead(401);
                                }
                                res.end();
                            });
                    }
                    break;
                case "/API/register":
                    createAccount(reqBody.username, reqBody.password, reqBody.firstName, reqBody.lastName)
                        .then(r => {
                            if (r) {
                                res.writeHead(200);
                                if (reqBody.staySignedIn) {
                                    let userAuth = crypto.randomBytes(32).toString("hex");
                                    while (auths.has(userAuth)) {
                                        userAuth = crypto.randomBytes(32).toString("hex");
                                    }
                                    authIds.set(crypto.createHash("sha256").update(reqBody.username), [userAuth, 30]);
                                    auths.add(userAuth);
                                    res.write(JSON.stringify({sessionToken: userAuth}))
                                }
                            } else {
                                res.writeHead(409);
                            }
                            res.end();
                        });
                    break;
                case "/API/devicePower":
                    getDevicePower(reqBody.deviceTypes)
                        .then(r => {
                            if (r.length > 0) {
                                res.writeHead(200);
                            } else {
                                res.writeHead(409);
                            }
                            console.log(r);
                            // res.write();
                            res.end();
                        });
                    break;
                case "/API/addDevice":
                    // TODO: ADD DEVICE TO HOUSEHOLD
                    break;
                    case "/API/getUserDetails":
                    getUserDetails(reqBody.userId)
                    
                        .then(r => {
                            if (r) {
                            res.writeHead(200);

                        } else{
                            res.writeHead(409);
                        }
                        console.log(r)
                        res.end()
                    });
                    break;
                default:
                    res.writeHead(403);
                    res.end();
                }
            });

    }
}).listen(80);

async function createAccount(username, password, firstName, lastName) {
    let connection;
    try {
        connection = await pool.getConnection();
        let rows = await connection.query("SELECT true FROM UserCredentials WHERE username = ?;", [username])
        if (rows.length !== 0)
            return false;

        let salt = crypto.randomBytes(8).toString("hex");
        let passwordHash = crypto.createHash("sha256").update(password).update(salt).digest("hex");
        await connection.query("INSERT INTO UserCredentials (username, passwordHash, salt, firstName, lastName) VALUES (?, ?, ?, ?, ?);", [username, passwordHash, salt, firstName, lastName]);
        return true;
    } catch(err) {
        console.error(err);
        return false;
    } finally {
        connection.end();
    }
}

async function login(username, password) {
    let connection;
    let salt = "";
    try {
        connection = await pool.getConnection();
        let rows = await connection.query("SELECT salt FROM UserCredentials WHERE username = ?;", [username]);
        if (rows.length === 0) {
            return false;
        } else {
            salt = rows[0].salt;
        }
        let passwordHash = crypto.createHash("sha256").update(password).update(salt).digest("hex");
        rows = await connection.query("SELECT true FROM UserCredentials WHERE username = ? AND passwordHash = ?;", [username, passwordHash])
                
        return rows.length > 0;
    } catch (err) {
        console.error(err);
        return false;
    } finally {
        connection.end();
    }
}

async function getDevicePower(deviceTypeList)
{
    let connection;
    try {
        connection = await pool.getConnection();
        let rows = await connection.query("SELECT * FROM DeviceTypes;");
        if (deviceTypeList.length > 0) {
            let types = new Set(deviceTypeList);
            rows = rows.filter((e) => types.has(e.deviceTypeName))
        }
        return rows.map(device => `{\"${device.deviceTypeName}\":${device.powerConsumption}}`);
    } catch (err) {
        console.error(err);
        return [];
    } finally {
        connection.end();
    }
}

async function getUserDetails(userId){
    let connection;
    try{
        connection = await pool.getConnection();
        let rows = await connection.query("SELECT * FROM UserCredentials WHERE userId = ?;", [userId])
        if (rows.length > 0) {
            return rows[0];
        }
        return null;
        
    }catch (err){
        console.error(err);
        return null;
    }finally {
        connection.end()
    }


}   

/*
fetch("http://localhost/API/devicePower", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                deviceTypes: ['TV', 'Microwave']
            })});
*/
