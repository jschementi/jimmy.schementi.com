require 'net/http'
require 'uri'

require 'rubygems'
require 'sinatra'
require 'json'

get '/' do
  erb :index
end

def get_feed(url)
  url = URI.parse(url)
  res = Net::HTTP.start(url.host, url.port) { |http|
    http.get(url.path)
  }
  content_type 'application/xml', :charset => 'utf-8'
  res.body
end

get '/blog.rss' do
  get_feed 'http://feeds.feedburner.com/jimmy-thinking'
end

get '/twitter.rss' do
  get_feed 'http://twitter.com/statuses/user_timeline/8007442.rss'
end