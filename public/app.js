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

var showBackground = function() {
  $(document.body).removeClass('hide-background');
  $('#background').show()
}

var hideBackground = function() {
  $(document.body).addClass('hide-background');
  $('#background').hide()
}

var navigateTo = function(topic) {
  var isHome = function() { return topic == '/' }

  if (!isHome()) {
    hideBackground();
  } else {
    showBackground();
  }

  actualTopic = topic.replace(/^\//, '++')

  $('.topic').hide();
  var jtopic = $('a[name=' + actualTopic + ']').parent();
  jtopic.show();

  $('#navigation a').removeAttr('id');
  $('#navigation a[href=#' + topic + ']').attr('id', 'active');
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

var renderBlogPost = function(post) {
  post_div = $('#blog_post_template li').clone();
  post_div.find('a.rss_item').html(post.title);
  post_div.find('a.rss_item').attr('title', post.title);
  post_div.find('a.rss_item').attr('href', post.link);
  post_div.find('div').html(post.description.stripHTML().substring(0, 200) + '...');
  
  registerIslandEvents(post_div);
  return post_div;
}

var generatePhotoFeed = function() {
  $(document).ready(function() {
    $('#home-photos .rss-box').replaceWith($('#home-photos .rss-item p a img').parent().addClass('flickr'));
    $('#home-photos img').removeAttr('width').removeAttr('height');
    $('#home-photos img').each(function() {
      $(this).attr('src',
        $(this).attr('src').split('m.jpg')[0] + 's.jpg') 
      $(this).parent().attr('rel', 'flickr-latest');
    });
    $("a[rel='flickr-latest']").colorbox({width:"80%", height:"80%", iframe:true});
  });
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
    //$('#navigation a').corner('round 5px');
    //$('.section').not('#most-recent-post, #home-writing').corner('round tl bl 10px');
    //$('#most-recent-post').corner('round tl 10px')
    //$('#home-writing').corner('round bl 10px')
    //$('#most-recent-post .rss_item a, #home-writing .rss_item a').corner('round 5px');
  });
}

var registerIslandEvents = function(item) {
  item.hover(islandMouseIn, islandMouseOut).click(islandClick);
}

$(document).ready(function() {
  $('.topic').hide();

  // copy all the anchors to the top of the page ...
  anchors = $('a[name^=/]');
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

var title = document.title;

$.address.change(function (event) {
  navigateTo(event.path);
  
  var names = $.map(event.pathNames, function(n) {
                return n.substr(0, 1).toUpperCase() + n.substr(1);
              }).concat(event.parameters.id ? event.parameters.id.split('.') : []);

  
  $.address.title([title].concat(names).join(' > '));

});
