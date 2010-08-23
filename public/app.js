//$(document).ready(function () {
//  $(".example8").colorbox({width:"50%", inline:true, href:"#inline_example1"});
//});

//$(function() {
//  $('#gallery a').lightBox({fixedNavigation:true});
//});

//$(function() {
//  $('ul.idTabs').idTabs('overview');
//});

// from http://www.geekpedia.com/code20_Strip-HTML-using-JavaScript.html
String.prototype.stripHTML = function() {
  return this.replace(/<(?:.|\s)*?>/g, "");
};

// from http://stackoverflow.com/questions/901115/get-querystring-with-jquery
var getParameterByName = function (name) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

// from http://stackoverflow.com/questions/18912/how-to-find-keys-of-a-hash
var keys = function(obj) {
  var k = [];
  for(i in obj) {
    if (obj.hasOwnProperty(i)) {
      k.push(i);
    }
  }
  return k;
}

// from http://stackoverflow.com/questions/944436/escaping-text-with-jquery-append
var escapeHTML = function(str) {
  return $(document.createTextNode($('<div/>').html(str).html())).text();
}

var showBackground = function() {
  $(document.body).removeClass('hide-background');
  $('#background').show()
}

var hideBackground = function() {
  $(document.body).addClass('hide-background');
  $('#background').hide()
}

var title = document.title;

// TODO: really should be named "redirects"
var routes = {
  '/home': '/',
  '/resume': '/about/resume',
  // HACK: redirecting these URLs to the main /projects page causes the
  // project-specific anchors to take effect.
  '/projects/ironruby': '/projects',
  '/projects/sourceaid': '/projects',
  '/projects/assistment': '/projects'
}

