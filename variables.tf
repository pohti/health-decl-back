# variable "MONGODB_URI" {
#   type    = string
#   default = ""
# }

variable "MONGODB_ACC" {
  type    = string
  default = ""
}

variable "MONGODB_PW" {
  type    = string
  default = ""
}


variable "MONGOOSE_LAYER_ARN" {
  type    = string
  default = "arn:aws:lambda:ap-southeast-1:609256976967:layer:mongoose:1"
}