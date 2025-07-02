export const NEWSLETTER_SUBSCRIPTION_MUTATION = `#graphql
  mutation customerEmailMarketingSubscribe($email: String!) {
    customerEmailMarketingSubscribe(email: $email) {
      customerUserErrors {
        message
      }
    }
  }
` as const;
