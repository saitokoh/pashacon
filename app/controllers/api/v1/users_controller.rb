class Api::V1::UsersController < Api::V1::ApplicationController

  def update
    @current_user.assign_attributes(update_params)
    if @current_user.save
      head :no_content
    else
      render json: ApiErrorResponse.create_unprocessable_entity_response(@current_user.errors), status: :unprocessable_entity
    end
  end

  def update_password
    @current_user.password = update_password_params[:password]
    # @current_user.password_confirmation = @current_user.password
    if @current_user.save
      head :no_content
    else
      render json: ApiErrorResponse.create_unprocessable_entity_response(@current_user.errors), status: :unprocessable_entity
    end
  end


  private

    def update_params
      params.permit(
        :name,
        :email
      )
    end

    def update_password_params
      params.permit(
        :password
      )
    end
end