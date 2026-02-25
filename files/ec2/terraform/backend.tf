terraform {
  backend "s3" {
    bucket  = "hussainmahammad.online-tfstates"
    key     = "admin-petcart/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}
