variable "aws_region" {
  type    = string
  default = "ap-southeast-1"
}

variable "api_gateway_stage" {
  type    = string
  default = "dev"
}

variable "MONGODB_ACC" {
  type    = string
  default = ""
}

variable "MONGODB_PW" {
  type    = string
  default = ""
}
