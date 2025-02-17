const http = require("http");
const mariadb = require("mariadb");
const crypto = require("crypto");

const pool = mariadb.createPool({
    host: "database-1.cj4yamaa8tq2.eu-west-2.rds.amazonaws.com",
    port: 3306,
    database: "Protohome",
    user: "admin",
    password: "4ISm53ets9FZMLgelYS5"
});

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
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
            if (reqBody.action === "login") {
                let successfulLogin = login(reqBody.username, reqBody.password);
                if (successfulLogin) {
                    res.writeHead(200);
                } else {
                    res.writeHead(401);
                }
                res.end();
            } else if (reqBody.action === "register") {
                let successfulRegistration = createAccount(reqBody.username, reqBody.password);
                if (successfulRegistration) {
                    res.writeHead(200);
                } else {
                    res.writeHead(409);
                }
                res.end();
            }
        });

    }
});
server.listen(80);

async function createAccount(un, pw) {
    let connection;
    try {
        connection = await pool.getConnection();
        let rows = await connection.query("SELECT true FROM UserCredentials WHERE username = ?;", [un])
        if (rows.length !== 0) {
            console.log("Account already exists");
            return false;
        }

        let salt = crypto.randomBytes(8).toString("hex");
        let pwhash = crypto.createHash("sha256").update(pw).update(salt).digest("hex");
        await connection.query("INSERT INTO UserCredentials (username, passwordHash, salt) VALUES (?, ?, ?);", [un, pwhash, salt]);
        return true;
    } catch(err) {
        console.error(err);
    } finally {
        connection.end();
    }
}

async function login(un, pw) {
    let connection;
    let salt = "";
    try {
        connection = await pool.getConnection();
        let rows = await connection.query("SELECT salt FROM UserCredentials WHERE username = ?;", [un]);
        if (rows.length === 0) {
            console.log("User does not exist!");
            return false;
        } else {
            salt = rows[0].salt;
        }
        let pwhash = crypto.createHash("sha256").update(pw).update(salt).digest("hex");
        rows = await connection.query("SELECT true FROM UserCredentials WHERE username = ? AND passwordHash = ?;", [un, pwhash])
                
        if (rows.length === 0) {
            console.log("INVALID USER!");
            return false;
        } else {
            console.log("VALID USER!");
            return true;
        }
    } catch (err) {
        console.error(err);
    } finally {
        connection.end();
    }
}