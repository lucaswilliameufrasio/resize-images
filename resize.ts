import sharp from 'sharp'
import path from 'path'
import exifr from 'exifr'
import fs, { createWriteStream } from 'fs'
import { pipelineAsync } from './pipeline-async'

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
      console.log('imageMetadata', imageMetadata)

      const imageWidth = imageMetadata?.ImageWidth
      const imageHeight = imageMetadata?.ImageHeight

      const writeStream = createWriteStream(path.resolve(resizedFolder, file))
      const readStream = Boolean(imageWidth && imageWidth)
        ? sharp(filePath).resize(imageWidth, imageHeight)
        : sharp(filePath)

      const reducedQualityImageReadStream =
        extension === 'jpeg' || extension === 'jpg'
          ? readStream.jpeg({ quality: 70 })
          : readStream.png({ quality: 70 })

      await pipelineAsync(reducedQualityImageReadStream, writeStream)
    }),
  )
}

;(async function () {
  await resizeImages()
})()
