# ----------------------------
# General
# ----------------------------
variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name prefix"
  type        = string
  default     = "admin-petcart"
}

# ----------------------------
# EC2 / ASG
# ----------------------------
variable "instance_type" {
  description = "EC2 instance type for ASG"
  type        = string
  default     = "t3.micro"
}

variable "asg_min" {
  description = "Minimum ASG size"
  type        = number
  default     = 1
}

variable "asg_desired" {
  description = "Desired ASG size"
  type        = number
  default     = 1
}

variable "asg_max" {
  description = "Maximum ASG size"
  type        = number
  default     = 2
}

# ----------------------------
# Scaling thresholds
# ----------------------------
variable "cpu_scale_out_threshold" {
  description = "CPU percentage to scale out"
  type        = number
  default     = 70
}

variable "cpu_scale_in_threshold" {
  description = "CPU percentage to scale in"
  type        = number
  default     = 30
}
