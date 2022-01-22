import sharp from 'sharp'
import path from 'path'
import exifr from 'exifr'
import fs, { createWriteStream } from 'fs'

async function resizeImages() {
  const folderPath = path.resolve(__dirname, '..', 'images')
  const resizedFolder = path.resolve(folderPath, 'resized')
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath)
  }
  if (!fs.existsSync(resizedFolder)) {
    fs.mkdirSync(resizedFolder)
  }
  const files = fs.readdirSync(folderPath)

  console.log(files)

  await Promise.all(
    files.map(async (file) => {
      if (file === 'resized') {
        return
      }
      sharp.cache(false)
      const [, extension] = file.split('.')
      const filePath = `${folderPath}/${file}`

      const imageMetadata = await exifr.parse(filePath)
      const imageWidth = imageMetadata.ImageWidth
      const imageHeight = imageMetadata.ImageHeight
      console.log(imageMetadata)

      const writeStream = createWriteStream(path.resolve(resizedFolder, file))

      if (extension === 'jpeg' || extension === 'jpg') {
        sharp(filePath)
          .resize(imageWidth, imageHeight)
          .jpeg({ quality: 70 })
          .pipe(writeStream)
      } else {
        sharp(filePath)
          .resize(imageWidth, imageHeight)
          .png({ quality: 70 })
          .pipe(writeStream)
      }
    }),
  )
}

;(async function () {
  await resizeImages()
})()
