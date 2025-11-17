export const isCsvFile = (file: Express.Multer.File): boolean => {
  const csvMimeTypes = ['text/csv', 'application/csv', 'text/plain'];
  const csvExtensions = ['.csv'];

  return (
    csvMimeTypes.includes(file.mimetype) ||
    csvExtensions.some((ext) => file.originalname?.toLowerCase().endsWith(ext))
  );
};
