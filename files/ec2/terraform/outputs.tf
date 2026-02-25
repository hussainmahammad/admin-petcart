# ----------------------------
# Application URL
# ----------------------------
output "alb_dns_name" {
  description = "Public URL of Admin PetCart application"
  value       = aws_lb.admin_petcart_alb.dns_name
}

# ----------------------------
# Auto Scaling Group name
# ----------------------------
output "asg_name" {
  description = "Auto Scaling Group name"
  value       = aws_autoscaling_group.admin_petcart_asg.name
}

# ----------------------------
# Target Group ARN (optional, useful)
# ----------------------------
output "target_group_arn" {
  description = "Target group ARN used by ALB"
  value       = aws_lb_target_group.admin_petcart_tg.arn
}
