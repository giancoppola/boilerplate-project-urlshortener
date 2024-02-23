require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let count = 1;
app.route('/api/shorturl')
  .post((req, res) => {
    const protocol_regex = /^\D{3,5}:\/\//;
    let url = req.body.url ? req.body.url : null;
    console.log(url)
    if (protocol_regex.test(url)){
      SetNewRoute(url, count.toString());
        res.json({
          original_url : url,
          short_url : count.toString()
        })
        count++;
        next();
    }
    else{
      res.json({ error: "invalid url"})
      next();
    }
  })

function SetNewRoute(original, short){
  app.get(`/api/shorturl/${short}`, (req, res) => {
    res.redirect(original);
  })
}

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