var navigateTo = function(navevent) {
  var topic = navevent.path;

  if (routes[topic] != null) {
    topic = routes[topic];
  }

  var isHome = function() { return topic == '/' }

  if (!isHome()) {
    hideBackground();
    $("#twitter-status").hide();
  } else {
    showBackground();
    $("#twitter-status").show();
  }

  actualTopic = topic.replace(/^\//, '++')

  $('.topic').hide();
  topicElement = $('a[name=' + actualTopic + ']');
  var jtopic = topicElement.parent();
  jtopic.show();

  toplevel_topic = isHome() ? '/' : ('/' + topic.split('/')[1])

  $('#navigation a').removeAttr('id');
  $('#navigation a[href=#' + toplevel_topic + ']').attr('id', 'active');

  if (topicElement.attr('title') == '') {
    var names = $.map(navevent.pathNames, function(n) {
                  return n.substr(0, 1).toUpperCase() + n.substr(1);
                }).concat(navevent.parameters.id ? navevent.parameters.id.split('.') : []);
    $.address.title([title].concat(names).join(' > '));
  } else {
    $.address.title(topicElement.attr('title'));
  }
}

var islandMouseIn = function () {
  $(this).addClass('islandMouseOver');
  $('p', this).addClass('islandMouseOver');
}

var islandMouseOut = function () {
  $(this).removeClass('islandMouseOver');
  $('p', this).removeClass('islandMouseOver');
}

var islandClick = function () {
  link = $('h3 a', $(this))
  if (link.length == 0) {
    link = $('a.rss_item', $(this))
  }
  address = link.attr('rel').split('address:/')
  if (address.length > 0 && address[1] == link.attr('href')) {
    $.address.value(link.attr('href'));
  } else {
    window.location.href = link.attr('href');
  }
};

var setBackground = function (type) {
  if (type.length > 0) {
    $('#background .image').attr('src', 'images/home-me/' + type + '1.jpg');
    if (type == 'sanfran') {
      $('#background .image').css({
        'width': '1000px',
        'margin-top': '30px',
        'margin-left': '90px'
      });
    }
    $('#background .image').show();
  } else {
    $('#background .image').attr('src', 'images/clear.png');
    $('#background .image').css({
      'background-image': 'url(images/home-me/sanfran1.jpg)',
      'margin-top': '127px',
      'margin-left': '36px',
      'width': '479px',
      'height': '530px',
      'background-position': '-210px -135px'
    });
    $('#background .image').show();
  }
}

var enableColorbox = function(obj) {
  $(document).ready(function() {
    obj.colorbox({width:"80%", height:"80%", iframe:true});
  });
}

var generateBlogFeed = function() {
  $(document).ready(function() {
    jQuery.getFeed({
      url: '/blog.rss', 
      success: function(feed) {
        $('#most-recent-post .rss_box .rss_items').append(renderBlogPost(feed.items[0]));
        for(i = 1; i < 4; i++) {
          $('#home-writing .rss_box .rss_items').append(renderBlogPost(feed.items[i]));
        }
      }
    });
  });
}

var noAtMsgs = true;

var generateTwitterMsg = function() {
  $(document).ready(function() {
    jQuery.getFeed({ url: '/twitter.rss', success: function(feed) {
      $.each(feed.items, function(i) {
        var item = feed.items[i];
        msg = item.title.split("jschementi: ")[1];
        if (!noAtMsgs || msg[0] != "@") {
          link = $('<a/>').
            attr('href', 'http://twitter.com/jschementi').
            attr('target', "_blank").
            attr('title', 'follow jschementi on Twitter').
            html("follow me on Twitter &raquo;");
          $('#twitter-status').append("&ldquo;");
          $('#twitter-status').append(msg);
          $('#twitter-status').append("&rdquo;&nbsp;");
          $('#twitter-status').append(link);
          return false;
        }
      });
    }});
  });
}

var renderBlogPost = function(post) {
  post_div = $('#blog_post_template li').clone();
  post_div.find('a.rss_item').html(post.title);
  post_div.find('a.rss_item').attr('title', post.title);
  post_div.find('a.rss_item').attr('href', post.link);
  post_div.find('div').html(post.description.stripHTML().substring(0, 200) + '...');
  
  registerIslandEvents(post_div);
  return post_div;
}

var FLICKR_API = 'http://api.flickr.com/services/rest/?method=';
var FLICKR_API_KEY = '1486775479faf0d20ae61c3cc1a137a8';
var flickr_api = function(method, opts) {
  opts['api_key'] = FLICKR_API_KEY;
  opts['format'] = 'json';
  retval = FLICKR_API + method + $.map(keys(opts), function(i) {
    return "&" + i + '=' + opts[i];
  }).join('');
  return retval;
}

var generateHomepagePhotoFeed = function(rsp) {
  $.getJSON(
    flickr_api('flickr.people.getPublicPhotos', {user_id: '24458122%40N00', jsoncallback: '?'}),
    function(rsp) {
      if (rsp.stat != "ok") {
        return;
      }
      $(document).ready(function() {
        $.each(rsp.photos.photo, function(i) {
          if (i >= 25) {
            return false;
          }
          var p = rsp.photos.photo[i];
          thumbnail = "http://farm" + p.farm + ".static.flickr.com/" + p.server + "/" + p.id + "_" + p.secret + "_s.jpg";
          var page = page = "http://www.flickr.com/photos/jschementi/"+ p.id;
          medium = "http://farm" + p.farm + ".static.flickr.com/" + p.server + "/" + p.id + "_" + p.secret + "_b.jpg";
          fpl = $(document.createElement('a')).
            attr('href', page).attr('target', '_blank').html(p.title);
          a = $(document.createElement('a')).addClass('flickr').attr({
            'href': medium,
            'rel': 'flickr-latest',
            'title': escapeHTML(fpl),
          });
          img = $(document.createElement('img')).attr({
            'src': thumbnail,
            'alt': p.title
          });
          a.html(img);
          $('#home-photos').append(a);
        });
        $("a[rel='flickr-latest']").lightBox({fixedNavigation:true});
      });
    }
  );  
}

var renderResume = function() {
  $(document).ready(function() {
    $.get('jimmy_schementi.html', function(data, status) {
      for (i = 0; i < $(data).length; i++) {
        entry = $(data)[i];
        if (entry.tagName == 'DIV' && entry.className == 'document') {
          jData = $(entry);
          $('.section', jData).attr('class', 'resume_section');
          $('#resume_contents').html(jData);
          return;
        }
      }
    });
  });
}

var roundTheWorld = function() {
  $(document).ready(function() {
    $('.area, .island').corner('round tr br 10px');
    $('#navigation a').corner('round 5px');
    $('.section').not('#most-recent-post, #home-writing').corner('round tl bl 10px');
    $('#most-recent-post').corner('round tl 10px')
    $('#home-writing').corner('round bl 10px')
    $('#most-recent-post .rss_item a, #home-writing .rss_item a').corner('round 5px');
  });
}

var registerIslandEvents = function(item) {
  item.hover(islandMouseIn, islandMouseOut).click(islandClick);
}

$(document).ready(function() {
  $('.topic').hide();

  // copy all anchors that don't have the "omit" class to the top of the page ...
  anchors = $('a[name^=/][class!=omit]');
  anchors.clone().prependTo('body');

  // and then rename the anchors ...
  anchors.each(function() {
    $(this).attr('name', $(this).attr('name').replace(/^\//, '++'));
  });
  
  $.address.value(location.hash.length == 0 ? '/' : location.hash.replace(/^#/, ''));  
  
  registerIslandEvents($('.island, li.rss_item'))

  if (document.body.id.length == 0) {
    document.body.id = getParameterByName('t');
  }
  if (document.body.id.length == 0) {
    opts = ['sanfran', 'formal', 'guitar']
    index = Math.floor(Math.random() * opts.length)
    document.body.id = opts[index]
  }
  setBackground(document.body.id);
})

$.address.change(navigateTo);
