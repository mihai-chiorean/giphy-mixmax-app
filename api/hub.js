var github = require('octonode'),
  URL = require('url'),
  debug = require('debug')('hub-resolver');

  // TODO setup a github token and figure out settings
  // or source credentials from system's git settings
  // details here: https://github.com/pksunkara/octonode
var client = github.client({
  username: '<your username here>',
  password: '<github password here>'
});

module.exports = function(req, res, next) {
  var prUrl = URL.parse(req.query.url);
  debug(prUrl.path);
  var prParams = prUrl.path.split('/');
  var prData = {
    org: prParams[1],
    repo: prParams[2],
    id: parseInt(prParams[4])
  }

  var pr = client.pr(prData.org + '/' + prData.repo, prData.id);
  pr.info(function(err, data) {
    if(err) {
      console.error(err);
      var originalUrl = URL.format(prUrl);
      return res.status(200)
        .send({body: '<a href=' + originalUrl + '>' + originalUrl + '</a>'});
    }
    var color = 'green';
    switch(data.state) {
        case 'open': color = 'green'; break;
        case 'merged': color = 'purple'; break;
        default: color = 'black';
    }

    var state = '<span style="color:' + color + '">' + data.state.toUpperCase() + '</span>'
    var link = '<a href="' + data.html_url + '">'+ data.title + '</a>';
    var html = '<p style="border: 1px black solid;">' + state + '<br/>' + link + '<br/></p>'
    res.status(200)
      .send({body: html});
  });
}
