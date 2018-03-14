const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const sql = new Sequelize('trello', 'root', '!Mysql99', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acuire: 30000,
        idle: 10000
    }
});

sql
    .authenticate()
    .then(() => {
        console.log("The connection was successful!");
    })
    .catch(err => {
        console.log("There was an error when connecting!");
    });

var User = sql.define('user', {
    userid: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true},
    username: {type: Sequelize.STRING},
    firstname: {type: Sequelize.STRING},
    lastname: {type: Sequelize.STRING}
});

// //force drops a table if it exists, then recreates the table (OK IN DEV ONLY)
// User.sync({force: true}).then(() => {
//     console.log("Users table was created successfully!");
// }).then(() => {
//     //create the first user
//     User.create({
//         userid: 1,
//         username: 'asiemer',
//         firstname: 'Andrew',
//         lastname: 'Siemer'
//     });

//     User.create({
//         userid: 2,
//         username: 'kjackson',
//         firstname: 'Ken',
//         lastname: 'Jackson'
//     });

//     User.create({
//         userid: 3,
//         username: 'mgonzalez',
//         firstname: 'Miguel',
//         lastname: 'Gonzalez'
//     });
// });


//get all users
User.findAll()
.then(users => {
    printUsers(users);
});

//get all users but only return userid and username
User.findAll({ 
    attributes: ['userid', 'username'] 
})
.then(users => {
    printUsers(users);
});

//get User with userid of 3
User.findAll({
    where: {
        userId: 3
    }
})
.then(users => {
    printUsers(users);
});

//get User with userid of 1 or 3
User.findAll({
    where: {
        userId: {
            [Op.or]: [1, 3]
        }
    }
})
.then(users => {
    printUsers(users);
});

function printUsers(users) {
    for(let i = 0;i<users.length;i++) {
        console.log(users[i].dataValues.username);
    }
}

//create an instance of a user object
let id = 4;
var user = User.build({userid: id, username: "another usr", firstname: "bob", lastname: "smith"});

//save this user to the database
user.save().then(() => {
    User.findOne({where: {userid: id}}).then(usr => {
        //update the incorrect spelling
        usr.update({username: "another user"});
    });
}).then(() => {
    User.findOne({where: {userid: id}}).then(usr => {
        usr.destroy();
    });
});

// //if paranoid option is on, deletedAt will be set
// user.destroy({force:true}); //can override this setting