<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/8b9e1c2e-a377-4aca-81f5-4b09db2b87b4" /># Admin PetCart

## Project Overview

Admin PetCart is the administrative dashboard for managing the PetCart Store platform.  
It allows administrators to manage products, monitor orders, update inventory, and handle platform operations.

The application is deployed using the same DevOps infrastructure and deployment strategy implemented in the **PetCart Store project**.

This project demonstrates enterprise-level DevOps practices including:

- Jenkins CI/CD automation
- Infrastructure provisioning using Terraform
- Immutable infrastructure with Packer + Ansible
- Containerization using Docker + Amazon ECR
- Kubernetes orchestration using Amazon EKS
- AWS Load Balancer Controller for traffic routing
- Auto Scaling policies for high availability
- CloudWatch for monitoring and logging
- Fully automated deployment and destroy workflows

---

## Infrastructure Architecture

Admin PetCart is deployed using the same three infrastructure strategies used in the **PetCart Store project**.

### 1️⃣ EC2 + Auto Scaling + Application Load Balancer

Traditional AWS infrastructure deployment where:

- EC2 instances are created using **Packer-built AMIs**
- Server configuration is done using **Ansible**
- Instances are managed by **Auto Scaling Groups**
- Traffic is distributed using an **Application Load Balancer**

---

### 2️⃣ Amazon EKS with EC2 Worker Nodes

A managed Kubernetes deployment where:

- The application runs inside **Docker containers**
- Images are stored in **Amazon ECR**
- Pods run on **EC2 worker nodes**
- Traffic is managed through **AWS Load Balancer Controller**

---

### 3️⃣ Amazon EKS with Fargate

A serverless Kubernetes deployment where:

- Pods run directly on **AWS Fargate**
- No EC2 worker nodes are required
- Kubernetes manages scaling automatically

---

<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/09115221-7ff6-4407-a8b7-47d4f592891a" />

---

## Reference

The deployment architecture, CI/CD pipeline, Terraform infrastructure setup, Kubernetes manifests, and automation workflows used in **Admin PetCart** are the same as those implemented in the **PetCart Store project**.

For a complete and detailed understanding of the deployment architecture and implementation, please refer to the **PetCart Store project documentation**.
