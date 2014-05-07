#coding: utf-8
class Forum < ActiveRecord::Base
  #attr_accessible :name,:intro, :order_num,:club_id,:topics_num,:province_id,:city_id,:ico_path,:is_systemic,:category_id
  has_many :topics

  def self.hot_forums(limit=5)
    Forum.select("forums.id,forums.name,forums.intro,forums.ico_path,(select count(topics.id) from topics where topics.forum_id=forums.id) as topics_num").order('topics_num desc').limit(limit)
  end
end
