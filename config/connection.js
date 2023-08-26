const { connect, connection } = require('mongoose');

connect('mongodb+srv://root:root@cluster0.tdwf9ga.mongodb.net/socialNetworkDB');

module.exports = connection;
