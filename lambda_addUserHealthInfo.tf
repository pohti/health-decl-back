
# Data source to read local files and create a ZIP archive
data "archive_file" "addUserHealthInfo_source_code" {
  type        = "zip"
  source_dir  = "${path.module}/src/lambda/addUserHealthInfo"
  output_path = "${path.module}/lambda_zip/addUserHealthInfo.zip"
}

# Define the Lambda function
resource "aws_lambda_function" "addUserHealthInfo" {
  function_name = "hda-addUserHealthInfo"
  runtime       = "nodejs18.x"
  handler       = "index.handler"
  role          = aws_iam_role.lambda_role.arn
  filename      = "${path.module}/lambda_zip/addUserHealthInfo.zip" # Path to the local source code ZIP file
  source_code_hash = data.archive_file.addUserHealthInfo_source_code.output_base64sha256
  timeout       = 20
  # Specify your function's environment variables if any
  environment {
    variables = {
      MONGODB_URI  = local.MONGDB_URI
    }
  }

  layers = [
    aws_lambda_layer_version.hda-models-lambda-layer.arn,
    aws_lambda_layer_version.mongoose-lambda-layer.arn
  ]
}

# ----------------------------------------------------------------------------------------------------
# Allow API Gateway to invoke this lambda
resource "aws_lambda_permission" "allowInvoke-addUserHealthInfo" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.addUserHealthInfo.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.hda-api.execution_arn}/*/*"
}

# output "lambda_function_arn" {
#   value = aws_lambda_function.example_lambda.arn
# }
