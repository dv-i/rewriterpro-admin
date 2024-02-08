import Stripe from "stripe";

class StripeUtil {
	private readonly stripe: Stripe;

	constructor(apiKey: string) {
		this.stripe = new Stripe(apiKey, {
			apiVersion: "2023-10-16",
		});
	}

	async getCustomerSubscriptionsByEmail(
		email: string
	): Promise<Stripe.Subscription[]> {
		try {
			const customers = await this.stripe.customers.list({
				email,
				limit: 1, // Limit the result to 1 customer (since email should be unique)
				expand: ["data.subscriptions"], // Expand the 'subscriptions' field
			});

			if (customers.data.length === 0) {
				return [];
			}

			// Extract and return the subscriptions from the customer data
			const customer = customers.data[0];
			// console.log(customer);
			return customer.subscriptions?.data || [];
		} catch (error) {
			console.error(
				`Error fetching customer subscriptions for email - ${email}`,
				error
			);
			throw error;
		}
	}

	async cancelSubscription(
		subscriptionId: string
	): Promise<Stripe.Subscription> {
		try {
			const subscription = await this.stripe.subscriptions.update(
				subscriptionId,
				{
					cancel_at_period_end: true,
				}
			);
			return subscription;
		} catch (error) {
			console.error(
				`Error canceling subscription - ${subscriptionId}`,
				error
			);
			throw error;
		}
	}
}

export default StripeUtil;
