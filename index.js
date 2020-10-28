const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://nithin:9481543420@cluster0.nnsbb.mongodb.net/telegram?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var unirest = require('unirest');
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 8080
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
    .then(() => {
    console.log('Connected')
}).catch(err => console.log(err))
app.use(bodyParser.json())
const userSchema = new mongoose.Schema({ userid: 'string', username: 'string', name: 'string', msg: 'string' });
const userModel = mongoose.model('users', userSchema);


app.get('/message/:msg', (req, res) => {
    userModel.find({}, function(err, doc){ 
        res.setHeader("Content-Type","applicaton/json");
        var obj2 = JSON.parse(JSON.stringify(doc));
        var obj = {}
        for(result in obj2){
            if(obj2[result].msg == req.params.msg){
                obj[result]=obj2[result]
            }
        }
        res.json(obj);
    });
})

app.post('/telegram/input', (req, res) => {
    res.setHeader("Content-Type","applicaton/json");
    var obj2 = JSON.parse(JSON.stringify(req.body));
    var obj = {}
    obj["userid"]=obj2.message.from.id;
    obj["username"]=obj2.message.from.username;
    obj["name"]=obj2.message.from.first_name;
    obj["msg"]=obj2.message.text;
    textToBeSent = `Hello ${obj["name"]} your chat ID is ${obj["userid"]}`;
    var req = unirest('POST', 'https://api.telegram.org/bot1182538041:AAFmHxj-xzKhXW4x21fNINs7hIuVHG3uVvs/sendMessage')
    .field('chat_id', obj["userid"])
    .field('text', textToBeSent)
    .end(function (res) { 
        if (res.error) throw new Error(res.error); 
        console.log(res.raw_body);
    });

    userModel.create(obj, function (err, objectInserted) {
        if (err) return handleError(err);
        res.json(obj)
    });
})

app.listen(port, () => console.log(`Example app listening on port port!`))