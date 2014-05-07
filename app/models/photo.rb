class Photo < ActiveRecord::Base
  #attr_accessible :title,:album_id,:user_id,:img_path, :is_verify,
  #                :img, :img_content_type, :img_file_name, :img_file_size, :img_updated_at

  has_attached_file :img,
                    :styles => {:square=>"80x80#",:mini => "100x100>",:thumb => "150x150>",:sqr_thumb=>"180x180#",:medium => "300x300>", :large => "600x600>",:original => "800x800>"},
                    :default_url => "/images/:style/missing.png",
                    :url => "/uploads/photos/:year/:month:day/:id_:style.:extension",
                    :path => ":rails_root/public/uploads/photos/:year/:month:day/:id_:style.:extension"
  validates_attachment_content_type :img, :content_type => ['image/gif', 'image/png', 'image/x-png', 'image/jpeg', 'image/pjpeg', 'image/jpg','application/octet-stream']
  #以下方式可能使来自uploadey的图片无法识别
  #validates_attachment_content_type :img, :content_type => /\Aimage\/.*\Z/
  #validates_attachment :img, :presence => true,:content_type => { :content_type => "image/jpg" },:size => { :in => 0..20000.kilobytes }

  belongs_to :album
  belongs_to :user

  after_create :set_img_path
  after_save :expire_cache_by_name
  after_save :expire_cache_by_id

  #私有方法
  private

  #添加后修改图片路径
  def set_img_path
    file_extension=self.img_file_name[/\.[a-z]{3,4}$/]
    img_path='/uploads/photos/'+self.img_updated_at.strftime('%Y')+'/'+self.img_updated_at.strftime('%m%d')+'/'+self.id.to_s+'_thumb'+file_extension
    original_path='/uploads/photos/'+self.img_updated_at.strftime('%Y')+'/'+self.img_updated_at.strftime('%m%d')+'/'+self.id.to_s+'_original'+file_extension
    update_attr={:img_path=>img_path}
    update_attr.store('title',self.img_file_name.sub(/\.[a-z]{3,4}$/,'')) if self.title.nil?
    self.update_attributes(update_attr)
    #为原图添加水印
    watermark('public'+original_path,'public/images/water.png',position: 'bottom_right')
    #watermark('public'+original_path,'public/images/water.png',position: 'bottom_right',save_to:'public'+original_path)
  end

  def expire_cache_by_name
    #Rails.cache.expire("my_object:name:#{self.name}")
  end

  def expire_cache_by_id
    #Rails.cache.expire("my_object:#{self.id}")
  end

  #添加水印
  def watermark(img_path,watermark_path, options = {})
    ImageClipper::Image.new(img_path).watermarking(watermark_path,options)
  end

end
