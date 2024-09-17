## Configure key untuk masing masing profile 
 >aws configure set aws_access_key_id <value for aws_access_key_id>  --profile kairos-development 
 >aws configure set aws_secret_access_key <value for aws_secret_access_key>  --profile kairos-development 
 >aws configure set region <value for region>  --profile kairos-development 
 >aws configure set output <value for output>  --profile kairos-development
 
 >aws configure set aws_access_key_id <value for aws_access_key_id>  --profile kairos-staging 
 >aws configure set aws_secret_access_key <value for aws_secret_access_key>  --profile kairos-staging 
 >aws configure set region <value for region>  --profile kairos-staging 
 >aws configure set output <value for output>  --profile kairos-staging
 
 >aws configure set aws_access_key_id <value for aws_access_key_id>  --profile kairos-preproduction 
 >aws configure set aws_secret_access_key <value for aws_secret_access_key>  --profile kairos-preproduction 
 >aws configure set region <value for region>  --profile kairos-preproduction 
 >aws configure set output <value for output>  --profile kairos-preproduction

## Check profile list  
 >type %UserProfile%\.aws\credentials

Output:
```[default]
aws_access_key_id = <value>
aws_secret_access_key = <value>
[kairos-development]
aws_access_key_id = <value>
aws_secret_access_key = <value>
[kairos-staging]
aws_access_key_id = <value>
aws_secret_access_key = <value>
[kairos-preproduction]
aws_access_key_id = <value>
aws_secret_access_key = <value>
[kairos-production]
aws_access_key_id = <value>
aws_secret_access_key = <value>```

## Set AWS Default Profile (for global usage) 
 >setx AWS_DEFAULT_PROFILE kairos-staging
Output:  
```SUCCESS: Specified value was saved.```

## Check Current Profile 
 >aws configure list
Output: 
```Name                    Value          Type    Location
----                    -----          ----    --------
profile        kairos-staging          env    ['AWS_PROFILE', 'AWS_DEFAULT_PROFILE']```

## Change AWS Profile temporary (per terminal) 
 >set AWS_PROFILE=kairos-preproduction

## Check Current Profile 
 >aws configure list
Output: 
```Name                    Value          Type    Location
----                    -----          ----    --------
profile    kairos-preproduction        env    ['AWS_PROFILE', 'AWS_DEFAULT_PROFILE']```

## Quick Change profile from Win + R
1. Copy file inside ./System32 folder to C:/Windows/System32
2. Relogin your windows
3. Press Win + R and type `aws-development` to quickly change profile