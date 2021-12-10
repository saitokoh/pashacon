class Api::V1::EventsController < Api::V1::ApplicationController

  def get_for_invite
    @event = Event.post_accepting.find_by(token: pre_params[:token])
    if @event.blank?
      render :json => "Not Found" , status: :not_found
      return
    else
      render formats: :json
    end
  end

  def get_joined_events
    @events = @current_user.events
    render formats: :json
  end

  def get_owner_events
    @owner_events = @current_user.owner_events.order(created_at: :desc)
    render formats: :json
  end

  def register
    @event = Event.new(register_params, @current_user)

    begin
      ActiveRecord::Base.transaction do
        @event.save
        @current_user.join_event(@event)
      end
      render formats: :json
    rescue => e
      logger.error("イベント登録処理で例外が発生しました#{e.backtrace}")
      render json: ApiErrorResponse.create_unprocessable_entity_response(@event.errors), status: :unprocessable_entity
    end
  end

  def update
    @event = Event.find(params[:event_id])
    if @event.present?
      @event.assign_attributes(update_params)
      if @event.save
        head :no_content
      else
        render json: ApiErrorResponse.create_unprocessable_entity_response(@event.errors), status: :unprocessable_entity
      end
    else
      render :json => "Not Found" , status: :not_found
    end  
  end

  def show
    @event = Event.find(show_params[:event_id])
    if @event.present? && @event.join?(@current_user)
      @posts = @event.get_posts
      render formats: :json
    else
      render :json => "Not Found" , status: :not_found
    end
  end

  def show_owner_event
    @event = Event.find(show_params[:event_id])
    if @event.present? && @current_user.owner?(@event)
      @posts = @event.get_posts
      render formats: :json
    else
      render :json => "Not Found" , status: :not_found
    end
  end

  private

    def register_params
      params.permit(
        :name,
        :description
      )
    end

    def update_params
      params.permit(
        :name,
        :description,
        :event_status_id
      )
    end

    def show_params
      params.permit(:event_id)
    end

    def pre_params
      params.permit(:token)
    end
end