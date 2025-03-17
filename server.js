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

    if (req.method === "POST") {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            let reqBody = JSON.parse(body);
            switch(req.url) {
                case "/API/loginWithToken":
                    loginWithToken(reqBody.authId, reqBody.username)
                    break;
                case "/API/login":
                    login(reqBody.emailOrUsername, reqBody.password)
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
                    break;
                case "/API/register":
                    createAccount(reqBody.username, reqBody.password, reqBody.emailAddress, reqBody.dob, reqBody.address, reqBody.firstName, reqBody.lastName)
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
                case "/API/deleteAccount":
                    deleteAccount(reqBody.emailAddress, reqBody.username, reqBody.password)
                        .then(r => {
                            if (r) {
                                res,writeHead(200);
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
                            // res.write();
                            res.end();
                        });
                    break;
                case "/API/addDevice":
                    addDevice(reqBody.deviceName, reqBody.deviceTypeId, reqBody.householdId)
                        .then(r => {
                            if (r) {
                                res.writeHead(200);
                            } else {
                                res.writeHead(500);
                            }
                            res.end();
                        });
                    break;
                case "/API/removeDevice":
                    removeDevice(reqBody.deviceId, reqBody.householdId)
                        .then(r => {
                            if (r) {
                                res.writeHead(200);
                            } else {
                                res.writeHead(403);
                            }
                            res.end();
                        });
                    break;
                case "/API/getDeviceTypes":
                    getDeviceTypes()
                        .then(r => {
                            if (r.length > 0) {
                                res.writeHead(200);
                            } else {
                                res.writeHead(500);
                            }
                            res.write(r);
                            res.end();
                        });
                    break;
                case "/API/getHouseholdDevices":
                    getHouseholdDevices(reqBody.householdId)
                        .then(r => {
                            if (r.length > 0) {
                                res.writeHead(200);
                            } else {
                                res.writeHead(500);
                            }
                            res.write(JSON.stringify(r));
                            res.end();
                        });
                    break;
                case "/API/getUserDetails":
                    getUserDetails(reqBody.userId)
                    
                        .then(r => {
                            if (r) {
                            res.writeHead(200);

                        } else{
                            res.writeHead(409);
                        }
                        res.end()
                    });
                    break;
                case "/API/toggleDevice":
                    toggleDevice(reqBody.deviceId, reqBody.householdId)
                        .then(r => {
                            if (r) {
                                res.writeHead(200);
                            } else {
                                res.writeHead(500);
                            }
                            res.end();
                        });
                    break;  
                default:
                    res.writeHead(403);
                    res.end();
                }
            });

    }
}).listen(80);

async function createAccount(username, password, emailAddress, dob, address, firstName, lastName) {
    let connection;
    try {
        connection = await pool.getConnection();
        let rows = await connection.query("SELECT true FROM UserCredentials WHERE username = ?;", [username])
        if (rows.length !== 0)
            return false;

        let salt = crypto.randomBytes(8).toString("hex");
        let passwordHash = crypto.createHash("sha256").update(password).update(salt).digest("hex");
        await connection.query("INSERT INTO UserCredentials (username, passwordHash, salt, emailAddress, dateOfBirth, address, firstName, lastName) VALUES (?, ?, ?, ?, ?, ?, ?, ?);", [username, passwordHash, salt, emailAddress, dob, address, firstName, lastName]);
        return true;
    } catch(err) {
        console.error(err);
        return false;
    } finally {
        connection.end();
    }
}

