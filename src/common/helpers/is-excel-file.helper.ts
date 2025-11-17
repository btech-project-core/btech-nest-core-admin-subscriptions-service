export const isExcelFile = (file: Express.Multer.File): boolean => {
  const excelMimeTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];
  const excelExtensions = ['.xlsx', '.xls'];

  return (
    excelMimeTypes.includes(file.mimetype) ||
    excelExtensions.some((ext) =>
      file.originalname?.toLowerCase().endsWith(ext),
    )
  );
};
