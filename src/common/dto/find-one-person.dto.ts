export class FindOnePersonDto {
  personId: string;
}

export class FindOnePersonResponseDto {
  personId: string;
  documentNumber: string;
  isActive: boolean;
  personInformation: PersonInformationResponseDto[];
  documentIdentityType: DocumentIdentityTypeResponseDto;
}

export class PersonInformationResponseDto {
  personInformationId: string;
  description: string;
  informationType: InformationTypeResponseDto;
}

export class InformationTypeResponseDto {
  informationTypeId: string;
  description: string;
}

export class DocumentIdentityTypeResponseDto {
  documentIdentityTypeId: string;
  description: string;
  abbreviation: string;
}
