#!/bin/bash
set -e

CLUSTER_NAME="petcart-eks"
REGION="us-east-1"

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

POLICY_NAME="EKSFargateCloudWatchLogsPolicy"
POLICY_ARN="arn:aws:iam::$ACCOUNT_ID:policy/$POLICY_NAME"

echo "Account ID: $ACCOUNT_ID"

# Create policy if it doesn't exist
aws iam get-policy --policy-arn "$POLICY_ARN" >/dev/null 2>&1 || \
aws iam create-policy \
  --policy-name "$POLICY_NAME" \
  --policy-document file://files/eks-fargate/iam/eks-fargate-cloudwatch-policy.json

# Find the Fargate Pod Execution Role for THIS cluster only
ROLE_NAME=$(aws iam list-roles \
  --query "Roles[?contains(RoleName, '${CLUSTER_NAME}') && contains(RoleName, 'FargatePodExecutionRole')].RoleName | [0]" \
  --output text)

if [ "$ROLE_NAME" = "None" ] || [ -z "$ROLE_NAME" ]; then
  echo "❌ Fargate Pod Execution Role for cluster ${CLUSTER_NAME} NOT FOUND"
  exit 1
fi

echo "Attaching policy to role: $ROLE_NAME"

aws iam attach-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-arn "$POLICY_ARN"

echo "✅ CloudWatch logging policy attached to Fargate Pod Execution Role"

