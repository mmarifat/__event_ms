import * as gm from 'gm';

export interface IFileProperty {

	name: string;

	originalName: string;

	size: number;

	mimeType: string;

	path: string;
}

// @ts-ignore
export function makeFileProperty(file: Express.Multer.File, path: string = null, createThumb: boolean = false): IFileProperty {
	if (createThumb) {
		let thPath = __dirname + '/../../public/thumbs/' + file.filename;
		// @ts-ignore
		gm(file.path)
			  .resize(150, 150)
			  .noProfile()
			  .write(thPath, (err: any) => {
				  console.log(err);
			  })
	}
	return {
		mimeType: file.mimetype,
		name: file.filename,
		originalName: file.originalname,
		path: (path || process.env.uploadDir) + '/' + file.filename,
		size: file.size
	}
}
