/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as ExcelJS from 'exceljs';
import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ExcelUserDto } from '../dto/excel-user.dto';
import { UserValidationRresponseDto } from '../dto/user-validation.dto';
import {
  validateRowData,
  validateDuplicates,
} from './document-row-validation.helper';

export const validateUserExcel = async (
  file: Express.Multer.File,
): Promise<UserValidationRresponseDto> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file.buffer as any);
  const worksheet = workbook.worksheets[0];
  validateHeaders(worksheet);

  const { validRows, errors } = processRows(worksheet);
  return {
    isValid: errors.length === 0,
    errorCount: errors.length,
    ...(errors.length === 0 ? { validUsers: validRows } : { errors }),
  };
};

export const validateHeaders = (worksheet: ExcelJS.Worksheet): void => {
  const expectedHeaders = [
    'NUMERO DE IDENTIDAD',
    'PATERNO',
    'MATERNO',
    'NOMBRES',
    'CORREO',
    'TELEFONO',
    'NOMBRE DE USUARIO',
    'ROL',
  ];

  const actualHeaders = worksheet.getRow(1).values as string[];
  const missingHeaders = expectedHeaders.filter(
    (header) =>
      !actualHeaders.some((actual) => actual?.toString().trim() === header),
  );

  if (missingHeaders.length > 0)
    throw new RpcException({
      status: HttpStatus.BAD_REQUEST,
      message: `Encabezados faltantes: ${missingHeaders.join(', ')}`,
    });
};

export const processRows = (
  worksheet: ExcelJS.Worksheet,
): {
  validRows: ExcelUserDto[];
  errors: string[];
} => {
  const validRows: ExcelUserDto[] = [];
  const allRows: ExcelUserDto[] = [];
  const errors: string[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;

    const rowData = extractRowData(row);
    allRows.push(rowData);

    const rowErrors = validateRowData(rowData, rowNumber);
    if (rowErrors.length === 0) {
      validRows.push(rowData);
    } else {
      errors.push(...rowErrors);
    }
  });

  // Validar duplicados en TODAS las filas, no solo las válidas
  if (allRows.length > 0) {
    errors.push(...validateDuplicates(allRows));
  }

  return { validRows, errors };
};

export const extractRowData = (row: ExcelJS.Row): ExcelUserDto => {
  return {
    documentNumber: getCellValue(row, 1),
    paternalSurname: getCellValue(row, 2),
    maternalSurname: getCellValue(row, 3),
    name: getCellValue(row, 4),
    email: getCellValue(row, 5),
    phone: getCellValue(row, 6),
    username: getCellValue(row, 7),
    role: getCellValueAsNumber(row, 8),
  };
};

export const getCellValue = (row: ExcelJS.Row, column: number): string => {
  const value = row.getCell(column).value;

  if (value === null || value === undefined) return '';

  // Manejar hipervínculo (emails que Excel convierte automáticamente)
  if (typeof value === 'object' && value !== null) {
    if ('text' in value) return (value as any).text.toString().trim();
    if ('result' in value) return (value as any).result.toString().trim();
    return '';
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return value.toString().trim();
  }

  return '';
};

export const getCellValueAsNumber = (
  row: ExcelJS.Row,
  column: number,
): number => {
  const value = row.getCell(column).value;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || NaN;
  return NaN;
};
