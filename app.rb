require 'net/http'
require 'uri'

require 'rubygems'
require 'sinatra'
require 'json'

get '/' do
  File.open('public/index.html'){ |f| f.read }
end

get '/blog.rss' do
  content_type 'application/xml', :charset => 'utf-8'
  res = Net::HTTP.start("feeds.feedburner.com", 80) { |http|
    http.get('/jimmy-thinking')
  }
  res.body
end