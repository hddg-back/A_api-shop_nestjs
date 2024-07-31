import { v4 as uuid } from 'uuid';

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: (error: any, nameFile: string) => void,
) => {
  if (!file) return cb(new Error('File empty'), '');

  const extensionFile = file.mimetype.split('/')[1];
  const fileName = `${uuid()}.${extensionFile}`;
  cb(null, fileName);
};
