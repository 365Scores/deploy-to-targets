const CORE = require('@actions/core');
const fetch = require('node-fetch');
//const YAML = require('yaml');
const { EC2Client, RebootInstancesCommand } = require("@aws-sdk/client-ec2");
const { AutoScalingClient, StartInstanceRefreshCommand } = require("@aws-sdk/client-auto-scaling");


async function main() {
  try {
	
	
    //const env_key = CORE.getInput('env-key');
    //console.log('env-key: ' + env_key);
	//
	//// AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY
	////var ec2_client = new EC2({region: 'us-east-1', maxRetries: 3, apiVersion: '2014-10-01'});
	//try {
	//	var ec2_client = new EC2Client({region: 'my-aws-region'});
	//	
	//	const ec2_data = await ec2_client.send(new RebootInstancesCommand({
	//		InstanceIds: ['i-123456'],
	//		DryRun: true
	//	}));
	//	console.log("EC2 instance reboot - Success");
	//	console.log(ec2_data);
	//}
	//catch (error) {
	//	console.log(error);
    //}
	//
	//try {
	//	var asg_client = new AutoScalingClient({region: 'my-aws-region'});
	//	
	//	const asg_data = await asg_client.send(new StartInstanceRefreshCommand({
	//		AutoScalingGroupName: 'FooBar',
	//		Preferences: {
	//			InstanceWarmup: 360,
	//			MinHealthyPercentage: 30
	//		}
	//	}));
	//	console.log("ASG instance refresh - Success");
	//	console.log(asg_data);
	//}
	//catch (error) {
	//	console.log(error);
    //}
	//return;
    
    //const url = `https://api.spotinst.io/aws/ec2/group/sig-123456/roll?accountId=act-12345`;
	//var body = {
	//	batchSizePercentage: 25,
	//	gracePeriod: 360
	//};
	//const response = await fetch(url, {
    //    method: 'PUT',
	//	body: JSON.stringify(body),
    //    headers: {
	//		'Content-Type': 'application/json',
	//		'Authorization': 'bearer 987654321'
	//	}
    //});
    //
    //if (response.ok) {
  	//  const responseText = await response.text();
  	//  console.log(`success response: ${responseText}`);
    //}
    //else {
    //  const error = await response.text();
    //  CORE.setFailed(`An error has occured: ${error}`);
    //}
  }
  catch (error) {
    CORE.setFailed(error.message);
  }
}

main()