var express = require('express');
const { render } = require('express/lib/response');
var router = express.Router();

const fetch = require('node-fetch');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res) {
  res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&redirect_uri=${process.env.SPOTIFY_REDIRECT_URI}&show_dialog=true`)
})

router.get('/logged', async function(req, res) {

  let body = {
    grant_type: "authorization_code",
    code: req.query.code,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET
  }

  await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: Object.keys(body).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(body[key])).join('&')
  })
  .then(resp => resp.json())
  .then(data => {
    res.redirect(`http://${process.env.SPOTIFY_DOMAINE_REDIRECT}/?code=${data.access_token}`)
  })

})


module.exports = router;
