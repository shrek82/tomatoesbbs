json.array!(@followings) do |following|
  json.extract! following, :id, :user_id, :object_id
  json.url following_url(following, format: :json)
end
