import * as fs from 'fs';
interface GalleryType {
  files: {
    img: Express.Multer.File[];
  };
}
export const gallery = ({ files }: GalleryType) =>
  files.img ? files.img.map((img) => ({ img: pathToFile(img) })) : [];

export const pathToFile = (file: Express.Multer.File): string => {
  const regex = /[\\/]+/;
  const paths = file.destination.split(regex);
  const returnedPath = `${paths[paths.length - 2]}/${paths[paths.length - 1]}/${
    file.filename
  }`;
  return returnedPath;
};

export const removeFileIfExist = (path: string) => {
  console.log(`uploads/${path}`);

  if (fs.existsSync(`uploads/${path}`)) {
    try {
      fs.unlinkSync(path);
    } catch (error) {
      console.error(`Error removing file '${path}': ${error}`);
    }
  } else {
    console.log(`File '${path}' does not exist.`);
  }
};
