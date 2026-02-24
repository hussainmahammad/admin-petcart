# ----------------------------
# Scale OUT policy (+1 instance)
# ----------------------------
resource "aws_autoscaling_policy" "scale_out" {
  name                   = "weblancehub-scale-out"
  autoscaling_group_name = aws_autoscaling_group.weblancehub_asg.name
  adjustment_type        = "ChangeInCapacity"
  scaling_adjustment     = 1
  cooldown               = 300
}

# ----------------------------
# Scale IN policy (-1 instance)
# ----------------------------
resource "aws_autoscaling_policy" "scale_in" {
  name                   = "weblancehub-scale-in"
  autoscaling_group_name = aws_autoscaling_group.weblancehub_asg.name
  adjustment_type        = "ChangeInCapacity"
  scaling_adjustment     = -1
  cooldown               = 300
}

# ----------------------------
# CPU High Alarm (Scale OUT)
# ----------------------------
resource "aws_cloudwatch_metric_alarm" "cpu_high" {
  alarm_name          = "weblancehub-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  threshold           = 70

  metric_name = "CPUUtilization"
  namespace   = "AWS/EC2"
  statistic   = "Average"
  period      = 60

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.weblancehub_asg.name
  }

  alarm_actions = [
    aws_autoscaling_policy.scale_out.arn
  ]
}

# ----------------------------
# CPU Low Alarm (Scale IN)
# ----------------------------
resource "aws_cloudwatch_metric_alarm" "cpu_low" {
  alarm_name          = "weblancehub-cpu-low"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 2
  threshold           = 30

  metric_name = "CPUUtilization"
  namespace   = "AWS/EC2"
  statistic   = "Average"
  period      = 60

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.weblancehub_asg.name
  }

  alarm_actions = [
    aws_autoscaling_policy.scale_in.arn
  ]
}
