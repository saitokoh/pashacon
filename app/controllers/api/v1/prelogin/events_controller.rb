class Api::V1::Prelogin::EventsController < Api::V1::Prelogin::ApplicationController

  def get_for_invite
    @event = Event.post_accepting.find_by(token: pre_params[:token])
    if @event.blank?
      render :json => "Not Found" , status: :not_found
      return
    else
      render formats: :json
    end
  end

  private

    def pre_params
      params.permit(:token)
    end
end