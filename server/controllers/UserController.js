const users = require('../users.json');

class UserController {
    static getAllUsers(req, res) {
        const { query } = req.query;
        if(query){
            // Filter users by query (name, username, or email)
            const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
            )
            res.json(filteredUsers)// Return filtered users
        }else{
            res.json(users)
        }
    }
}

module.exports = UserController