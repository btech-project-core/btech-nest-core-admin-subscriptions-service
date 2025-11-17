import { Injectable, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UserValidationRresponseDto } from '../../../common/dto/user-validation.dto';
import { isExcelFile } from '../../../common/helpers/is-excel-file.helper';
import { isCsvFile } from '../../../common/helpers/is-csv-file.helper';
import { validateUserExcel } from '../../../common/helpers/excel-document-validation.helper';
import { validateUserCsv } from '../../../common/helpers/csv-document-validation.helper';

@Injectable()
export class SubscriptionsValidateUserDocumentService {
  async validateUserDocument(
    file: Express.Multer.File,
  ): Promise<UserValidationRresponseDto> {
    if (!file)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Archivo no proporcionado',
      });
    // Detectar tipo de archivo por extensión o MIME type
    const isExcel = isExcelFile(file);
    const isCsv = isCsvFile(file);
    if (!isExcel && !isCsv)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message:
          'Formato de archivo no soportado. Use Excel (.xlsx, .xls) o CSV (.csv)',
      });
    if (isExcel) return validateUserExcel(file);
    return validateUserCsv(file);
  }
}
