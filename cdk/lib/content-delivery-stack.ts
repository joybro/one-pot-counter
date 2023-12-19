import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { HttpOrigin, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Construct } from "constructs";

interface ContentDeliverStackProps extends cdk.StackProps {
    contentBucket: s3.Bucket;
    enableLogging?: boolean;
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
                /*origin: new HttpOrigin(
                    "mfe-remotehostingstack-frontendassetbucket6d583b88-6sxigc0bghqt.s3-website-us-east-1.amazonaws.com",
                    {
                        // This is needed as S3 website endpoints don't support HTTPS
                        protocolPolicy:
                            cloudfront.OriginProtocolPolicy.HTTP_ONLY,
                    }
                ),*/
                viewerProtocolPolicy:
                    cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
            // Configure logging if enabled
            logBucket: logBucket,
            logIncludesCookies: true,
        });
    }
}
