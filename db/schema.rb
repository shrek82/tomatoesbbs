# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140507074633) do

  create_table "ads", force: true do |t|
    t.string   "name"
    t.string   "js_path"
    t.string   "type"
    t.string   "img_path"
    t.string   "info"
    t.string   "url"
    t.integer  "hits"
    t.boolean  "is_close",   default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "comments", force: true do |t|
    t.text     "content"
    t.integer  "user_id"
    t.integer  "topic_id"
    t.integer  "album_id"
    t.integer  "userful_num"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "comments", ["album_id"], name: "index_comments_on_album_id"
  add_index "comments", ["topic_id"], name: "index_comments_on_topic_id"
  add_index "comments", ["user_id"], name: "index_comments_on_user_id"

  create_table "followings", force: true do |t|
    t.integer  "user_id"
    t.integer  "object_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "followings", ["object_id"], name: "index_followings_on_object_id"
  add_index "followings", ["user_id"], name: "index_followings_on_user_id"

  create_table "forums", force: true do |t|
    t.integer  "category_id"
    t.string   "name",        limit: 100
    t.string   "intro"
    t.integer  "club_id"
    t.integer  "topics_num",              default: 0
    t.integer  "order_num",               default: 999
    t.boolean  "is_systemic",             default: false
    t.string   "ico_path",    limit: 250, default: "/images/forum/default.png"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "forums", ["category_id"], name: "category_idx"
  add_index "forums", ["club_id"], name: "club_idx"

  create_table "managers", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "password"
    t.datetime "login_at"
    t.string   "role"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "photos", force: true do |t|
    t.string   "title",            limit: 50
    t.integer  "album_id"
    t.integer  "user_id"
    t.string   "img"
    t.string   "img_path",         limit: 250
    t.string   "img_file_name",    limit: 50
    t.string   "img_content_type", limit: 50
    t.string   "img_file_size",    limit: 50
    t.datetime "img_updated_at"
    t.boolean  "is_verify",                    default: true
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "photos", ["album_id"], name: "index_photos_on_album_id"
  add_index "photos", ["user_id"], name: "index_photos_on_user_id"

  create_table "posts", force: true do |t|
    t.integer  "topic_id"
    t.text     "content"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "posts", ["topic_id"], name: "index_posts_on_topic_id"

  create_table "settings", force: true do |t|
    t.string   "var",                   null: false
    t.text     "value"
    t.integer  "thing_id"
    t.string   "thing_type", limit: 30
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "settings", ["thing_type", "thing_id", "var"], name: "index_settings_on_thing_type_and_thing_id_and_var", unique: true

  create_table "subject_categories", force: true do |t|
    t.string   "name",       limit: 20
    t.integer  "order_num"
    t.string   "icon_path",  limit: 200
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "topics", force: true do |t|
    t.string   "title",                  limit: 150
    t.integer  "forum_id"
    t.integer  "subject_id",             limit: 2
    t.integer  "club_id"
    t.integer  "user_id"
    t.string   "title_color",            limit: 10
    t.boolean  "is_fixed",                           default: false
    t.boolean  "is_comment",                         default: false
    t.boolean  "is_good",                            default: false
    t.boolean  "is_recommend",                       default: false
    t.integer  "hits_num",                           default: 0
    t.integer  "comments_num",                       default: 0
    t.integer  "last_comment_user_id"
    t.string   "last_comment_user_name", limit: 50
    t.datetime "last_comment_time"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "topics", ["forum_id"], name: "forum_idx"
  add_index "topics", ["is_good"], name: "is_goodx"
  add_index "topics", ["subject_id"], name: "subject_idx"
  add_index "topics", ["user_id"], name: "user_idx"

  create_table "users", force: true do |t|
    t.string   "username"
    t.string   "password"
    t.string   "email"
    t.datetime "reg_date"
    t.datetime "login_date"
    t.string   "avatar_path"
    t.integer  "point"
    t.string   "memo"
    t.string   "signatures"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
