import sharp from 'sharp'
import path from 'path'
import exifr from 'exifr'
import fs from 'fs'

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

    files.map(async (file) => {
        if (file === 'resized') {
            return
        }
        sharp.cache(false)
        const [, extension] = file.split('.')
        const filePath = `${folderPath}/${file}`
        let buffer

        const imageMetadata = await exifr.parse(filePath)
        const imageWidth = imageMetadata.ImageWidth
        const imageHeight = imageMetadata.ImageHeight
        console.log(imageMetadata)

        if (extension === 'jpeg' || extension === 'jpg') {
            buffer = await sharp(filePath).resize(imageWidth, imageHeight).jpeg({ quality: 70 }).toBuffer()
        } else {
            buffer = await sharp(filePath).resize(imageWidth, imageHeight).png({ quality: 70 }).toBuffer()
        }

        sharp(buffer).toFile(path.resolve(resizedFolder, file))
    })
}

(async function () {
    await resizeImages()
})()