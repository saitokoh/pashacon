class Api::V1::MainController < Api::V1::ApplicationController

  def info
    @joined_event_count = @current_user.events.count
    @owner_event_count = @current_user.owner_events.count
    render formats: :json
  end
end