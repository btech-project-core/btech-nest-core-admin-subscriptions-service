/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ExcelUserDto } from '../dto/excel-user.dto';
import { UserValidationRresponseDto } from '../dto/user-validation.dto';
import {
  validateRowData,
  validateDuplicates,
} from './document-row-validation.helper';

export const validateUserCsv = (
  file: Express.Multer.File,
): UserValidationRresponseDto => {
  const csvContent = file.buffer.toString('utf-8');
  const lines = csvContent.split('\n').filter((line) => line.trim());

  if (lines.length === 0) {
    throw new RpcException({
      status: HttpStatus.BAD_REQUEST,
      message: 'El archivo CSV está vacío',
    });
  }

  // Validar encabezados
  const headers = parseCsvLine(lines[0]);
  validateCsvHeaders(headers);

  const { validRows, errors } = processCsvRows(lines);
  return {
    isValid: errors.length === 0,
    errorCount: errors.length,
    ...(errors.length === 0 ? { validUsers: validRows } : { errors }),
  };
};

export const parseCsvLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ';' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current.trim());
  return result;
};

export const validateCsvHeaders = (headers: string[]): void => {
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

  const missingHeaders = expectedHeaders.filter(
    (header) =>
      !headers.some(
        (actual) => actual?.toString().trim().toUpperCase() === header,
      ),
  );

  if (missingHeaders.length > 0)
    throw new RpcException({
      status: HttpStatus.BAD_REQUEST,
      message: `Encabezados faltantes en CSV: ${missingHeaders.join(', ')}`,
    });
};

export const processCsvRows = (
  lines: string[],
): {
  validRows: ExcelUserDto[];
  errors: string[];
} => {
  const validRows: ExcelUserDto[] = [];
  const allRows: ExcelUserDto[] = [];
  const errors: string[] = [];

  // Saltar la primera línea (encabezados)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Saltar líneas vacías

    const rowNumber = i + 1;
    try {
      const fields = parseCsvLine(line);
      const rowData = extractCsvRowData(fields);
      allRows.push(rowData);

      const rowErrors = validateRowData(rowData, rowNumber);
      if (rowErrors.length === 0) {
        validRows.push(rowData);
      } else {
        errors.push(...rowErrors);
      }
    } catch (error) {
      errors.push(
        `Fila ${rowNumber}: Error al procesar la línea - ${error.message}`,
      );
    }
  }

  // Validar duplicados en TODAS las filas
  if (allRows.length > 0) {
    errors.push(...validateDuplicates(allRows));
  }

  return { validRows, errors };
};

export const extractCsvRowData = (fields: string[]): ExcelUserDto => {
  return {
    documentNumber: (fields[0] || '').trim(),
    paternalSurname: (fields[1] || '').trim(),
    maternalSurname: (fields[2] || '').trim(),
    name: (fields[3] || '').trim(),
    email: (fields[4] || '').trim(),
    phone: (fields[5] || '').trim(),
    username: (fields[6] || '').trim(),
    role: parseRoleFromCsv(fields[7] || ''),
  };
};

export const parseRoleFromCsv = (roleValue: string): number => {
  const trimmed = roleValue.trim();
  const parsed = parseFloat(trimmed);
  return isNaN(parsed) ? NaN : parsed;
};
