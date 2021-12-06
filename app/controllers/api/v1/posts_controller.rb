class Api::V1::PostsController < Api::V1::ApplicationController

  def post
    @post = Post.new
    if @post.save_with_image(post_params, @current_user)
      head :no_content
    else
      render json: ApiErrorResponse.create_unprocessable_entity_response(@post.errors), status: :unprocessable_entity
    end
  end

  private

    def post_params
      params.permit(
        :image,
        :description,
        :event_id
      )   
    end
end