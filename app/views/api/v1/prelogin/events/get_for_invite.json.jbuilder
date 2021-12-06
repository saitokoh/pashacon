json.event do
  json.ownerUserName @event.owner_user.name
  json.name @event.name
  json.description @event.description
end