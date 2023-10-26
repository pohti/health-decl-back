// hda models
data "archive_file" "hda-models-zip" {
  type                  = "zip"
  source_dir            = "${path.module}/lambda_layers/hda_models"
  output_path           = "${path.module}/lambda_layers/zip/hda_models.zip"
}
resource "aws_lambda_layer_version" "hda-models-lambda-layer" {
  filename              = data.archive_file.hda-models-zip.output_path
  layer_name            = "hda_models"
  description           = "Mongoose model definitions for Health Delaration App"
  
  compatible_runtimes   = ["nodejs18.x"]

  source_code_hash      = "${filebase64sha256(data.archive_file.hda-models-zip.output_path)}"
}

// mongoose
data "archive_file" "mongoose-zip" {
  type                  = "zip"
  source_dir            = "${path.module}/lambda_layers/mongoose"
  output_path           = "${path.module}/lambda_layers/zip/mongoose.zip"
}
resource "aws_lambda_layer_version" "mongoose-lambda-layer" {
  filename              = data.archive_file.mongoose-zip.output_path
  layer_name            = "mongoose"
  description           = ""
  
  compatible_runtimes   = ["nodejs18.x"]

  source_code_hash      = "${filebase64sha256(data.archive_file.mongoose-zip.output_path)}"
}
