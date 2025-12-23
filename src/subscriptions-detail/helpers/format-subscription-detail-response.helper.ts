import { SubscriptionDetail } from '../entities/subscription-detail.entity';
import { FindAllSubscriptionDetailResponseDto } from '../dto/find-all-subscription-detail.dto';

export const formatSubscriptionDetailResponse = (
  subscriptionDetail: SubscriptionDetail,
): FindAllSubscriptionDetailResponseDto => ({
  subscriptionDetailId: subscriptionDetail.subscriptionDetailId,
  initialDate: subscriptionDetail.initialDate,
  finalDate: subscriptionDetail.finalDate,
  subscriptionServiceId: subscriptionDetail.subscriptionsService.subscriptionsServiceId,
  subscriptionServiceData: {
    code: subscriptionDetail.subscriptionsService.code,
    description: subscriptionDetail.subscriptionsService.description,
  },
});
