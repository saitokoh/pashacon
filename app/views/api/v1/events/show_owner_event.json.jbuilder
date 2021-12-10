json.posts do
  json.array!(@posts) do |post|
    json.id post.id
    json.userId post.user.id
    json.userName post.user.name
    json.votes do
      json.array!(post.votes) do |vote|
        json.voteUserId vote.user_id
      end
    end
  end
end
json.event do
  json.name @event.name
  json.eventStatusId @event.event_status.id
  json.description @event.description
end
json.eventStatusList do
  json.array!(EventStatus.all) do |event_status|
    json.id event_status.id
    json.name event_status.name
    json.displayName event_status.display_name
  end
end