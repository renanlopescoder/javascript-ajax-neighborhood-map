
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetString = $('#street').val();
    var cityString = $('#city').val();
    var streetViewAddress = streetString + ', '+cityString;

    $greeting.text('you want to live at ' + streetViewAddress + ' ?');

    // Google Maps API

    var streetViewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location='
     + streetViewAddress;
    
    $body.append('<img class="bgimg" src="' + streetViewUrl + '">');

    // New York Times API

    var nytimesUrl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q="
     + cityString + "&sort=newest&api-key=5093abc88ed5407caa1c1a2bad0a816d";
     
    $.getJSON(nytimesUrl, function(data){
        $nytHeaderElem.text("New York Times Articles About " + cityString);
        articles = data.response.docs;
        for(var i = 0; i < articles.length; i++){
            var article = articles[i];
            $nytElem.append('<li class="article">'+
            '<a href="'+ article.web_url+'">'+article.headline.main+'</a><p>'+article.snippet+'</p>'+'</li>');
        };
    }).error(function(error){
        $nytHeaderElem.text("New York Times Articles Could Not Be Loaded");
    });

    // Wikipedia API

    var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search="+ cityString + "&format=json&callback=wikiCallback";

    $.ajax({
        url : wikiUrl,
        dataType : "jsonp",
        success: function ( response ){
            var articleList = response[1];
            for(var i = 0; i < articleList.length; i++){
                articleStr = articleList[i];
                var url = "http://en.wikipedia.org/wiki/"+articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr +'</a></li>');
            }
        }
    });

    return false;
};

$('#form-container').submit(loadData);
