import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

export class WebHostingStack extends cdk.Stack {
    public readonly assetBucket: s3.Bucket;

    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        // Define the S3 bucket for hosting the web assets
        this.assetBucket = new s3.Bucket(this, "WebAssetBucket", {
            websiteIndexDocument: "index.html",
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            // TODO - Block public access and restrict to CloudFront only
            publicReadAccess: true,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
        });

        // Deploy the web assets to the S3 bucket
        new s3Deploy.BucketDeployment(this, "DeployWebAsset", {
            sources: [s3Deploy.Source.asset("../build")],
            destinationBucket: this.assetBucket,
        });

        // Output the bucket name
        new cdk.CfnOutput(this, "WebAssetBucketName", {
            value: this.assetBucket.bucketName,
        });

        // This URL is referred to by the API stack.
        // Exporting this value ensures that the reference can be safely deleted if no longer needed.
        this.exportValue(this.assetBucket.bucketWebsiteUrl);
    }
}
