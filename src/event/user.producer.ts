import { EXCHANGES, RabbitMQ, ROUTING_KEYS, UserRegisteredEvent } from '@Pick2Me/shared';

const url = process.env.RABBIT_URL!;

export class UserEventProducer {
  // create user wallet in payment service
  static async publishUserCreatedEvent(user: UserRegisteredEvent) {
    await RabbitMQ.connect({ url, serviceName: 'user-service' });
    await RabbitMQ.setupExchange(EXCHANGES.USER, 'topic');

    const userWalletResterPayload = {
      data: { ...user },
      type: ROUTING_KEYS.USER_WALLET_CREATE,
    };

    await RabbitMQ.publish(
      EXCHANGES.USER,
      ROUTING_KEYS.USER_WALLET_CREATE,
      userWalletResterPayload
    );
    console.log(`[UserService] 📤 Published wallet.created → ${user.userId}`);
  }

  //add reward amount to user wallet in payment service
  static async addedRewardAmount(userId: string) {
    await RabbitMQ.connect({ url, serviceName: 'user-service' });
    await RabbitMQ.setupExchange(EXCHANGES.USER, 'topic');

    const addedRewardAmountPayload = {
      data: userId,
      type: ROUTING_KEYS.USER_ADDED_REWARD_AMOUNT,
    };

    await RabbitMQ.publish(
      EXCHANGES.USER,
      ROUTING_KEYS.USER_ADDED_REWARD_AMOUNT,
      addedRewardAmountPayload
    );
    console.log(`[UserService] 📤 Published addedRewardAmount → ${userId}`);
  }
}
