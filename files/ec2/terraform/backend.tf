terraform {
  backend "s3" {
    bucket         = "admin-petcart-terraform-state-867809929056"
    key            = "admin-petcart/frontend/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "admin-petcart-terraform-locks"
    encrypt        = true
  }
}
