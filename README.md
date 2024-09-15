
# AWS Bedrock (Claude) OpenSearch Query Generator

This project demonstrates the use of AWS Bedrock (Claude) to process user prompts/intents and generate OpenSearch queries. It's built using AWS Amplify Gen 2 and NextJS.

## Prerequisites

- Node.js and npm installed
- AWS account with appropriate permissions
- AWS CLI configured with your credentials

## Installation

1. Clone the repository:
   ```
   git clone git@github.com:s-a-sureshkumar/Bedrock-Driven-OpenSearch.git
   cd Bedrock-Driven-OpenSearch
   ```

2. Install dependencies:
   ```
   npm install
   ```

## AWS Bedrock Configuration

Before running the application, it's crucial to configure AWS Bedrock with access to the Claude 3 Haiku model. Follow these steps:

1.  Go to the AWS Bedrock Model Access page in the us-east-1 region: [https://us-east-1.console.aws.amazon.com/bedrock/home?region=us-east-1#/modelaccess](https://us-east-1.console.aws.amazon.com/bedrock/home?region=us-east-1#/modelaccess)
2.  If you don't already have access, request model access for Anthropic -> Claude 3 Haiku.
3.  Wait for the access request to be approved. This process may take some time.
4.  Once access is granted, the Claude 3 Haiku model will be available for use in your application.

**Important**: The application will only work once you have been granted access to the Claude 3 Haiku model. Make sure this step is completed before proceeding to run the application.

## Running the Application

### Local Development

1. Start the Amplify sandbox:
   ```
   npx ampx sandbox
   ```

2. In a new terminal window, start the NextJS development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

### AWS Amplify Environment

To deploy the application to an AWS Amplify environment:

1. Create a new repository or fork this repository.
2. Go to the AWS Amplify Console (https://console.aws.amazon.com/amplify/create/repo-branch).
3. Follow the prompts to connect your repository and configure your app.
4. Amplify will automatically detect that this is an Amplify Gen 2 app and set up the necessary resources.

**Important**: By default, Amplify sets the build timeout to 30 minutes, which may not be sufficient to deploy the OpenSearch instance. To avoid deployment failures, adjust the timeout setting:

1. In your Amplify App, go to "Hosting" -> "Build Settings" -> "Build image settings".
2. Set the timeout to 120 minutes (the maximum allowed).

This extended timeout should provide enough time for the OpenSearch instance to deploy successfully.

For detailed instructions on deploying Amplify Gen 2 apps, refer to the [Additional Resources](#additional-resources) section below.

## Accessing the Application

After completing the sandbox deployment or Amplify environment setup (which may take some time due to OpenSearch instance deployment):

1. If running locally, run `npm run dev` to start the front-end application.
2. Access the app through your browser.

**Note**: The application is protected with AWS Cognito authentication. New users will need to register an account before logging in.

## Sample Data Seeding

Upon first login, users have the option to seed sample data to get started quickly. Please be aware that data seeding will incur additional costs.

### NFT Collection Sample Data Disclaimer

This application includes seed data featuring various NFT (Non-Fungible Token) collections like Bored Ape Yacht Club, Azuki, and others. Please note the following:

- **For Demonstration Purposes Only**: The seed data is provided exclusively for demo and testing purposes to showcase our AI-powered search feature.
- **No Affiliation or Endorsement**: We are not affiliated with, endorsed by, or officially connected with any NFT collections or their creators mentioned in the data.
- **No Ownership or Partnership**: The use of these collection names does not imply ownership, partnership, or promotional intent on our part.
- **Intellectual Property Rights**: All trademarks, logos, and collection names are the property of their respective owners.
- **No Investment Advice**: The presence of any NFT collections in this demo data should not be interpreted as financial or investment advice, nor as a recommendation to purchase any NFTs.
- **Data Accuracy and Scope**:
    - The seed data may not reflect current market conditions or up-to-date information on the collections.
    - NFT prices in this demo are randomly generated based on the floor and average prices of the collections.
    - Some NFTs are intentionally left without prices (indicating they are not listed), while others have prices randomly assigned for demonstration purposes.
    - The seed data includes only 100 tokens per collection for testing purposes.

## Important: Cost Considerations

⚠️ **Warning**: This application uses AWS OpenSearch service and includes data seeding, which can incur significant costs. Please be aware of the following:

1. Monitor your AWS usage and costs regularly.
2. Data seeding will incur additional costs.
3. After testing, make sure to destroy all created resources to avoid unexpected charges.

To delete resources in the local sandbox environment:

```
npx ampx sandbox delete
```

**Note**: If deletion protection is enabled for any resources, they may not be automatically deleted. In this case, check the AWS Console and manually delete any remaining resources to avoid ongoing charges.

## Additional Resources

For more detailed information on deploying and managing Amplify Gen 2 apps, please refer to the following resources:

- [Amplify Gen 2 Quickstart Guide](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/)
- [AWS Amplify Console](https://console.aws.amazon.com/amplify/create/add-repo)