async function login(emailOrUsername, password) {
    emailOrUsername = emailOrUsername.toLowerCase();
    let connection;
    let salt = "";
    let isUsername = false;
    try {
        connection = await pool.getConnection();
        let rows = await connection.query("SELECT salt FROM UserCredentials WHERE LOWER(username) = ?;", [emailOrUsername]);
        if (rows.length === 0) {
            rows = await connection.query("SELECT salt FROM UserCredentials WHERE LOWER(emailAddress) = ?;", [emailOrUsername]);
            if (rows.length === 0)
                return false;
        } else {
            isUsername = true;
        }
        salt = rows[0].salt;
        let passwordHash = crypto.createHash("sha256").update(password).update(salt).digest("hex");
        if (isUsername)
            rows = await connection.query("SELECT true FROM UserCredentials WHERE LOWER(username) = ? AND passwordHash = ?;", [emailOrUsername, passwordHash]);
        else
            rows = await connection.query("SELECT true FROM UserCredentials WHERE LOWER(emailAddress) = ? AND passwordHash = ?;", [emailOrUsername, passwordHash]);

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
        return "\""+rows.map(device => `{\"${device.deviceTypeName}\":${device.powerConsumption}}`)+"\"";
    } catch (err) {
        console.error(err);
        return [];
    } finally {
        connection.end();
    }
}

async function getUserDetails(userId) {
    let connection;
    try {
        connection = await pool.getConnection();
        let rows = await connection.query("SELECT * FROM UserCredentials WHERE userId = ?;", [userId])
        if (rows.length > 0) {
            return rows[0];
        }
        return null;
        
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.end()
    }
}   

async function getDeviceTypes() {
    let connection;
    try {
        connection = await pool.getConnection();
        let rows = await connection.query("SELECT * FROM DeviceTypes;");
        return JSON.stringify(rows);
    } catch (err) {
        console.error(err);
        return [];
    } finally {
        connection.end();
    }
}

async function addDevice(deviceName,deviceTypeId,householdId) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query("INSERT INTO Devices (deviceName,deviceTypeId,householdId) VALUES (?,?,?)", [deviceName,deviceTypeId,householdId]);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    } finally {
        connection.end();
    }
}

async function removeDevice(deviceId, householdId) {
    let connection;
    try {
        connection = await pool.getConnection();
        let res = await connection.query("DELETE FROM Devices WHERE deviceId=? AND householdId=?", [deviceId,householdId]);
        return (res.affectedRows > 0);
    } catch (err) {
        console.error(err);
        return false;
    } finally {
        connection.end();
    }
}

async function getHouseholdDevices(householdId) {
    let connection;
    try {
        connection = await pool.getConnection();
        let rows = await connection.query("SELECT deviceId, deviceName, deviceTypeId, status FROM Devices WHERE householdId=?", [householdId]);
        let deviceTypeSet = new Set(rows.map(d => d.deviceTypeId));
        let deviceTypes = await connection.query("SELECT deviceTypeId, powerConsumption FROM DeviceTypes");
        let householdDeviceTypes = deviceTypes.filter(d => deviceTypeSet.has(d.deviceTypeId));
        let householdDevicePowers = {};
        for (let i in householdDeviceTypes) {
            householdDevicePowers[householdDeviceTypes[i].deviceTypeId] = householdDeviceTypes[i].powerConsumption;
        }
        return rows.map(d => `{\"deviceId\" : ${d.deviceId}, \"deviceName\" : \"${d.deviceName}\", \"deviceTypeId\" : ${d.deviceTypeId}, \"powerConsumption\" : ${householdDevicePowers[d.deviceTypeId]}, \"status\": ${(d.status === "on")? true : false}}`);
    } catch (err) {
        console.error(err);
        return [];
    } finally {
        connection.end();
    }
}

async function toggleDevice(deviceId, householdId) {
    console.log(householdId);
    let connection;
    try {
        connection = await pool.getConnection();
        let rows = await connection.query("SELECT status FROM Devices WHERE deviceId = ? AND householdId = ?;", [deviceId, householdId]);
        if (rows.length <= 0)
            return false;
        let res = await connection.query("UPDATE Devices SET status = ? WHERE deviceId = ? AND householdId = ?", [(rows[0].status === "on")? "off" : "on", deviceId, householdId]);
        console.log(res);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    } finally {
        connection.end();
    }
}