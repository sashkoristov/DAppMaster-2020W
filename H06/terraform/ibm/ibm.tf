# Access variable from terraform.tfvars
variable "ibmcloud_api_key" {}

# Support ibm provider
terraform {
  required_providers {
    ibm = {
      source = "IBM-Cloud/ibm"
      version = "~> 1.12.0"
    }
  }
}

# Credentials and region configuration
provider "ibm" {
  ibmcloud_api_key   = var.ibmcloud_api_key
  region             = "eu-gb"
}

# Function configuration
resource "ibm_function_action" "nodehello" {
  name      = "<FUNCTION DEPLOYMENT NAME>"
  namespace = "<YOUR NAMESPACE>"

  exec {
    kind = "nodejs:12"
    code = file("main.js")
  }
  
  # Timeout and memory
  limits {
	timeout = "10000"
	memory = "128"
  }
}