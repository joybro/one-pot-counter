# OnePot Counter

Welcome to the OnePot Counter project! This web application exemplifies the integration of React with AWS services using the Cloud Development Kit (CDK). Designed as an intuitive starting point, it demonstrates best practices in setup and configuration, ideal for similar future projects.

## Live Demo

Explore the live version of OnePot Counter [here](https://d252xm6a9k7j8o.cloudfront.net/).

## Getting Started

### Setting Up and Deploying with AWS CDK

Begin by configuring your AWS environment for the CDK. This involves setting up environment variables to guide the CDK CLI for deploying changes.

```sh
# Define AWS account and credentials for CDK
export CDK_DEFAULT_ACCOUNT="123456781234"
export AWS_ACCESS_KEY_ID="[Your_Access_Key_ID]"
export AWS_SECRET_ACCESS_KEY="[Your_Secret_Access_Key]"

# Bootstrap the AWS account for CDK deployment
npm run cdk:bootstrap

# Deploy the application to AWS
npm run cdk:deploy
```

## Technology Stack

This project demonstrates a streamlined integration of key technologies:

-   **React**: For building the user interface.
-   **React Scripts**: Simplifies setup and workflow as part of the create-react-app toolkit.
-   **TypeScript**: Adds static typing to JavaScript for improved code quality.
-   **Tailwind CSS**: A utility-first CSS framework for efficient and responsive design.
-   **AWS Cloud Development Kit (CDK)**: Facilitates cloud infrastructure management with code-defined resources and deployment.
-   **ESBuild**: A fast bundler and minifier, used for efficiently bundling Lambda handlers, enhancing deployment speed.

## CDK Stacks

The project is structured into four distinct CDK stacks:

1. **Content Delivery Stack**
    - **Purpose**: Manages resources for content delivery and request routing.
    - **Resources**:
        - **CloudFront Distribution**: Serves content from the S3 bucket and routes API requests to API Gateway.
        - **S3 Bucket**: Stores web assets.
2. **API Stack**
    - **Purpose**: Handles backend API infrastructure.
    - **Resources**:
        - **API Gateway**: Manages and routes API requests.
        - **Lambda Functions**: Backend logic triggered by API Gateway.
3. **Data Persistence Stack**
    - **Purpose**: Manages data storage.
    - **Resources**:
        - **DynamoDB Table**: Stores the counter data.
4. **Authentication Stack**
    - **Purpose**: Manages user authentication and authorization.
    - **Resources**:
        - **Cognito User Pool**: Configured with Google as an identity provider.

## File Naming Conventions

-   **React Files**: Use PascalCase (e.g. `MyComponent.jsx`) for React component files
-   **CSS, HTML and Assets**: Stick to kebab-case (e.g., `main-style.css`, `index.html`) for stylesheets, HTML documents, and asset files.
-   **CDK Files**: Follow kebab-case (e.g., cdk-stack.ts). This aligns with the default naming convention used by the [`cdk init`](https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk/README.md) command.
-   **Lambda Handler Files**: Employ camelCase (e.g., handleRequest.js) for Lambda function handlers.
