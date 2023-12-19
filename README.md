# OnePot Counter

Welcome to the OnePot Counter project! This simple yet robust web application serves as an exemplary showcase for integrating React with AWS services using the Cloud Development Kit (CDK). It's designed to be a straightforward starting point for similar projects, illustrating best practices in setup and configuration.

## Getting Started

### Setting Up and Deploying with AWS CDK

To begin, set up your AWS environment for the CDK. This involves configuring environment variables to guide the CDK CLI towards the correct AWS account for deploying changes.

```sh
# Define AWS account and credentials for CDK
export CDK_DEFAULT_ACCOUNT="123456781234"
export AWS_ACCESS_KEY_ID="[Your_Access_Key_ID]"
export AWS_SECRET_ACCESS_KEY="[Your_Secret_Access_Key]"

# Bootstrap the AWS account to prepare for CDK deployment
npm run cdk:bootstrap

# Deploy the application to AWS
npm run cdk:deploy
```

## File Naming Conventions

-   **React Files**: Use PascalCase (e.g. `MyComponent.jsx`) for React component files
-   **CSS, HTML and Assets**: Stick to kebab-case (e.g., `main-style.css`, `index.html`) for stylesheets, HTML documents, and asset files.
-   **CDK Files**: Follow kebab-case (e.g., cdk-stack.ts). This aligns with the default naming convention used by the [`cdk init`](https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk/README.md) command.
-   **Lambda Handler Files**: Employ camelCase (e.g., handleRequest.js) for Lambda function handlers.
