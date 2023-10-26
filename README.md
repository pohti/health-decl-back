# Health Declaration App - Backend

## Tech stack
- <b>Database:</b> MongoDB
- <b>Programming Language:</b> NodeJS
- <b>Libraries:</b> Mongoose
- <b>IaC:</b> Terraform
- <b>Cloud Services:</b> AWS, MongoDB Atlas

## Notes
Source code for lambda functions can be found in `src/` directory.

Since this backend is cloud-based (in AWS and MongoDB Atlas), you will not be able to run this in local environment.

However, if you have the AWS CLI configured and MongoDB credentials, you should be able to deploy this repo using `terraform`.


> Find out how to install `terraform` from [here](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)




## Steps to Deploy

- Setup AWS CLI
- Create db user on your desired `MongoDB Atlas` cluster
- Export the credentials as shown in `example_export.sh`

- Install dependencies by running `install_dependencies.sh`

- Run `terraform init` from the root level of the directory
- Run `terraform apply` to deploy the resources.


## Tests

- <b>Library:</b> Jest v29.7.0
- <b>Directory:</b> test/
How to run: 
```bash
    cd tests
    npm run test
```

Since it is troublesome to mock the lambda function behavior,
instead of testing the entire functions, I have written unit tests for the sub/utility functions.