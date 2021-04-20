# deploy-to-targets
deploy to predefined targets (defined in a config file in your repository)

## Inputs

### `env-key`

**Required** environemnt key (from configuration file).

### `spot_io_token`

**Optional** Sopt.io access token. required for Spot.io targets.

## configuration instructions
The configurations need to be in the file "/.automation/deployment_envs.yaml" (in your repo)
Example file:
```
envs:  
  qa:
    targets:
    - type: ec2-instance
      region: us-west-1
      id: i-123456789
      
    - type: ec2-asg
      region: us-east-1
      name: MyAutoScalingGroupName
      instance-warmup: 360
      min-healthy-percentage: 30
      
    - type: ecs-service
      region: us-east-1
      cluster-name: MyCluster
      service-name: ServiceInCluster
      
    - type: spotinst-eg
      id: sig-12345
      account-id: act-12345
      batch-size-percentage: 25
      grace-period: 360
```

### Target: `ec2-instance`

Reboots an EC2 instance.

Properties:

`region` - AWS region

`id` - AWS EC2 instance id

### Target: `ec2-asg`

Starts an instance refresh for an EC2 Auto Scaling Group.

Properties:

`region` - AWS region

`name` - AWS EC2 Auto Scaling Group name

`instance-warmup` - How much time it takes a newly launched instance to be ready to use (in seconds).

`min-healthy-percentage` - At least this percentage of the desired capacity of the Auto Scaling group must remain healthy during this operation to allow it to continue.

### Target: `ecs-service`

Starts a new deployment for an ECS service.

Properties:

`region` - AWS region

`cluster-name` - AWS ECS Cluster of the service. Use the cluster's name or ARN.

`service-name` - The name of the service to deploy.

### Target: `spotinst-eg`

Starts a roll of a Spotinst elastic group.

Properties:

`id` - AWS region

`account` - AWS EC2 Auto Scaling Group name

`batch-size-percentage` - Precentage of servers that will be rolled in every batch.

`grace-period` - How much time it takes a newly launched instance to be ready to use (in seconds).

## Example usage in a workflow

```
uses: 365scores/deploy-to-targets@v0
with:
  env-key: 'qa'
  spot_io_token: ${{ secrets.SPOT_IO_TOKEN }}
```
