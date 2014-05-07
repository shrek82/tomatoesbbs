#添加一些固定数据

class InstallController < ApplicationController

  include UsersHelper

  #初始化项目基本信息，如已经设置，则不会生效
  def setting
    Setting.site_name='兴趣网'
    Setting.site_url='http://gobiker.cn'
    Setting.site_author='jiangang.zhao'
    Setting.site_keyword='杭州骑行,骑行路线'
    Setting.site_description='杭州骑行,骑行路线'
    Setting.site_copyright='copyright @gobiker.cn'

    #话题类型
    subject=SubjectCategory.all
    if subject.blank?
      SubjectCategory.create(:name => '话题', :order_num => 1)
      SubjectCategory.create(:name => '约伴', :order_num => 2)
      SubjectCategory.create(:name => '活动', :order_num => 3)
      SubjectCategory.create(:name => '游记', :order_num => 4)
      SubjectCategory.create(:name => '比赛', :order_num => 5)
    end


    #模拟用户
    user=User.all
    if user.blank?
      %w[seeyoup hmily xiaoxiao].each do |key|
        email=key+'@qq.com'
        code=generate_activecode(email)
        User.create(:username => key, :email => email, :password => '123456', :avatar_path => '/avatar/up.jpeg', :code => code)
      end
    end

    #话题板块
    forums=Forum.all
    if forums.blank?
      (1..15).each do |i|
        Forum.create(:name => '公共版块'+i.to_s, :intro => '公共交流区', :order_num => i, :category_id => 1, :ico_path => '/images/forum/default.jpg')
      end

      %w[杭州 无锡 苏州 上海 北京].each do |key|
        Forum.create(:name => key, :intro => key+'交流园地', :order_num => 1, :category_id => 2, :ico_path => '/images/forum/ljhk.jpg')
      end

      (1..3).each do |i|
        Forum.create(:name => '俱乐部'+i.to_s, :club_id => 1, :order_num => 1, :category_id => 3, :ico_path => '/images/forum/zj.jpg')
      end

      Forum.where(:id => 2).update_all(:ico_path => '/images/forum/fg.jpg')
      Forum.where(:id => 3).update_all(:ico_path => '/images/forum/jwyl.jpg')
      Forum.where(:id => 4).update_all(:ico_path => '/images/forum/jyt.jpg')
      Forum.where(:id => 5).update_all(:ico_path => '/images/forum/ljhk.jpg')
      Forum.where(:id => 6).update_all(:ico_path => '/images/forum/lxsy.jpg')
      Forum.where(:id => 7).update_all(:ico_path => '/images/forum/ozdg.jpg')
      Forum.where(:id => 8).update_all(:ico_path => '/images/forum/ozjt.jpg')
      Forum.where(:id => 9).update_all(:ico_path => '/images/forum/qyer.jpg')
      Forum.where(:id => 10).update_all(:ico_path => '/images/forum/jnd.jpg')
      Forum.where(:id => 12).update_all(:ico_path => '/images/forum/ldmz.jpg')
      Forum.where(:id => 14).update_all(:ico_path => '/images/forum/mg.jpg')
      Forum.where(:id => 15).update_all(:ico_path => '/images/forum/nbe.jpg')
      Forum.where(:id => 16).update_all(:ico_path => '/images/forum/xxl.jpg')
      Forum.where(:id => 17).update_all(:ico_path => '/images/forum/xy.jpg')
      Forum.where(:id => 18).update_all(:ico_path => '/images/forum/ydnxy.jpg')
      Forum.where(:id => 19).update_all(:ico_path => '/images/forum/zgnd.jpg')
      Forum.where(:id => 20).update_all(:ico_path => '/images/forum/zy.jpg')

    end

    #管理员
    manager=Manager.all
    if manager.blank?
      Manager.create(email: 'seeyoup@qq.com', name: 'admin', password: '1234567', role: 'admin')
    end

  end


end
