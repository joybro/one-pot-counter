import * as cdk from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { RestApiOrigin, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

interface ContentDeliverStackProps extends cdk.StackProps {
    contentBucket: s3.Bucket;
    enableLogging?: boolean;
    api: RestApi;
}
export class ContentDeliveryStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: ContentDeliverStackProps) {
        super(scope, id, props);

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
                origin: new S3Origin(props.contentBucket),
                viewerProtocolPolicy:
                    cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
            additionalBehaviors: {
                "/api/*": {
                    origin: new RestApiOrigin(props.api),
                    viewerProtocolPolicy:
                        cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
                    originRequestPolicy:
                        cloudfront.OriginRequestPolicy
                            .ALL_VIEWER_EXCEPT_HOST_HEADER,
                    allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
                },
            },
            // Configure logging if enabled
            logBucket: logBucket,
            logIncludesCookies: true,
        });
    }
}
