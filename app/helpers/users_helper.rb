module UsersHelper
  def gravatar_for(user,options = { size: 50 })
    gravatar_id = Digest::MD5::hexdigest(user.email.downcase)
    size = options[:size]
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}"
    image_tag(gravatar_url, alt: user.name, class: "gravatar")
  end

  #生成注册激活码
  def generate_activecode(str)
    Digest::SHA1.hexdigest('gobiker2013'+str)
  end
end
