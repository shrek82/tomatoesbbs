class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.string   "title",            limit: 50
      t.integer  "album_id"
      t.integer  "user_id"
      t.string   "img"
      t.string   "img_path",         limit: 250
      t.string   "img_file_name",    limit: 50
      t.string   "img_content_type", limit: 50
      t.string   "img_file_size",    limit: 50
      t.datetime "img_updated_at"
      t.boolean  "is_verify",        default: true

      t.timestamps
    end

    add_index "photos", ["album_id"], name: "index_photos_on_album_id"
    add_index "photos", ["user_id"], name: "index_photos_on_user_id"

  end
end
