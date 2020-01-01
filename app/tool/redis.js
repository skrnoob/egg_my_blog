var redis = require("redis"),
client = redis.createClient({
    host:'132.232.254.141',
    port:6379,
    password:'123456'
});
client.on("connect",()=>{
    console.log('redis 连接成功')
})
client.on("error", function (err) {
    console.log("Error " + err);
});

function getAsync(key){
    let self =  this
    return new Promise((resolve,reject)=>{
        self.get(key,(error,reply)=>{
            if(error){
                reject(error)
            }else{
                resolve(reply)
            }
        })
    })
    
}

client.getAsync = getAsync

module.exports = client