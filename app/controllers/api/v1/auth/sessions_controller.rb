class Api::V1::Auth::SessionsController < DeviseTokenAuth::SessionsController
  skip_before_action :verify_authenticity_token

  def create
    super{
      event = Event.post_accepting.find_by(token: params[:token]) if params[:token].present?
      # eventが存在して、user_eventが存在しない ＝ 参加していない場合
      if event.present? && UserEvent.find_by(event_id: event.id, user_id: @resource.id).blank?
        user_event = UserEvent.new({user_id: @resource.id, event_id: event.id})
        user_event.save!
      end
    }
  end
end
