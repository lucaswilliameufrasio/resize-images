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
      const imageWidth = imageMetadata.ImageWidth
      const imageHeight = imageMetadata.ImageHeight
      console.log(imageMetadata)

      const writeStream = createWriteStream(path.resolve(resizedFolder, file))

      if (extension === 'jpeg' || extension === 'jpg') {
        const readableStream = sharp(filePath)
          .resize(imageWidth, imageHeight)
          .jpeg({ quality: 70 })
          
        await pipelineAsync(readableStream, writeStream)

      } else {
        const readableStream = sharp(filePath)
          .resize(imageWidth, imageHeight)
          .png({ quality: 70 })
          
          await pipelineAsync(readableStream, writeStream)
      }
    }),
  )
}

;(async function () {
  await resizeImages()
})()
