# Shared credentials file and region configuration
provider "aws" {
  shared_credentials_file = "/Users/<YOUR USERNAME>/.aws/credentials"
  region = "us-east-1"
}

# Create a new aws iam role
resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

# Configuration of the lambda function
resource "aws_lambda_function" "test_lambda" {
  filename      = "lambda.zip"
  function_name = "<FUNCTION DEPLOYMENT NAME>"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "main.handler"

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  source_code_hash = filebase64sha256("lambda.zip")

  runtime = "nodejs12.x"
}