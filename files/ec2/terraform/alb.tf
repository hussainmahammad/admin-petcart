# ----------------------------
# Security Group for ALB
# ----------------------------
resource "aws_security_group" "alb_sg" {
  name        = "petcart-alb-sg"
  description = "Allow HTTP traffic to ALB"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "petcart-alb-sg"
  }
}

# ----------------------------
# Application Load Balancer
# ----------------------------
resource "aws_lb" "petcart_alb" {
  name               = "petcart-alb"
  load_balancer_type = "application"
  internal           = false
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = data.aws_subnets.public.ids

  tags = {
    Name = "petcart-alb"
  }
}

# ----------------------------
# Target Group
# ----------------------------
resource "aws_lb_target_group" "petcart_tg" {
  name     = "petcart-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.default.id

  health_check {
    enabled             = true
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }

  tags = {
    Name = "petcart-tg"
  }
}

# ----------------------------
# ALB Listener (HTTP)
# ----------------------------
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.petcart_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.petcart_tg.arn
  }
}

