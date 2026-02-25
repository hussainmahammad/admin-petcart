# ----------------------------
# Security Group for EC2
# ----------------------------
resource "aws_security_group" "ec2_sg" {
  name        = "admin-petcart-ec2-sg"
  description = "Allow traffic from ALB only"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # demo purpose; can restrict later
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "admin-petcart-ec2-sg"
  }
}

# ----------------------------
# IAM Role for EC2 (CloudWatch)
# ----------------------------
resource "aws_iam_role" "ec2_role" {
  name = "admin-petcart-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "cw_attach" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "admin-petcart-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

# ----------------------------
# Golden AMI lookup
# ----------------------------
data "aws_ami" "admin_petcart_ami" {
  most_recent = true
  owners      = ["self"]

  filter {
    name   = "name"
    values = ["admin-petcart-frontend-ami-*"]
  }
}

# ----------------------------
# Launch Template
# ----------------------------
resource "aws_launch_template" "admin_petcart_lt" {
  name_prefix   = "admin-petcart-lt-"
  image_id      = data.aws_ami.admin_petcart_ami.id
  instance_type = "t3.micro"

  key_name = "hussaincloud" # optional, keep for emergency SSH

  iam_instance_profile {
    name = aws_iam_instance_profile.ec2_profile.name
  }

  network_interfaces {
    associate_public_ip_address = true
    security_groups             = [aws_security_group.ec2_sg.id]
  }

  tag_specifications {
    resource_type = "instance"

    tags = {
      Name = "admin-petcart-asg-instance"
    }
  }
}
