# ----------------------------
# Auto Scaling Group
# ----------------------------
resource "aws_autoscaling_group" "weblancehub_asg" {
  name = "weblancehub-asg"

  min_size         = 1
  desired_capacity = 1
  max_size         = 2

  vpc_zone_identifier = data.aws_subnets.public.ids

  health_check_type         = "ELB"
  health_check_grace_period = 300

  target_group_arns = [
    aws_lb_target_group.weblancehub_tg.arn
  ]

  launch_template {
    id      = aws_launch_template.weblancehub_lt.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "weblancehub-asg-instance"
    propagate_at_launch = true
  }

  lifecycle {
    create_before_destroy = true
  }
}
