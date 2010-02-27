#paths
FIXYOURSTREET_ROOT = File.join(File.expand_path(File.dirname(__FILE__)), '.') unless defined?(FIXYOURSTREET_ROOT)
FIXYOURSTREET_CONFIG_FILE = File.join(FIXYOURSTREET_ROOT, 'config.yml')
FIXYOURSTREET_PATH_IMAGES = File.join(FIXYOURSTREET_ROOT,'img')

require 'rubygems'
require 'sinatra'
require 'haml'
require 'sass'
require 'sequel'
require 'geokit'
require 'sinatra/r18n'
require 'yaml'

#require 'couchrest'
 
### Models and configure
configure do
  Sequel::Model.plugin(:schema)
  Sequel.sqlite(File.join(FIXYOURSTREET_ROOT,'db','fixyourstreet.db'))
  load (File.join(FIXYOURSTREET_ROOT,'db','schema.rb'))
  #load global options
  YAML::load(File.read(FIXYOURSTREET_CONFIG_FILE)).to_hash.each do |k,v|
      set k, v
  end
end

before do
  #defineix l'idioma preferent
  session[:locale] = options.locale
  
end



#DB = Sequel.sqlite(File.join(FIXYOURSTREET_ROOT,'db','fixyourstreet.db'))
#load "model.rb"
enable :sessions

helpers do
  
  def human_date(datetime)
    datetime.strftime('%d|%b|%Y')
  end
  
  def flash(key)
    out = session[key]
    session[key] = nil
    return out
  end
  
  def geocode(location)
    #try to geocode 
    #todo: experiment with other geocoders to obtain a better result
    result = Geokit::Geocoders::YahooGeocoder.geocode(location + ", Barcelona")
    STDERR.puts result
    if result.success and result.city =~ /\d?\sBarcelona/ and result.accuracy > 5
        return result.ll
    else
        return false
    end
  end
end

#configure do

#end



# -----------------------------------------------------------------------------
 
get '/' do
  session[:index] = true
  #@page_title = "#{Marley::Configuration.blog.title}"
  @page_title = "FixYourStreet"
  @yourcity = options.city
  @problems = Report
  STDERR.puts params[:pc]

  if params[:pc] != nil 
    if geocode(params[:pc]) == false
      session[:error]= i18n.index.error
      params[:pc] = nil and redirect '/'
    else
      ll = geocode(params[:pc]).split(',')
      @lat = ll[0]
      @lon = ll[1]
      STDERR.puts "lat: " + ll[0]
      STDERR.puts "lon: " + ll[1]     
      #if (@lat=='41.387917' and @lon=='2.1699187') 
        #
       # session[:error]= 'Sorry, we could not find that location.'
       # params[:pc] = nil and redirect '/'
      #else
        session[:index] = false
        session[:error] = nil
      #end
    end
  end
  
  haml :index,  :locals => { :root => true }
  
end


get '/report' do
  #@page_title = "FixYourStreet"
  #@yourcity = "Barcelona"
  STDERR.puts params
  haml :report, :locals => { :root => 'false' }
end

get '/upload' do
  haml(:upload)
end

post '/upload' do

end


get '/report_a_problem' do
  haml(:report2, :layout => false)
end

post '/foo' do
  
  STDERR.puts "Wow! "
  STDERR.puts params
  #aquí guardas la info y presentas en pantalla todo el formulario , es decir
  #haces visible el formulario :)
end

post '/report' do
  unless params[:photo] &&
    (tmpfile = params[:photo][:tempfile]) &&
    (name = params[:photo][:filename])
    @error = "No file selected"
    return haml(:index)
  end
  #name.strip!
  STDERR.puts "Uploading file, original name #{name.inspect}"
  data = tmpfile.read
  # here you would write it to its final location
  #STDERR.puts blk.inspect
  File.open( File.join(FIXYOURSTREET_ROOT, 'public','img', name), 'w') {|f| f.write(data) }
  #upload photo
  Problem.insert(
    :photo => File.join('img', params[:category], name),
    :category => params[:category],
    :name => params[:name], 
    :subject => params[:subject],
    :details => params[:details],
    :lat => params[:lat],
    :lon => params[:lon],
    :anonymous => params[:anonymous],
    :done => false
  )
  STDERR.puts "Upload complete"
  redirect '/'
end

get '/problem/:subject/:id' do 
  @problem = Problem.filter(:id => params[:id], :subject => params[:subject]).first
#  haml :problem, :layout => false
  haml :problem

end

get '/category/:category' do
  @problems = Report.filter(:category => params[:category])
  haml :category
end


get '/faq' do
  haml :faq
end


get '/about' do
  "<p style=\"font-family:sans-serif\">I'm running on Sinatra version " + Sinatra::VERSION + '</p>'
end
 
# SASS stylesheet
get '/stylesheets/style.css' do
  headers 'Content-Type' => 'text/css; charset=utf-8'
  sass :style
end

#get '/javascripts/reportProblem.js' do

#end

#not_found do
#  'This is nowhere to be found'
#end


# -----------------------------------------------------------------------------

