
# template file
data "template_file" "hda" {
  template = file("${path.module}/swagger.yml")

  vars = {
    aws_region              = var.aws_region
    getUserHealthInfo_uri   = aws_lambda_function.getUserHealthInfo.invoke_arn
    addUserHealthInfo_uri   = aws_lambda_function.addUserHealthInfo.invoke_arn
  }
}

# ---------------------------------------------------------------------------------------------
# api gateway 
resource "aws_api_gateway_rest_api" "hda-api" {
  name = "hda-api"
  body = data.template_file.hda.rendered

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  depends_on = [ data.template_file.hda ]
}

# ---------------------------------------------------------------------------------------------
# deployments
resource "aws_api_gateway_deployment" "hda-api" {
  rest_api_id = aws_api_gateway_rest_api.hda-api.id
  triggers = {
    # important!
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.hda-api.body))
  }
  lifecycle {
    create_before_destroy = true
  }
  depends_on = [ aws_api_gateway_rest_api.hda-api ]
}

resource "aws_api_gateway_stage" "hda-api-dev" {
  deployment_id = aws_api_gateway_deployment.hda-api.id
  rest_api_id   = aws_api_gateway_rest_api.hda-api.id
  stage_name    = var.api_gateway_stage
}

output "api-baseURL" {
  value = aws_api_gateway_stage.hda-api-dev.invoke_url
}

# ---------------------------------------------------------------------------------------------
# usage plan and api key
resource "aws_api_gateway_usage_plan" "hda" {
  name         = "hda-usage-plan"

  api_stages {
    api_id = "${aws_api_gateway_rest_api.hda-api.id}"
    stage  = "${aws_api_gateway_stage.hda-api-dev.stage_name}"
  }

  quota_settings {
    limit  = 1000
    period = "WEEK"
  }

  throttle_settings {
    burst_limit = 100
    rate_limit  = 10
  }
}

resource "aws_api_gateway_api_key" "hda" {
  name = "hda-key"
}

resource "aws_api_gateway_usage_plan_key" "hda-usage-plan-key" {
  key_id        = "${aws_api_gateway_api_key.hda.id}"
  key_type      = "API_KEY"
  usage_plan_id = "${aws_api_gateway_usage_plan.hda.id}"
}


# ---------------------------------------------------------------------------------------------
# cloudwatch logs
resource "aws_cloudwatch_log_group" "openapi-api-gateway-v1-logs" {
  name = "API-Gateway-Execution-Logs_${aws_api_gateway_rest_api.hda-api.id}/${aws_api_gateway_stage.hda-api-dev.stage_name}"
  retention_in_days = 30
}




