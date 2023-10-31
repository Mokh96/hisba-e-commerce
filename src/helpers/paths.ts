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

// module.exports = { gallery, pathToFile };
