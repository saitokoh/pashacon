class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  skip_before_action :verify_authenticity_token

  def create
    token = params[:token]
    if token.blank?
      render json: ApiErrorResponse.create_unprocessable_entity_response_single_message("token", "URLが正しくありません"), status: :unprocessable_entity
      return
    end
    @event = Event.post_accepting.find_by(token: token)
    if @event.blank?
      render json: ApiErrorResponse.create_unprocessable_entity_response_single_message("token", "コンテストが終了してるため登録できません"), status: :unprocessable_entity
      return
    end

    super{
      user_event = UserEvent.new({user_id: @resource.id, event_id: @event.id})
      user_event.save!
    }
  end

  private
   def sign_up_params
     params.permit(:name, :email, :password, :password_confirmation)
   end

  def account_update_params
    params.permit(:name, :email, :user_type_id)
  end
end
