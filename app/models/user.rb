#coding: utf-8

class User < ActiveRecord::Base

  #attr_accessible :avatar_path, :email, :login_date, :memo, :password, :pass, :point, :reg_date, :username, :code, :password_confirmation,:signatures

  has_many :comments, :dependent => :destroy
  has_many :places
  has_many :topics
  has_many :guides
  has_many :articles
  has_many :albums
  has_many :photos
  has_many :eventses
  has_many :been_to_places
  has_one :avatar

  #权限控制
  has_and_belongs_to_many :permissions

  validates_presence_of :email, :message => "邮箱不能为空!"
  validates_format_of :email, :message => "邮箱格式不正确!", :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i
  validates_length_of :email, :minimum => 3, :maximum => 15, :message => "邮箱长度须为3到15位字母或数字!"
  validates_uniqueness_of :email, :case_sensitive => false, :message => "该邮箱地址已存在!"

  validates_presence_of :username, :message => "用户名不能为空!"
  validates_length_of :username, :minimum => 2, :maximum => 15, :message => "用户长度须为2到15位字母或数字!"
  validates_uniqueness_of :username, :message => "该用户名已存在!"

  validates_presence_of :password, :message => "密码不能为空!"
  validates_length_of :password, :minimum => 5, :message => "密码长度须为5到16位字母或数字! "
  validates_confirmation_of :password, :message => "两次密码不一致!"

  #注册时邮件激活码
  validates_presence_of :code, :message => "邮箱激活码不能为空!", :on => :create

  #自定义验证方法
  validate :check_code, :on => :create

  #对明文密码加密
  before_create :generate_password

  #before_destroy :before_delete_user

  #选用已有的所有的验证程序来验证模型，
  #validates :email, :length => {:in => 1..25}, :uniqueness => true

  #自定义验证方法
  #validate :must_be_friends

  #或随着块一起验证当前记录
  #validate do |cur|
  #  cur.must_be_friends
  #end

  #或
  #validate do
  #  errors.add(:base, "Must be friends to leave a comment") unless commenter.friend_of?(commentee)
  #end

  def code
    @code
  end

  def code=(str)
    @code=str
  end

  #对外提供邮箱激活码
  def self.get_activecode(email)
    generate_activecode(email)
  end

  #登录
  def self.login(post={})
    user=nil
    back={:error => nil, :uid => nil, :user => nil}
    if post[:email] && post[:password]
      user=User.find_by_email post[:email]
    elsif post[:account] && post[:password]
      if /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i.match post[:account]
        user=User.find_by_email post[:account]
      else
        user=User.find_by_username post[:account]
      end
    elsif post[:username] && post[:password]
      user=User.find_by_username post[:username]
    else
      back[:error] = '很抱歉，登录邮箱/用户名或密码不能为空'
    end

    if user
      if user[:password]==Digest::MD5.hexdigest(post[:password])
        user.login_date=Time.now
        user.save
        back[:uid]=user[:id]
        back[:user]=user
        back[:success]='登录成功！'
      else
        back[:error]='很抱歉，密码错误，请重新输入'
      end
    else
      back[:error]='很抱歉，帐号不存在，请重试或注册'
    end

    return back

  end

  private

  #保存session

  #检查激活码
  def check_code
    errors.add(:base, "邮件激活码不正确") if @code&&@code!=generate_activecode(email)
  end

  def must_be_friends
    errors.add(:base, "Must be friends to leave a comment") unless commenter.friend_of?(commentee)
  end

  def before_delete_user
    if comments.empty?
      return true
    else
      errors.add(:base, 'error smsmsmsm')
      return false
    end
  end

  #生成注册激活码
  def generate_activecode(email)
    Digest::SHA1.hexdigest('gobiker2013'+email)
  end

  #生成正式密码
  def generate_password
    #salt=Array.new(5) { rand(1024).to_s(36) }.join
    #self.password=Digest::SHA256.hexdigest(self.password+salt)
    self.password=Digest::MD5.hexdigest(self.password)
  end

end
