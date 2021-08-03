'use strict'

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

require('dotenv').config();
const PORT = process.env.PORT;

// mongoose.connect('mongodb://localhost:27017/colors',{ useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });

// http://localhost:3001/
app.get('/', (req, res) => {
    res.status(200).send('hallo razan');
})

app.listen(PORT, () => {
    console.log(`listeng to the ${PORT}`);
});

class Colors {
    constructor(item) {
        this.name = item.title;
        this.img = item.imageUrl;
    }
}

const ProductSchema = new mongoose.Schema({
    name: String,
    img: String
});

const userModel = new mongoose.Schema({
    email: String,
    data: [ProductSchema]
});

const favModel = mongoose.model('user', userModel);

function seedUser() {
    let razan = new favModel({
        // let saleem = new favModel({
        email: 'quraanrazan282@gmail.com',
        // email: 'saleem_diab86@yahoo.com',
        data: [
            {
                name: "Black",
                img: "http://www.colourlovers.com/img/000000/100/100/Black.png"
            },
            {
                name: "dutch teal",
                img: "http://www.colourlovers.com/img/1693A5/100/100/dutch_teal.png"
            },
            {
                name: "heart of gold",
                img: "http://www.colourlovers.com/img/FBB829/100/100/heart_of_gold.png"
            }
        ]
    })
    // saleem.save();
    razan.save();
}
// seedUser();

// https://ltuc-asac-api.herokuapp.com/allColorData
// http://localhost:3001/api
app.get('/api', getApiData);
// http://localhost:3001/fav?email=saleem_diab86@yahoo.com
app.get('/fav', getfavData);
// http://localhost:3001/fav?email=saleem_diab86@yahoo.com
app.post('/fav', addfavData);
// http://localhost:3001/fav/:id?email=saleem_diab86@yahoo.com
app.delete('/fav/:id', deletefavData);
// http://localhost:3001/fav/:id?email=saleem_diab86@yahoo.com
app.put('/fav/:id', updatefavData);

async function getApiData(req, res) {
    const url = 'https://ltuc-asac-api.herokuapp.com/allColorData'
    const apiData = await axios.get(url);
    // console.log(apiData);
    const allData = apiData.data.map(item => {
        return new Colors(item);
    })
    res.send(allData)
}

function getfavData(req, res) {
    const email = req.query.email;
    favModel.findOne({ email: email }, (error, user) => {
        res.send(user);
    })
}

function addfavData(req, res) {
    const { email, name, img } = req.body;
    favModel.findOne({ email: email }, (error, user) => {
        const newFav = {
            name: name,
            img: img
        }
        user.data.push(newFav);
        user.save();
        res.send(user.data);
    })
}

function deletefavData(req, res) {
    const email = req.query.email;
    const index = Number(req.params.id);
    favModel.findOne({ email: email }, (error, user) => {
        user.data.splice(index, 1);
        user.save();
        res.send(user.data);
    })
}

function updatefavData(req, res) {
    const { email, name, img } = req.body;
    const index = Number(req.params.id);
    favModel.findOne({ email: email }, (error, user) => {
        const newFav = {
            name: name,
            img: img
        }
        user.data.splice(index, 1, newFav);
        user.save();
        res.send(user.data);
    })
}