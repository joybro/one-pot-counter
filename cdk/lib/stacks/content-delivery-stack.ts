import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

interface ContentDeliverStackProps extends cdk.StackProps {
    enableLogging?: boolean;
}
export class ContentDeliveryStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: ContentDeliverStackProps) {
        super(scope, id, props);

        // Define the S3 bucket for hosting the web assets
        const assetBucket = new s3.Bucket(this, "WebAssetBucket", {
            websiteIndexDocument: "index.html",
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            // TODO - Block public access and restrict to CloudFront only
            publicReadAccess: true,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
        });

        // Deploy the web assets to the S3 bucket
        new s3Deploy.BucketDeployment(this, "DeployWebAsset", {
            sources: [s3Deploy.Source.asset("../build")],
            destinationBucket: assetBucket,
        });

        // Output the bucket name
        new cdk.CfnOutput(this, "WebAssetBucketName", {
            value: assetBucket.bucketName,
        });

        // Create S3 bucket for CloudFront logs if logging is enabled
        let logBucket: s3.Bucket | undefined;
        if (props.enableLogging) {
            logBucket = new s3.Bucket(this, "CloudFrontLogBucket", {
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                autoDeleteObjects: true,
                // This is to enable ACLs and allow CloudFront to write logs
                // ACLs are deprecated, but CloudFront still requires them
                // https://github.com/aws/aws-cdk/issues/25291
                objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,
            });
        }

        // Create CloudFront distribution
        new cloudfront.Distribution(this, "Distribution", {
            defaultBehavior: {
                origin: new S3Origin(assetBucket),
                viewerProtocolPolicy:
                    cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
            // Configure logging if enabled
            logBucket: logBucket,
            logIncludesCookies: true,
        });
    }
}
