export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: (error: any, accepted: boolean) => void,
) => {
  if (!file) return cb(new Error('File empty'), false);

  const extensionFile = file.mimetype.split('/')[1];
  const validExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'gif'];

  if (validExtensions.includes(extensionFile)) cb(null, true);
};
