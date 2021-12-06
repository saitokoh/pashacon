class Api::V1::Auth::SessionsController < DeviseTokenAuth::SessionsController
  skip_before_action :verify_authenticity_token

  def create
    super{
      token = params[:token]
      if token.present?
        event = Event.post_accepting.find_by(token: token)
        if event.present?
          user_event = UserEvent.new({user_id: @resource.id, event_id: event.id})
          user_event.save!
        end
      end
    }
  end
end
