json.comments do
  json.array!(@comments) do |comment|
    json.userName comment.user.name
    json.comment comment.comment
  end
end