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

get '/blog' do
  redirect 'http://blog.jimmy.schementi.com'
end

get '/blog.rss' do
  get_feed 'http://feeds.feedburner.com/jimmy-thinking'
end

get '/twitter.rss' do
  get_feed 'http://twitter.com/statuses/user_timeline/8007442.rss'
end

%W{/projects /writing /music /photos /about /art /about/resume}.each do |i|
  get i do
    redirect "/##{i}"
  end
end
  
get /\/(.+)/ do |c|
  path = File.join(File.dirname(__FILE__), 'public', c)
  if File.exist? path
    url = "/#{c}"
    url = url[0..-2] if url[-1] == '/'
    if File.directory? path
      indexhtml = File.join(path, "index.html")
      indexphp = File.join(path, "index.php")
      if File.exist?(indexhtml)
        url = "#{url}/"
      elsif File.exist?(indexphp)
        url = "#{url}/index.php"
      else
        throw :halt, [404, "Not found"]
      end
    end
    redirect url
  else
    throw :halt, [404, "Not found"]
  end
end

