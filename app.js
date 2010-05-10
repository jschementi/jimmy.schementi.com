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
  if (topic != '/') {
    hideBackground();
  } else {
    showBackground();
  }

  $('.topic').hide();
  $('a[name=' + topic + ']').parent().show();

  $('#navigation a').removeAttr('id');
  $('#navigation a[href=' + topic + ']').attr('id', 'active');

  //window.location.hash = topic;
  //document.getElementsByName('very-top')[0].scrollIntoView(true);
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
  address = link.attr('rel').split('address:')
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
    $('.rss_box li').removeAttr('style');
    $('a.rss_item').removeAttr('target');
    $('#home-writing .rss_box li:first-child').hide();
    $('.rss_item p').hide();
  });
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
      var jData = $($(data)[9])
      $('.section', jData).attr('class', 'resume_section')
      $('#resume_contents').html(jData)
    });
  });
}

var roundTheWorld = function() {
  $(document).ready(function() {
    $('.area, .island, li.rss_item').corner('round tr br 10px');
    //$('#navigation a').corner('round 5px');
    //$('.section').not('#most-recent-post, #home-writing').corner('round tl bl 10px');
    //$('#most-recent-post').corner('round tl 10px')
    //$('#home-writing').corner('round bl 10px')
    //$('#most-recent-post .rss_item a, #home-writing .rss_item a').corner('round 5px');
  });
}

$(document).ready(function() {
  $('.topic').hide();
  
  if (location.hash.length == 0) {
    navigateTo('/');
  } else {
    navigateTo(location.hash)
  }
  
  //$('#navigation a').click(function() {
  //  navigateTo($(this).attr('href'));
  //  return false;
  //});
  
  $('.project.island a').click(function() {
    navigateTo($(this).attr('href'));
    return false;
  });

  $('.island, li.rss_item').hover(islandMouseIn, islandMouseOut).click(islandClick);

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

$.address.change(function (event) {
  navigateTo(event.path);
});
