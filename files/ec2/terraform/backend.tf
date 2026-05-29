terraform {
  backend "s3" {
    bucket  = "tfstates-hussainmahammad.online"
    key     = "admin-petcart/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}
