'use strict';

//import some libraries
const express = require('express');
const data = require("./Movie Data/data.json");
const { default: axios } = require('axios');
require('dotenv').config();
const apiKey = process.env.API_KEY;
const server = express();
const PORT = 3000;

//Routes
server.get('/', HandleHomePage );
server.get('/favorite', handleFavorite );   
server.get('/trending', handleTrending ); 
server.get('/search', handleSearchMovie );  
server.get('/idsearch', handleSearchById ); 
server.get('/latest', handleLatest );
server.get('*', HandlePageNotFound)

// Functions
function HandleHomePage(req, res) {
    if (req.query.error === 'true') {
        res.status(500).send({
            "status": 500,
            "responseText": "Sorry, something went wrong"
        });
    } else {
        let newMovie = new Movie(data.title, data.poster_path, data.overview);
        res.status(200).json(newMovie);
    }
}
 
function handleFavorite(req,res) {
    let str = "Welcome to Favorite Page";
    if (req.query.error === 'true') {
        res.status(500).send({
            "status": 500,
            "responseText": "Sorry, something went wrong"
        });
    } else {
        res.status(200).send(str);
    }
}

function handleTrending(req, res) {
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`
    axios.get(url)
    .then(result => {
        // console.log(result);
        let movies = result.data.results.map(movie => {
            return new MovieAPI(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview)
        })
        res.json(movies)
    })
    .catch(error => {
        // handle error
        console.log(error);
        })
}

function handleSearchMovie(req, res) {
    let movieName = req.query.name;
    let url = `https://api.themoviedb.org/3/search/movie?query=${movieName}&api_key=${apiKey}`
    axios.get(url)
    .then(result => {
        // console.log(result);
        let movies = result.data.results.map(movie => {
            return new MovieAPI(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview)
        })
        res.json(movies)
    })
    .catch(error => {
        // handle error
        console.log(error);
        })
}

function handleSearchById(req, res) {
    let idName = req.query.id;
    //?language=en-US
    let url = `https://api.themoviedb.org/3/person/${idName}?api_key=${apiKey}`;
    axios.get(url)
    .then(result => {
        // console.log(result);
        console.log(result);
        // let movies = result.data.results.map(movie => {
        //     return 
        // })
        res.json(result.data)
        // res.json(result.data)
    })
    .catch(error => {
        // handle error
        console.log(error);
        })
}

function handleLatest(req, res) {
    //?language=en-US
    let url = `https://api.themoviedb.org/3/person/latest?api_key=${apiKey}`;
    axios.get(url)
    .then(result => {
        console.log(result.data);
       
        res.json(result.data)
    })
    .catch(error => {
        // handle error
        console.log(error);
        })
}

function HandlePageNotFound(req,res) {
    res.status(404).send("page not found error");
}


server.listen(PORT, () =>{
    console.log(`listening on ${PORT} : I am ready`);
})


// Constructors
function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function MovieAPI(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}
