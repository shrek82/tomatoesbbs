#coding:utf-8
class Topic < ActiveRecord::Base
  #attr_accessible :subject_id, :title, :title_color, :user_id, :club_id, :comments_num, :activity_id, :forum_id, :hits_num, :is_comment, :is_fixed, :is_good, :is_recommend, :last_comment_time, :last_comment_user_id, :last_comment_user_name
  #attr_accessible :from_form, :content, :activity_data, :post_data, :together_data
  belongs_to :forum, :foreign_key => "forum_id"
  belongs_to :user
  belongs_to :subject_category, :foreign_key => "subject_id"
  belongs_to :reply_user, :class_name => "User", :foreign_key => "last_comment_user_id"

  has_one :activity
  has_one :together
  has_one :post

  #基本验证
  validates_presence_of :forum_id
  validates_presence_of :subject_id
  validates_presence_of :user_id
  #validates_length_of :title, :in => 2..60

  #保存验证
  validate do
    #来自保单操作
    if self[:from_form]
      if self.subject_id==1
        self.errors.add(:base, '作者不能为空') if self.user_id.blank?
        self.errors.add(:base, '标题不能为空') if self.title.blank?
        self.errors.add(:base, '标题字数不能少于3个字符') if (self.title.blank?)==false && self.title.size<3
        self.errors.add(:base, '内容不能为空') if self.content.blank?
        self.errors.add(:base, '内容字符至少10个字符') if (self.content.blank?)==false && self.content.size<10
      elsif self.subject_id==2
        self.errors.add(:base, '标题不能为空') if self.title.blank?
        self.errors.add(:base, '日期不能为空') if self.together_data['start_at'].blank?
        self.errors.add(:base, '详细说明不能为空') if self.content.blank?
      elsif self.subject_id==3
        self.errors.add(:base, '标题不能为空') if self.title.blank?
        self.errors.add(:base, '开始日期不能为空') if self.activity_data['start_at'].blank?
        self.errors.add(:base, '结束不能为空') if self.activity_data['finish_at'].blank?
        self.errors.add(:base, '活动地址不能为空') if self.activity_data['address'].blank?
        self.errors.add(:base, '详细说明不能为空') if self.content.blank?
      end
    end
  end

  #保存验证
  #before_save :topic_before_save

  #创建topic
  after_create :topic_after_create

  #belongs_to :forum,:touch=>true

  #查询基本字段
  scope :base_field, ->{select("topics.id,topics.title,topics.forum_id,topics.subject_id,topics.user_id,topics.title_color,topics.last_comment_user_id,topics.last_comment_time,topics.hits_num,topics.comments_num,topics.is_fixed,topics.is_good,topics.created_at")}

  #自定义详情字段
  def content
    @content
  end

  def content=(str)
    @content=str
  end

  #自定义话题字段
  def post_data
    @post_data
  end

  def post_data=(arr)
    @post_data=arr
  end

  #自定义活动字段
  def from_form
    @from_form
  end

  def from_form(boolean=false)
    @from_form=boolean
  end

  def together_data
    @together_data
  end

  def together_data=(arr)
    @together_data=arr
  end

  def activity_data
    @activity_data
  end

  def activity_data=(arr)
    @activity_data=arr
  end

  private

  #后续添加
  def topic_after_create
    if self.subject_id==1
      post=Post.new()
      post.topic_id=self.id
      post.content=@content
      post.save
    elsif self.subject_id==2
      together=Together.new
      together.topic_id=self.id
      together.address=self.together_data['address']
      together.start_at=self.together_data['start_at']
      together.finish_at=self.together_data['finish_at']
      together.content=@content
      together.save
    elsif self.subject_id==3
      activity=Activity.new
      activity.topic_id=self.id
      activity.address=self.activity_data['address']
      activity.start_at=self.activity_data['start_at']
      activity.finish_at=self.activity_data['finish_at']
      activity.content=@content
      activity.save
    end

  end


  #首页攻略
  def self.guides(limit=5)
    Topic.base_field.where(:subject_id=>4).includes(:user,:forum).order("topics.id DESC").limit(limit)
  end

  #首页活动
  def self.activities(limit=5)
    Topic.base_field.where(:subject_id=>3).includes(:user,:forum).order("topics.id DESC").limit(limit)
  end

  #热门话题
  def self.hot(limit=5,month_ago=1)
    begin_date=(month_ago).month.ago.to_s(:db)
    Topic.base_field.where(:subject_id=>1).where("topics.created_at>=?",begin_date).includes(:user).order("topics.comments_num DESC").limit(limit)
  end

end
