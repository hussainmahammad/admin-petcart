#!/bin/bash
set -e

# ====== CONFIG ======
CLUSTER_NAME=admin-petcart-eks
REGION=us-east-1
POLICY_NAME=AWSLoadBalancerControllerIAMPolicy

# ====== DERIVED VALUES (NO HARD-CODED SECRETS) ======
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

VPC_ID=$(aws eks describe-cluster \
  --name "$CLUSTER_NAME" \
  --region "$REGION" \
  --query "cluster.resourcesVpcConfig.vpcId" \
  --output text)

echo "Account ID : $ACCOUNT_ID"
echo "Cluster    : $CLUSTER_NAME"
echo "Region     : $REGION"
echo "VPC ID     : $VPC_ID"

# ====== OIDC PROVIDER ======
eksctl utils associate-iam-oidc-provider \
  --cluster "$CLUSTER_NAME" \
  --region "$REGION" \
  --approve

# ====== IAM POLICY ======
aws iam create-policy \
  --policy-name "$POLICY_NAME" \
  --policy-document file://files/eks-fargate/iam/alb-controller-policy.json \
  || echo "IAM policy already exists"

# ====== IAM SERVICE ACCOUNT ======
eksctl create iamserviceaccount \
  --cluster "$CLUSTER_NAME" \
  --region "$REGION" \
  --namespace kube-system \
  --name aws-load-balancer-controller \
  --attach-policy-arn arn:aws:iam::$ACCOUNT_ID:policy/$POLICY_NAME \
  --approve \
  --override-existing-serviceaccounts

# ====== HELM SETUP ======
helm repo add eks https://aws.github.io/eks-charts
helm repo update

# ====== INSTALL ALB CONTROLLER ======
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName="$CLUSTER_NAME" \
  --set region="$REGION" \
  --set vpcId="$VPC_ID" \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

echo "✅ AWS Load Balancer Controller installation triggered"
