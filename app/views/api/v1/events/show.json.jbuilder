json.posts do
  json.array!(@posts) do |post|
    json.id post.id
    json.userId post.user.id
    json.userName post.user.name
    json.path post.image.path
    json.description post.description
    json.comments do
      json.array!(post.comments) do |comment|
        json.userName comment.user.name
        json.comment comment.comment
      end
    end
    json.isVoted post.vote?(@current_user)
  end
end
json.event do
  json.name @event.name
  json.eventStatusName @event.event_status.name
  json.eventStatusDisplayName @event.event_status.display_name
end