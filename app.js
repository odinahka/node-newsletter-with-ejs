const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const mailChimp = require('@mailchimp/mailchimp_marketing');


const app = express();

mailChimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER
})

const runChimpAsync = async (listId, subscriber) =>{
return await mailChimp.lists.addListMember(listId, subscriber);
}

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get('/', (req, res) => {
   
    res.sendFile(`${__dirname}/signup.html`);

});

app.post('/', async (req, res) => {
const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email };
    const listId ='2f0b09d14b';
    const subscriber = {
        email_address: user.email,
        status: 'subscribed',
        merge_fields: {
            LNAME: user.lastName,
            FNAME: user.firstName
        }
    };
const response = await runChimpAsync(listId, subscriber);
console.log(response);
//console.log(user);
if(!response) res.write("<h1>Failed to submit</h1>");
else {
    res.write("<h1>Submitted!</h1>");
    res.write(`<p>Successfully added contact as an audience member. The member's Id is ${response.id}</p>`);
}
res.send();
});



app.listen(3000, () => {
    console.log("Listening on port 3000");
});

//0bc413ad498fd65c9895c81cc2aaef4b-us9
//2f0b09d14b