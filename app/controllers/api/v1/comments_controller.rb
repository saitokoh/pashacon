class Api::V1::CommentsController < Api::V1::ApplicationController

  def register
    comment = Comment.new(comment_post_params)
    if comment.save
      head :no_content
    else
      render json: ApiErrorResponse.create_unprocessable_entity_response(comment.errors), status: :unprocessable_entity
    end
  end

  def get_asc
    @comments = Post.find(get_asc_params[:post_id])&.comments_order_created_at
    render formats: :json
  end

  private

    def comment_post_params
      params.permit(
        :user_id,
        :post_id,
        :comment
      )   
    end

    def get_asc_params
      params.permit(
        :post_id
      )
    end
end