import { ExcelUserDto } from '../dto/excel-user.dto';
import {
  checkDuplicates,
  validateDocumentNumber,
  validateEmail,
  validatePhone,
  validateRole,
  validateUsername,
} from './excel-validation.helper';

export const validateRowData = (
  data: ExcelUserDto,
  rowNumber: number,
): string[] => {
  const errors: string[] = [];

  // Campos obligatorios
  const requiredFields = [
    { field: data.documentNumber, name: 'NUMERO DE IDENTIDAD' },
    { field: data.paternalSurname, name: 'PATERNO' },
    { field: data.maternalSurname, name: 'MATERNO' },
    { field: data.name, name: 'NOMBRES' },
    { field: data.email, name: 'CORREO' },
    { field: data.phone, name: 'TELEFONO' },
    { field: data.username, name: 'NOMBRE DE USUARIO' },
  ];

  requiredFields.forEach(({ field, name }) => {
    if (!field) errors.push(`Fila ${rowNumber}: ${name} es obligatorio`);
  });

  // Validaciones específicas
  if (data.documentNumber && !validateDocumentNumber(data.documentNumber))
    errors.push(`Fila ${rowNumber}: Número de identidad inválido`);

  if (data.email && !validateEmail(data.email))
    errors.push(`Fila ${rowNumber}: Email inválido`);

  if (data.phone && !validatePhone(data.phone))
    errors.push(`Fila ${rowNumber}: Teléfono inválido`);

  if (data.username && !validateUsername(data.username))
    errors.push(`Fila ${rowNumber}: Nombre de usuario inválido`);

  if (isNaN(data.role))
    errors.push(`Fila ${rowNumber}: Rol debe ser un número`);
  if (!validateRole(data.role))
    errors.push(`Fila ${rowNumber}: Rol debe ser 1 (ADMIN) o 2 (CLIENT)`);

  return errors;
};

export const validateDuplicates = (validRows: ExcelUserDto[]): string[] => {
  const duplicateErrors: string[] = [];

  const documentDuplicates = checkDuplicates(
    validRows,
    (row) => row.documentNumber,
  );
  duplicateErrors.push(
    ...documentDuplicates.map((error) => `Documento ${error}`),
  );

  const emailDuplicates = checkDuplicates(validRows, (row) => row.email);
  duplicateErrors.push(...emailDuplicates.map((error) => `Email ${error}`));

  const phoneDuplicates = checkDuplicates(validRows, (row) => row.phone);
  duplicateErrors.push(...phoneDuplicates.map((error) => `Teléfono ${error}`));

  const usernameDuplicates = checkDuplicates(validRows, (row) => row.username);
  duplicateErrors.push(
    ...usernameDuplicates.map((error) => `Usuario ${error}`),
  );

  return duplicateErrors;
};
