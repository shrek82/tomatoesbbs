#coding: utf-8
class Comment < ActiveRecord::Base
  #attr_accessible :content,:place_id,:route_id,:topic_id,:event_id,:album_id,:article_id,:userful_num
  validates_length_of :content, :minimum => 2,:message=>'过短，最少不少于2个字符'
  validates_presence_of :user_id
  belongs_to :place
  belongs_to :user

  after_create :setForumLastcid
  private
  
  #目的地点评
  def self.reviewsPlaces(limit=10)
    Comment.select("id,place_id,user_id,content,created_at").where("place_id>0").includes(:user,:place).limit(limit)
  end

  #设置话题最后回复人
  def setForumLastcid
    if self.topic_id
      count=Comment.where(:topic_id => self.topic_id).count
      Topic.find(self.topic_id).update_attributes(:comments_num=>count,:last_comment_user_id=>self.user_id,:last_comment_time=>self.created_at)
    end
  end

end
