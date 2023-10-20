
# Data source to read local files and create a ZIP archive
data "archive_file" "getUserHealthInfo_source_code" {
  type        = "zip"
  source_dir  = "${path.module}/src/lambda/getUserHealthInfo"
  output_path = "${path.module}/lambda_zip/getUserHealthInfo.zip"
}

# Define the Lambda function
resource "aws_lambda_function" "getUserHealthInfo" {
  function_name = "hda-getUserHealthInfo"
  runtime       = "nodejs18.x"
  handler       = "index.handler"
  role          = aws_iam_role.lambda_role.arn
  filename      = "${path.module}/lambda_zip/getUserHealthInfo.zip" # Path to the local source code ZIP file
  source_code_hash = data.archive_file.getUserHealthInfo_source_code.output_base64sha256
  timeout       = 20
  # Specify your function's environment variables if any
  environment {
    variables = {
      MONGODB_URI  = local.MONGDB_URI
    }
  }

  layers = [
    var.MONGOOSE_LAYER_ARN
  ]
}

# output "lambda_function_arn" {
#   value = aws_lambda_function.example_lambda.arn
# }
