const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.post("/",function(req,res){
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members:[
            {
                email_address: email,
                status:"pending",
                merge_fields:{
                    FNAME:fName,
                    LNAME:lName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us11.api.mailchimp.com/3.0/lists/AudienceID";
    const options = {
        method:"POST",
        auth:"yuan:apiKey"
    }
    const request = https.request(url,options,function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
    

})


app.listen(port,function(){
    console.log("listening to port...");
});

// module.exports = app;