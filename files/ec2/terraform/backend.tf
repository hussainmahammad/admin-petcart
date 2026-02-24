terraform {
  backend "s3" {
    bucket         = "petcart-terraform-state-867809929056"
    key            = "petcart/frontend/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "petcart-terraform-locks"
    encrypt        = true
  }
}
