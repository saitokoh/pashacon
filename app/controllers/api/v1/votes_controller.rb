class Api::V1::VotesController < Api::V1::ApplicationController

  def vote
    post = Post.find(params[:post_id])
    if post.present?
      if @current_user.vote(post)
        head :no_content
      else
        render json: ApiErrorResponse.create_unprocessable_entity_response(@current_user.errors), status: :unprocessable_entity
      end
    else
      render :json => "Not Found" , status: :not_found
    end
  end

  def cancel_vote
    post = Post.find(params[:post_id])
    if post.present?
      if @current_user.cancel_vote(post)
        head :no_content
      else
        render json: ApiErrorResponse.create_unprocessable_entity_response(@current_user.errors), status: :unprocessable_entity
      end
    else
      render :json => "Not Found" , status: :not_found
    end
  end

end