# Health Declaration App - Backend

## Tech stack
- Database: MongoDB
- Programming Language: NodeJS
- Libraries: Mongoose
- IaC: Terraform
- Cloud Services: AWS, MongoDB Atlas

## Notes
Since this backend is cloud based (in AWS and MongoDB Atlas), you will not be able to run this in local environment.

However, if you have the AWS cli configured and MongoDB credentials, you should be able to deploy this repo using terraform.

Steps:

- Setup AWS CLI
- Setup database admin access on your desired `MongoDB Atlas` cluster
- Export the credentials as shown in `example_export.sh`

- Install dependencies by running `install_dependencies.sh`

- Run `terraform init` from the root level of the directory
- Run `terraform apply` to deploy the resources.