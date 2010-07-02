require 'net/http'
require 'uri'

require 'rubygems'
require 'sinatra'
require 'json'

get '/' do
  File.open('public/index.html'){|f| f.read}
end

get '/blog.rss' do
  content_type 'application/xml', :charset => 'utf-8'
  url = URI.parse('http://feeds.feedburner.com/jimmy-thinking')
  res = Net::HTTP.start(url.host, url.port) {|http|
    http.get('/jimmy-thinking')
  }
  res.body
end

get '/flickr.rss' do

end