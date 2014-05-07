class SubjectCategory < ActiveRecord::Base
  #attr_accessible :icon_path, :name, :order_num
  has_many :topics
end
