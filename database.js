const Sequelize = require('sequelize');
const scrypt = require('scryptsy')
var exports = module.exports = {};
var db = {};

exports.connect = () => {
try {
    db = new Sequelize('animawka', 'animawka', 'debug', {
        port: 3306,
        host: 'localhost',
        dialect: 'mysql',
        pool: {
            max: 5,
            min:0,
            acquire:30000,
            idle:10000
        }
    });
    db.authenticate().then(() => {
        console.log('Connected to database "animawka"');
    });
} catch (error) {
    console.log("Connection Error");
    console.error(error);
    process.exit(1);
}
}

exports.getAnimeList = async () => {
    var result = db.query("SELECT * FROM anime");
    return result;
}

exports.userLogin = async(email, password) => {
    var u = await db.query("SELECT * FROM users WHERE email = "+db.escape(email));
    if (u[0] && u[0][0]) {
        const hash = scrypt(password.normalize('NFKC'), "animawka", 16384, 8, 1, 64).toString('hex');
        if(hash === u[0][0].password){
            const user = {
                id:u[0][0].ID,
                username:u[0][0].login,
                email:u[0][0].email,
                token:u[0][0].token
            };
            return user;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

exports.userRegister = async(username, email, password) => {
    var u = await db.query("SELECT * FROM users WHERE email = "+db.escape(email)+" AND login = "+db.escape(username));
    if (u[0] && u[0][0]) {
        return false;
    } else {
        const hash = scrypt(password.normalize('NFKC'), "animawka", 16384, 8, 1, 64).toString('hex');
        var u = await db.query("INSERT INTO users (login, email, password, rank, avatar, token) VALUES"
        + "( "+db.escape(username)
        + ", "+db.escape(email)
        + ", "+db.escape(hash)
        + ", "+db.escape("1")
        + ", "+db.escape("https://vignette2.wikia.nocookie.net/konosuba/images/6/69/6ItDIsj.png/revision/latest?cb=20160210105329")
        + ", "+db.escape("tokenXD")
        + ")"
        );
        return true;

    }
}