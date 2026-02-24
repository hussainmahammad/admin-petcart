# ----------------------------
# Application URL
# ----------------------------
output "alb_dns_name" {
  description = "Public URL of PetCart application"
  value       = aws_lb.petcart_alb.dns_name
}

# ----------------------------
# Auto Scaling Group name
# ----------------------------
output "asg_name" {
  description = "Auto Scaling Group name"
  value       = aws_autoscaling_group.petcart_asg.name
}

# ----------------------------
# Target Group ARN (optional, useful)
# ----------------------------
output "target_group_arn" {
  description = "Target group ARN used by ALB"
  value       = aws_lb_target_group.petcart_tg.arn
}
