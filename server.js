const http = require("http");
const mariadb = require("mariadb");
const crypto = require("crypto");
const schedule = require("node-schedule");
const fs = require('fs');
const { connect } = require("http2");

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
    for (let i of m.keys()) {
        let subMap = m.get(i);
        for (let j of subMap.keys()) {
            let duration = subMap.get(j);
            if (duration <= 1) {
                subMap.delete(j);
                auths.delete(j)
            } else {
                subMap.set(j, duration-1);
            }
            if (subMap.size === 0)
                m.delete(i);
        }
    }
});

const scheduler = schedule.scheduleJob('0 * * * *', async () => {
    let connection;
    try {
        connection = await pool.getConnection();
        let rows = await connection.query("SELECT deviceId, onTime, offTime FROM Devices WHERE onTime IS NOT NULL AND offTime IS NOT NULL");
        let hour = new Date().getHours();
        let on = [];
        let off = [];
        for (let row of rows) {
            if (row.onTime === hour) {
                on.push(row.deviceId);
            } else if (row.offTime === hour) {
                off.push(row.deviceId);
            }
        }
        
        if (on.length > 1)
            await connection.query(`UPDATE Devices SET status = "on" WHERE deviceId IN ?`, ["("+on.toString()+")"]);
        else if (on.length === 1)
            await connection.query(`UPDATE Devices SET status = "on" WHERE deviceId = ?`, [on.toString()]);

        if (off.length > 1)
            await connection.query(`UPDATE Devices SET status = "on" WHERE deviceId IN ?`, ["("+off.toString()+")"]);
        else if (off.length === 1)
            await connection.query(`UPDATE Devices SET status = "on" WHERE deviceId = ?`, [off.toString()]);
    } catch (err) {
        console.error(err);
    } finally {
        connection.end();
    }
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
                    if (loginWithToken(reqBody.authId, reqBody.username)) {
                        res.writeHead(200);
                    } else {
                        res.writeHead(403);
                    }
                    res.end();
                    break;
                case "/API/login":
                    login(reqBody.emailOrUsername, reqBody.password)
                        .then(r => {
                            if (r) {
                                getUsername(reqBody.emailOrUsername)
                                    .then(username => {
                                    if (username === undefined) {
                                        res.writeHead(500);
                                        res.end();
                                    } else {
                                        res.writeHead(200);
                                        createAuthToken(username, (reqBody.staySignedIn)? 30 : 2)
                                            .then(s => {
                                                res.write(s); 
                                                res.end();
                                            });
                                    }
                                });
                            } else {
                                res.writeHead(401);
                                res.end();
                            }
                        });
                    break;
                case "/API/register":
                    createAccount(reqBody.username, reqBody.password, reqBody.emailAddress, reqBody.dob, reqBody.address, reqBody.firstName, reqBody.lastName)
                        .then(r => {
                            if (r) {
                                res.writeHead(200);
                                createAuthToken(reqBody.username, (reqBody.staySignedIn)? 30 : 2)
                                    .then(s => {
                                        res.write(JSON.stringify(s));
                                        res.end();
                                    });
                            } else {
                                res.writeHead(409);
                                res.end();
                            }
                        });
                    break;
                case "/API/deleteAccount":
                    deleteAccount(reqBody.emailOrUsername, reqBody.password, reqBody.usernameHash, reqBody.authId)
                        .then(r => {
                            if (r) {
                                res.writeHead(200);
                            } else {
                                res.writeHead(500);
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
                    getHouseholdDevices(reqBody.householdId, reqBody.username, reqBody.authId)
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
                        res.end();
                    });
                    break;
                case "/API/toggleDevice":
                    toggleDevice(reqBody.deviceId, reqBody.householdId, reqBody.authId, reqBody.username)
                        .then(r => {
                            if (r) {
                                res.writeHead(200);
                            } else {
                                res.writeHead(500);
                            }
                            res.end();
                        });
                    break;
                case "/API/getHouseholds":
                    getUserHouseholds(reqBody.username, reqBody.authId)
                        .then(r => {
                            if (r.length > 0) {
                                res.writeHead(200);
                                res.write(JSON.stringify(r));
                            } else {
                                res.writeHead(500);
                            }
                            res.end();
                        });
                    break;
                case "/API/getHouseholdUsers":
                    getHouseholdUsers(reqBody.username, reqBody.authId)
                        .then(r => {
                            if (r.length > 0) {
                                res.writeHead(200);
                                res.write(JSON.stringify(r));
                            } else {
                                res.writeHead(500);
                            }
                            res.end();
                        });
                    break;
                case "/API/removeUserFromHousehold":
                    removeUserFromHousehold(reqBody.householdId, reqBody.username, reqBody.authId, reqBody.targetUser)
                        .then(r => {
                            if (r === 1) {
                                res.writeHead(200);
                            } else if (r === 0) {
                                res.writeHead(500);
                            } else {
                                res.writeHead(403);
                            }
                            res.end();
                        });
                    break;
                case "/API/addUserToHousehold":
                    addUserToHousehold(reqBody.householdId, reqBody.username, reqBody.authId, reqBody.targetUser, reqBody.userType)
                        .then(r => {
                            if (r === 1) {
                                res.writeHead(200);
                            } else if (r === 0) {
                                res.writeHead(500);
                            } else {
                                res.writeHead(403);
                            }
                            res.end();
                        });
                    break;
                case "/API/createHousehold":
                    createHousehold(reqBody.username, reqBody.authId, reqBody.householdName)
                        .then(r => {
                            if (r === 1) {
                                res.writeHead(200);
                            } else if (r === 0) {
                                res.writeHead(500);
                            } else {
                                res.writeHead(403);
                            }
                            res.end();
                        });
                    break;
                case "/API/scheduleDevice":
                    scheduleDevice(reqBody.username, reqBody.authId, reqBody.deviceId, reqBody.onTime, reqBody.offTime)
                        .then(r => {
                            if (r === 1) {
                                res.writeHead(200);
                            } else if (r === 0) {
                                res.writeHead(500);
                            } else {
                                res.writeHead(403);
                            }
                            res.end();
                        });
                    break;
                case "/API/removeSchedule":
                    removeSchedule(reqBody.username, reqBody.authId, reqBody.deviceId)
                        .then(r => {
                            if (r === 1) {
                                res.writeHead(200);
                            } else if (r === 0) {
                                res.writeHead(500);
                            } else {
                                res.writeHead(403);
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
        let rows = await connection.query("SELECT true FROM UserCredentials WHERE LOWER(username) = ? OR LOWER(emailAddress) = ?;", [username.toLowerCase(), emailAddress.toLowerCase()])
        if (rows.length !== 0)
            return false;

        let salt = crypto.randomBytes(8).toString("hex");
        let passwordHash = crypto.createHash("sha256").update(password).update(salt).digest("hex");
        await connection.query("INSERT INTO UserCredentials (username, passwordHash, salt, emailAddress, dateOfBirth, address, firstName, lastName) VALUES (?, ?, ?, ?, ?, ?, ?, ?);", [username, passwordHash, salt, emailAddress||"NULL", dob||"NULL", address||"NULL", firstName||"NULL", lastName||"NULL"]);
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
    try {
        connection = await pool.getConnection();
        let rows = await connection.query("SELECT salt FROM UserCredentials WHERE LOWER(username) = ? OR LOWER(emailAddress) = ?;", [emailOrUsername, emailOrUsername]);
        salt = rows[0].salt;
        let passwordHash = crypto.createHash("sha256").update(password).update(salt).digest("hex");
        rows = await connection.query("SELECT true FROM UserCredentials WHERE (LOWER(username) = ? OR LOWER(emailAddress) = ?) AND passwordHash = ?;", [emailOrUsername, emailOrUsername, passwordHash]);

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
        let res = await connection.query("DELETE FROM Devices WHERE deviceId = ? AND householdId = ?", [deviceId,householdId]);
        return (res.affectedRows > 0);
    } catch (err) {
        console.error(err);
        return false;
    } finally {
        connection.end();
    }
}

async function getHouseholdDevices(householdId, usernameHash, authId) {
    if (!authIds.has(usernameHash) || !authIds.get(usernameHash).has(authId))
        return [];
    let connection;
    try {
        connection = await pool.getConnection();
        let rows = await connection.query("SELECT deviceId, deviceName, deviceTypeId, status FROM Devices WHERE householdId = ?", [householdId]);
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

async function getHouseholdUsers(usernameHash, authId) {
    if (!authIds.has(usernameHash) || !authIds.get(usernameHash).has(authId))
        return [];
    let connection;
    try {
        connection = await pool.getConnection();

        let uns = await connection.query("SELECT userId, username FROM UserCredentials");
        let uid = -1;
        for (let e of uns) {
            let hashedUn = crypto.createHash("sha256").update(e.username).digest("hex");
            if (usernameHash === hashedUn) {
                uid = e.userId;
                break;
            }
        }
        if (uid === -1)
            return [];

        let rows = await connection.query(`SELECT b.householdId, c.householdName, a.username, b.userType FROM UserCredentials AS a INNER JOIN HouseholdMembers AS b ON a.userId = b.userId
                                            INNER JOIN Households AS c ON b.householdId = c.householdId
                                            WHERE b.userId = ?
                                            ORDER BY b.householdId ASC, userType DESC, username ASC;`, [uid]);
        let households = [];
        let i = 0;
        let householdsMap = new Map();
        
        for (let row of rows) {
            if (!householdsMap.has(row.householdId)) {
                householdsMap.set(row.householdId, i++);
                households.push({householdId: row.householdId, householdName: row.householdName, users: []});
            }
            households[householdsMap.get(row.householdId)].users.push({username: row.username, userType: row.userType});
        }
        
        return households;
    } catch (err) {
        console.error(err);
        return [];
    } finally {
        connection.end();
    }
}

async function getUserHouseholds(usernameHash, authId) {
    if (!authIds.has(usernameHash) || !authIds.get(usernameHash).has(authId))
        return [];

    let connection;
    try {
        connection = await pool.getConnection();

        let uns = await connection.query("SELECT userId, username FROM UserCredentials");
        let uid = -1;
        for (let e of uns) {
            let hashedUn = crypto.createHash("sha256").update(e.username).digest("hex");
            if (usernameHash === hashedUn) {
                uid = e.userId;
                break;
            }
        }
        if (uid === -1)
            return [];

        let rows = await connection.query("SELECT a.householdId, a.householdName FROM Households AS a INNER JOIN HouseholdMembers ON a.householdId = b.householdId WHERE b.userId = ?", [uid]);
        
        return rows;
    } catch (err) {
        console.error(err);
        return [];
    } finally {
        connection.end();
    }
}

async function toggleDevice(deviceId, householdId, authId, usernameHash) {
    if (!loginWithToken(authId, usernameHash))
        return [];
    let connection;
    try {
        connection = await pool.getConnection();
        let uns = await connection.query("SELECT userId, username FROM UserCredentials");
        let uid = -1;
        for (let e of uns) {
            let hashedUn = crypto.createHash("sha256").update(e.username).digest("hex");
            if (usernameHash === hashedUn) {
                uid = e.userId;
                break;
            }
        }
        if (uid === -1) {
            return [];
        }
        let rows = await connection.query("SELECT status FROM Devices WHERE deviceId = ?", [deviceId]);
        
        let res = await connection.query("UPDATE Devices SET status = ? WHERE deviceId = ? AND householdId = ? AND EXISTS (SELECT * FROM HouseholdMembers WHERE householdId = ? AND userId = ?)", [(rows[0].status === "on")? "off" : "on", deviceId, householdId, householdId, uid]);
        
        return res.affectedRows > 0;
    } catch (err) {
        console.error(err);
        return false;
    } finally {
        connection.end();
    }
}

async function createAuthToken(username, duration) {
    let hashedUn = crypto.createHash("sha256").update(username).digest("hex");
    let userAuth = crypto.randomBytes(32).toString("hex");
    while (auths.has(userAuth)) {
        userAuth = crypto.randomBytes(32).toString("hex");
    }
    if (authIds.has(hashedUn)) {
        authIds.get(hashedUn).set(userAuth, duration);
    } else {
        authIds.set(hashedUn, new Map());
        authIds.get(hashedUn).set(userAuth, duration);
    }
    auths.add(userAuth);
    return `{"userAuth": "${userAuth}", "username": "${hashedUn}"}`
}

async function getUsername(emailOrUsername) {
    emailOrUsername = emailOrUsername.toLowerCase();
    let connection;
    try {
        connection = await pool.getConnection();
        let rows = await connection.query("SELECT username FROM UserCredentials WHERE LOWER(username) = ? OR LOWER(emailAddress) = ?", [emailOrUsername, emailOrUsername]);
        return rows[0].username;
    } catch (err) {
        console.error(err);
        return "";
    } finally {
        connection.end();
    }
}

async function deleteAccount(emailOrUsername, password, usernameHash, authId) {
    if (!loginWithToken(authId, usernameHash)) {
        return false;
    }

    emailOrUsername = emailOrUsername.toLowerCase();
    let connection;
    let salt = "";
    try {
        connection = await pool.getConnection();
        let rows = await connection.query("SELECT salt, username FROM UserCredentials WHERE LOWER(username) = ? OR LOWER(emailAddress) = ?;", [emailOrUsername, emailOrUsername]);
        if (rows.length === 0) {
            return false;
        }
        if (usernameHash !== crypto.createHash("sha256").update(rows[0].username).digest("hex"))
            return false;
        salt = rows[0].salt;
        let passwordHash = crypto.createHash("sha256").update(password).update(salt).digest("hex");
        rows = await connection.query("DELETE FROM UserCredentials WHERE (LOWER(username) = ? OR LOWER(emailAddress) = ?) AND passwordHash = ?;", [emailOrUsername, emailOrUsername, passwordHash]);

        return rows.affectedRows > 0;
    } catch (err) {
        console.error(err);
        return false;
    } finally {
        connection.end();
    }
}

async function getUserHouseholds(usernameHash, authId) {
    if (!loginWithToken(authId, usernameHash)) {
        return [];
    }

    let connection;
    try {
        connection = await pool.getConnection();
        let uns = await connection.query("SELECT userId, username FROM UserCredentials");
        let uid = -1;
        for (let e of uns) {
            let hashedUn = crypto.createHash("sha256").update(e.username).digest("hex");
            if (usernameHash === hashedUn) {
                uid = e.userId;
                break;
            }
        }
        if (uid === -1) {
            return [];
        }

        let households = await connection.query("SELECT a.householdId, a.householdName, b.userType FROM Households AS a INNER JOIN HouseholdMembers AS b ON a.householdId = b.householdId AND b.userId = ?", [uid])
        return households;
    } catch (err) {
        console.error(err);
        return [];
    } finally {
        connection.end();
    }
}

async function removeUserFromHousehold(householdId, usernameHash, authId, targetUser) {
    if (!loginWithToken(authId, usernameHash)) {
        return -1;
    }

    let connection;
    try {
        connection = await pool.getConnection();
        let uns = await connection.query("SELECT userId, username FROM UserCredentials");
        
        let uid = -1;
        for (let e of uns) {
            let hashedUn = crypto.createHash("sha256").update(e.username).digest("hex");
            if (usernameHash === hashedUn) {
                if (e.username === targetUser)
                    return 0;
                uid = e.userId;
                break;
            }
        }
        if (uid === -1) {
            return -1;
        }
        targetUser = targetUser.toLowerCase();

        let rows = await connection.query("SELECT a.userType FROM HouseholdMembers AS a INNER JOIN UserCredentials AS b ON a.userId = b.userId WHERE a.householdId = ? AND b.userId = ?", [householdId, uid]);
        if (rows[0].userType !== "manager")
            return 0;

        let res = await connection.query(`DELETE FROM HouseholdMembers WHERE userId = 
                                         (SELECT b.userId FROM HouseholdMembers AS a INNER JOIN UserCredentials AS b ON a.userId = b.userId
                                          WHERE a.householdId = ? AND LOWER(b.username) = ?)`, [householdId, targetUser]);
        
        return (res.affectedRows > 0)? 1 : -1;
    } catch (err) {
        console.error(err);
        return [];
    } finally {
        connection.end();
    }
}

async function addUserToHousehold(householdId, usernameHash, authId, targetUser, userType) {
    userType = userType.toLowerCase();
    if (!loginWithToken(authId, usernameHash) || (userType !== "manager" && userType !== "member")) {
        return -1;
    }

    let connection;
    try {
        connection = await pool.getConnection();
        let uns = await connection.query("SELECT userId, username, emailAddress FROM UserCredentials");
        
        targetUser = targetUser.toLowerCase();
        let uid = -1;
        for (let e of uns) {
            let hashedUn = crypto.createHash("sha256").update(e.username).digest("hex");
            if (usernameHash === hashedUn) {
                if (e.username.toLowerCase() === targetUser || e.emailAddress.toLowerCase() === targetUser)
                    return 0;
                
                uid = e.userId;
                break;
            }
        }
        if (uid === -1) {
            return -1;
        }

        let rows = await connection.query("SELECT a.userType FROM HouseholdMembers AS a INNER JOIN UserCredentials AS b ON a.userId = b.userId WHERE a.householdId = ? AND b.userId = ?", [householdId, uid]);
        if (rows[0].userType !== "manager")
            return 0;

        let targetId = await connection.query("SELECT DISTINCT userId FROM UserCredentials WHERE LOWER(username) = ? OR LOWER(emailAddress) = ?", [targetUser, targetUser]); 

        let res = await connection.query(`INSERT INTO HouseholdMembers (householdId, userId, userType) VALUES (?, ?, ?)`, [householdId, targetId[0].userId, userType]);
        
        return (res.affectedRows > 0)? 1 : 2;
    } catch (err) {
        console.error(err);
        return [];
    } finally {
        connection.end();
    }
}

async function createHousehold(usernameHash, authId, householdName) {
    if (!loginWithToken(authId, usernameHash)) {
        return -1;
    }

    if (householdName === "") {
        return 0;
    }

    let connection;
    try {
        connection = await pool.getConnection();
        let uns = await connection.query("SELECT userId, username FROM UserCredentials");
        console.log("Here");
        
        let uid = -1;
        for (let e of uns) {
            let hashedUn = crypto.createHash("sha256").update(e.username).digest("hex");
            if (usernameHash === hashedUn) {
                uid = e.userId;
                break;
            }
        }
        if (uid === -1) {
            return -1;
        }
        
        let res1 = await connection.query("INSERT INTO Households (householdName) VALUES (?)", [householdName]);
        let res2 = await connection.query(`INSERT INTO HouseholdMembers (householdId, userId, userType) VALUES (?, ?, ?)`, [Number(res1.insertId), uid, "manager"]);

        if ((res1.affectedRows > 0) && (res2.affectedRows > 0))
            return 1;
        else 
            return 0;
    } catch (err) {
        console.error(err);
        return [];
    } finally {
        connection.end();
    }
}

async function scheduleDevice(usernameHash, authId, deviceId, onTime, offTime) {
    if (!loginWithToken(authId, usernameHash)) {
        return -1;
    }

    let connection;
    try {
        connection = await pool.getConnection();
        let uns = await connection.query("SELECT userId, username, emailAddress FROM UserCredentials");
        
        let uid = -1;
        for (let e of uns) {
            let hashedUn = crypto.createHash("sha256").update(e.username).digest("hex");
            if (usernameHash === hashedUn) {                
                uid = e.userId;
                break;
            }
        }
        if (uid === -1) {
            return -1;
        }

        if (offTime === onTime) {
            return 0;
        }

        let res = await connection.query(`UPDATE Devices SET offTime = ?, onTime = ? WHERE deviceId = ? AND EXISTS (
                                          SELECT * FROM Devices AS a INNER JOIN HouseholdMembers AS b 
                                          ON a.householdId = b.householdId WHERE deviceId = ? AND userId = ?)`, [offTime, onTime, deviceId, deviceId, uid]);

        return (res.affectedRows > 0)? 1 : 0;
    } catch (err) {
        console.error(err);
        return [];
    } finally {
        connection.end();
    }
}

async function removeSchedule(usernameHash, authId, deviceId) {
    if (!loginWithToken(authId, usernameHash)) {
        return -1;
    }

    let connection;
    try {
        connection = await pool.getConnection();
        let uns = await connection.query("SELECT userId, username, emailAddress FROM UserCredentials");
        
        let uid = -1;
        for (let e of uns) {
            let hashedUn = crypto.createHash("sha256").update(e.username).digest("hex");
            if (usernameHash === hashedUn) {                
                uid = e.userId;
                break;
            }
        }
        if (uid === -1) {
            return -1;
        }

        let res = await connection.query(`UPDATE Devices SET offTime = NULL, onTime = NULL WHERE deviceId = ? AND EXISTS (
                                          SELECT * FROM Devices AS a INNER JOIN HouseholdMembers AS b 
                                          ON a.householdId = b.householdId WHERE deviceId = ? AND userId = ?)`, [deviceId, deviceId, uid]);

        return (res.affectedRows > 0)? 1 : 0;
    } catch (err) {
        console.error(err);
        return [];
    } finally {
        connection.end();
    }
}

function loginWithToken(authId, username) {
    if (authId === undefined || username === undefined)
        return false;
    let tokens = authIds.get(username)
    if (tokens === undefined)
        return false

    return tokens.has(authId);
}