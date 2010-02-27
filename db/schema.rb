
# connect to an in-memory database

# create an items table
#DB.create_table :problems do
#  primary_key :id
#  String :category
#  String :subject
#  Text :details
#  String :name
#  String :email
#  String :phone
#  Float :lat
#  Float :lon
#  timestamp :created_at
#end

class Report < Sequel::Model
  set_schema do
    primary_key :id, :type => Integer
    String :subject, :size => 100#, :null => false
    Timestamp :created_at
    DateTime :update_at
    DateTime :fixet_at
    boolean :is_fixed, :default => false
    boolean :is_hate, :default => false
    String :category
    Text :details
    File :photo
    String :name
    String :email
    String :phone
    Float :lat
    Float :lon
  end

  create_table unless table_exists?

  def validate
    errors.add(:name, "can't be empty") if name.empty?
    #errors.add(:written_on, "should be in the past") if written_on >= Time.now
  end
end



#class Update < Sequel::Model
#  set_schema do
#    primary_key :id, :type => Integer
#    String :name
#    String :email
#    Text :details
#    File :photo
#  end
#end


#Problem.insert(:name => 'lorem ipsum', :lat => 3.3303 , :lon => 41.293939, :created_at => Time.now)
#Problem.insert(:name => 'dolor colorum', :lat => 1.3303 , :lon => 43.293939, :photo => "/img/Barrel-32x32.png")
#Problem.insert(:name => 'leñes!')


#couch = CouchRest.new("http://127.0.0.1:5984")
#db = couch.database('fixyourstreet')
#db.delete! rescue nil
#db = couch.create_db('fixyourstreet')
#
#def show obj
#  puts obj.inspect
#  puts
#end

#SERVER = CouchRest.new
#SERVER.default_database = 'fixyourstreet'

#class Problem < CouchRest::ExtendedDocument
#  use_database SERVER.default_database
#  property :category
#  property :subject
#  property :details
#  property :name
#  property :photo
#  property :email
#  property :phone
#  property :created_at
#  timestamps!
#  view_by :created_at, :descending => true
#  view_by :_id
#  
#end

