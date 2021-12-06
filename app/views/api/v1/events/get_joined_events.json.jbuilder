json.events do
  json.array!(@events) do |event|
    json.id event.id
    json.name event.name
    json.eventStatusName event.event_status.name
    json.eventStatusDisplayName event.event_status.display_name
    json.postNum event.posts.count
    json.myPostNum event.user_posts(@current_user.id).count
    json.ownerName event.owner_user.name

  end
end