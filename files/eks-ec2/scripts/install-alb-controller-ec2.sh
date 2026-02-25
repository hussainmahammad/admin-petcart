#!/bin/bash
set -e

CLUSTER_NAME=admin-petcart-eks
REGION=us-east-1
POLICY_NAME=AWSLoadBalancerControllerIAMPolicyEC2

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

VPC_ID=$(aws eks describe-cluster \
  --name "$CLUSTER_NAME" \
  --region "$REGION" \
  --query "cluster.resourcesVpcConfig.vpcId" \
  --output text)

echo "Cluster  : $CLUSTER_NAME"
echo "Region   : $REGION"
echo "VPC ID   : $VPC_ID"
echo "Account  : $ACCOUNT_ID"

# 1️⃣ Ensure OIDC is associated
eksctl utils associate-iam-oidc-provider \
  --cluster "$CLUSTER_NAME" \
  --region "$REGION" \
  --approve

# 2️⃣ Create EC2-specific IAM policy
aws iam create-policy \
  --policy-name "$POLICY_NAME" \
  --policy-document file://files/eks-ec2/iam/alb-controller-policy.json \
  || echo "IAM policy already exists"

# 3️⃣ Create / update IAM service account
eksctl create iamserviceaccount \
  --cluster "$CLUSTER_NAME" \
  --region "$REGION" \
  --namespace kube-system \
  --name aws-load-balancer-controller \
  --attach-policy-arn arn:aws:iam::$ACCOUNT_ID:policy/$POLICY_NAME \
  --approve \
  --override-existing-serviceaccounts

# 4️⃣ Install / upgrade AWS Load Balancer Controller (EC2)
helm repo add eks https://aws.github.io/eks-charts
helm repo update

helm upgrade --install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName="$CLUSTER_NAME" \
  --set region="$REGION" \
  --set vpcId="$VPC_ID" \
  --set replicaCount=1 \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

echo "✅ EC2 ALB Controller install triggered (replicaCount=1)"
