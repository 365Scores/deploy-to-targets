const CORE = require('@actions/core');
const YAML = require('yaml');
const fs = require('fs');
const fetch = require('node-fetch');
const { EC2Client, RebootInstancesCommand } = require("@aws-sdk/client-ec2");
const { AutoScalingClient, StartInstanceRefreshCommand } = require("@aws-sdk/client-auto-scaling");
const { ECSClient, UpdateServiceCommand } = require("@aws-sdk/client-ecs");

// inputs
const env_key = CORE.getInput('env-key');
const spot_io_token = CORE.getInput('spot_io_token');

async function deployTo__ec2_instance(target) {
  try {
	
	var region = target['region'];
	var instanceId = target['id'];
	var error = false;
	
	if (!region) {
		CORE.setFailed(`ec2-instance target is missing region`);
		error = true;
	}
	if (!instanceId) {
		CORE.setFailed(`ec2-instance target is missing id`);
		error = true;
	}
	if (error) { return; }
	
	var ec2_client = new EC2Client({region: region});
	const ec2_data = await ec2_client.send(new RebootInstancesCommand({
		InstanceIds: [instanceId],
		DryRun: false
	}));
	console.log(`EC2 instance ${instanceId} reboot - Success`);
	//console.log(ec2_data);
  }
  catch (error) {
    CORE.setFailed(error);
  }
}

async function deployTo__ec2_asg(target) {
  try {
	
	var region = target['region'];
	var name = target['name'];
	var instanceWarmup = target['instance-warmup'];
	var minHealthyPercentage = target['min-healthy-percentage'];
	var error = false;
	
	if (!region) {
		CORE.setFailed(`ec2-asg target is missing region`);
		error = true;
	}
	if (!name) {
		CORE.setFailed(`ec2-asg target is missing name`);
		error = true;
	}
	if (!instanceWarmup) {
		CORE.setFailed(`ec2-asg target is missing instance-warmup`);
		error = true;
	}
	else if (!Number(instanceWarmup)) {
		CORE.setFailed(`ec2-asg target has invalid instance-warmup`);
		error = true;
	}
	if (!minHealthyPercentage) {
		CORE.setFailed(`ec2-asg target is missing min-healthy-percentage`);
		error = true;
	}
	else if (!Number(minHealthyPercentage)) {
		CORE.setFailed(`ec2-asg target has invalid min-healthy-percentage`);
		error = true;
	}
	if (error) { return; }
	
	var asg_client = new AutoScalingClient({region: region});
	const asg_data = await asg_client.send(new StartInstanceRefreshCommand({
		AutoScalingGroupName: name,
		Preferences: {
			InstanceWarmup: Number(instanceWarmup),
			MinHealthyPercentage: Number(minHealthyPercentage)
		}
	}));
	console.log(`ASG ${name} instance refresh - Success`);
	//console.log(asg_data);
  }
  catch (error) {
    CORE.setFailed(error);
  }
}

async function deployTo__ecs_service(target) {
  try {
	
	var region = target['region'];
	var clusterName = target['cluster-name'];
	var serviceName = target['service-name'];
	var error = false;
	
	if (!region) {
		CORE.setFailed(`ecs-service target is missing region`);
		error = true;
	}
	if (!clusterName) {
		CORE.setFailed(`ecs-service target is missing cluster-name`);
		error = true;
	}
	if (!serviceName) {
		CORE.setFailed(`ecs-service target is missing service-name`);
		error = true;
	}
	if (error) { return; }
	
	var asg_client = new ECSClient({region: region});
	const asg_data = await asg_client.send(new UpdateServiceCommand({
		cluster: clusterName,
		service: serviceName,
		forceNewDeployment: true
	}));
	console.log(`ECS service ${serviceName} deployment - Success`);
	//console.log(asg_data);
  }
  catch (error) {
    CORE.setFailed(error);
  }
}

async function deployTo__spotinst_eg(target) {
  try {
	
	var id = target['id'];
	var accountId = target['account-id'];
	var batchSizePercentage = target['batch-size-percentage'];
	var gracePeriod = target['grace-period'];
	var error = false;
	
	if (!id) {
		CORE.setFailed(`spotinst-eg target is missing id`);
		error = true;
	}
	if (!accountId) {
		CORE.setFailed(`spotinst-eg target is missing account-id`);
		error = true;
	}
	if (!batchSizePercentage) {
		CORE.setFailed(`spotinst-eg target is missing batch-size-percentage`);
		error = true;
	}
	else if (!Number(batchSizePercentage)) {
		CORE.setFailed(`spotinst-eg target has invalid batch-size-percentage`);
		error = true;
	}
	if (!gracePeriod) {
		CORE.setFailed(`spotinst-eg target is missing grace-period`);
		error = true;
	}
	else if (!Number(gracePeriod)) {
		CORE.setFailed(`spotinst-eg target has invalid grace-period`);
		error = true;
	}
	if (error) { return; }
	
	const url = `https://api.spotinst.io/aws/ec2/group/${id}/roll?accountId=${accountId}`;
	var body = {
		batchSizePercentage: Number(batchSizePercentage),
		gracePeriod: Number(gracePeriod)
	};
	const response = await fetch(url, {
        method: 'PUT',
		body: JSON.stringify(body),
        headers: {
			'Content-Type': 'application/json',
			'Authorization': `bearer ${spot_io_token}`
		}
    });
    
    if (response.ok) {
	  console.log(`Spotinst EG ${id} roll - Success`);
	  //console.log(response.text());
    }
    else {
      const error = await response.text();
      CORE.setFailed(`An error has occured: ${error}`);
    }
  }
  catch (error) {
    CORE.setFailed(error);
  }
}

async function deployToTarget(target) {
  try {
	
	if (!target) { return; }
	
	const targetType = target['type'];
	
	if (!targetType) {
		CORE.setFailed(`target is missing type`);
		return;
	}
	
	switch(targetType) {
      case "ec2-instance":
        await deployTo__ec2_instance(target);
        break;
      case "ec2-asg":
        await deployTo__ec2_asg(target);
        break;
      case "ecs-service":
        await deployTo__ecs_service(target);
        break;
      case "spotinst-eg":
        await deployTo__spotinst_eg(target);
        break;
      default:
        CORE.setFailed(`target type '${targetType}' is not supported`);
    }
  }
  catch (error) {
    CORE.setFailed(error);
  }
}

async function main() {
  try {
	
    //console.log(`env_key ${env_key}, spot_io_token ${spot_io_token}`);
	
	const file = fs.readFileSync('.automation/deployment_envs.yaml', 'utf8');
	var yamlObj = YAML.parse(file);
	var envs = yamlObj['envs'];
	var requested_env = envs[env_key];
	if (!requested_env) {
		CORE.setFailed(`requested env (${env_key}) is missing`);
		return;
	}
	
	var targets = requested_env['targets'];
	if (targets && targets.length > 0) {
		console.log(`${env_key} has ${targets.length} targets`);
		targets.forEach(deployToTarget);
	}
  }
  catch (error) {
    CORE.setFailed(error);
  }
}

main();