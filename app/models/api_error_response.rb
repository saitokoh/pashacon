# エラーレスポンスのインターフェース実装です。
#
# 使い方
#  render :json => ApiErrorResponse.create_conflict_response("エラーページ", "エラーが発生しました", "エラーです") , status: :conflict
class ApiErrorResponse

  def self.create_conflict_response(page_title, outline, detail="")
    return {
      page_title: page_title,
      outline: outline,
      detail: detail
    }
  end

  def self.create_unprocessable_entity_response(errors)
    return { errors: create_unprocessable_entity_response_body(errors) }
  end

  def self.create_unprocessable_entity_response_body(errors)
    json_errors = []
    errors.messages.map do |key, value|
      json_error = { key: key, messages: value }
      json_errors << json_error
    end
    return json_errors
  end

  def self.create_unprocessable_entity_response_multi(errors_map)
    json_errors = []
    errors_map.map do |key, errors|
      errors.messages.map do |k, v|
        json_error = { key: "#{key}.#{k}", messages: v }
        json_errors << json_error
      end
    end
    { errors: json_errors }
  end

  def self.create_unprocessable_entity_response_array_message(key, message)
    { errors: [{ key: key, messages: [message] }] }
  end

  def self.create_unprocessable_entity_response_single_message(key, message)
    { errors: [{ key: key, messages: message }] }
  end

end
