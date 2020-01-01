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
    return User;
}