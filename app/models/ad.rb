#coding: utf-8
class Ad < ActiveRecord::Base
  #attr_accessible :hits, :img_path, :info, :is_close, :js_path, :name, :type, :url

  def to_s
    Time.now.beginning_of_month
    name
  end

end
