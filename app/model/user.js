module.exports = app => {
    const { STRING,INTEGER } = app.Sequelize;
    const User = app.model.define('user',{
        id:{type:INTEGER,primaryKey:true,autoIncrement:true},
        username:STRING,
        password:STRING,
        email:STRING
    },{timestamps: false})

    User.findUser = async function(username,id){
        console.log('in findUser')
        let result = await this.findOne({
            where:app.Sequelize.and({username},{id})
        })
        console.log('result',result)
        return result
    }

    User.findSameName = async function(username){
        return await this.findOne({
            where:{username}
        })
    }

    User.findSameEmail = async function(email){
        return await this.findOne({
            where:{email}
        })
    }

    User.createUser = async function(info){
        const { username,email,password } = info
        return await this.create({ username,email,password })
    }

    User.login = async function(info){
        const { username, password } = info
        return await this.findOne({
            where:{username,password}
        })
    }

    return User;
}