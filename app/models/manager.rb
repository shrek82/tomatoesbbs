#coding: utf-8
class Manager < ActiveRecord::Base
  #attr_accessible :email, :login_at, :name, :password, :role

  def to_s
    name
  end

end
