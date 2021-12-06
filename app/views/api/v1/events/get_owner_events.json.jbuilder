json.events do
  json.array!(@owner_events) do |owner_event|
    json.id owner_event.id
    json.name owner_event.name
    json.eventStatusName owner_event.event_status.name
    json.eventStatusDisplayName owner_event.event_status.display_name
    json.invitationUrl owner_event.invitation_url
    json.postNum owner_event.posts.count
  end
end