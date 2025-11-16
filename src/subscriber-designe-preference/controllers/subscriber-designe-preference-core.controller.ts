import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateOrUpdateSubscriberDesignePreferenceDto,
  CreateOrUpdateSubscriberDesignePreferenceResponseDto,
} from '../dto/create-or-update-subscriber-designe-preference.dto';
import {
  ValidateSubscriberDesignDto,
  ValidateSubscriberDesignResponseDto,
} from '../dto/validate-subscriber-design.dto';
import { SubscriberDesignePreferenceCoreService } from '../services/core';
import { SubscriberDesignePreferenceValidationService } from '../services/validation';

@Controller()
export class SubscriberDesignePreferenceCoreController {
  constructor(
    private readonly subscriberDesignePreferenceCoreService: SubscriberDesignePreferenceCoreService,
    private readonly subscriberDesignePreferenceValidationService: SubscriberDesignePreferenceValidationService,
  ) {}

  @GrpcMethod('SubscriberDesignePreferenceService', 'CreateOrUpdate')
  async createOrUpdate(
    data: CreateOrUpdateSubscriberDesignePreferenceDto,
  ): Promise<CreateOrUpdateSubscriberDesignePreferenceResponseDto> {
    return await this.subscriberDesignePreferenceCoreService.createOrUpdate(
      data,
    );
  }

  @GrpcMethod('SubscriberDesignePreferenceService', 'ValidateDesign')
  async validateDesign(
    data: ValidateSubscriberDesignDto,
  ): Promise<ValidateSubscriberDesignResponseDto> {
    return await this.subscriberDesignePreferenceValidationService.validateDesign(
      data.subscriberId,
    );
  }
}
