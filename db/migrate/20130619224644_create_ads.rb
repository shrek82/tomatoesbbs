class CreateAds < ActiveRecord::Migration
  def change
    create_table :ads do |t|
      t.string   "name"
      t.string   "js_path"
      t.string   "type"
      t.string   "img_path"
      t.string   "info"
      t.string   "url"
      t.integer  "hits"
      t.boolean  "is_close",   default: false

      t.timestamps
    end
  end
end
