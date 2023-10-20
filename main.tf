# Terraform configuration for deploying a Lambda function

# Configure AWS provider
provider "aws" {
  region = "ap-southeast-1" # Specify your desired AWS region
}

locals {
  # mongodb+srv://<username>:<password>?@<cluster_identifier>.mongodb.net/<db_name>
  MONGDB_URI  = "mongodb+srv://${var.MONGODB_ACC}:${var.MONGODB_PW}@cluster0.nizwlcc.mongodb.net/health-declaration-app"
}