terraform {
  backend "s3" {
    bucket         = "weblancehub-terraform-state-867809929056"
    key            = "weblancehub/frontend/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "weblancehub-terraform-locks"
    encrypt        = true
  }
}
