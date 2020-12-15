import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

async function resizeImages() {
    const folderPath = path.resolve(__dirname, '..', 'images')
    fs.mkdirSync(folderPath)
    const resizedFolder = path.resolve(folderPath, 'resized')
    fs.mkdirSync(resizedFolder)
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

        if (extension === 'jpeg' || extension === 'jpg') {
            buffer = await sharp(filePath).jpeg({ quality: 70 }).toBuffer()
        } else {
            buffer = await sharp(filePath).png({ quality: 70 }).toBuffer()
        }

        sharp(buffer).toFile(path.resolve(resizedFolder, file))
    })
}

(async function () {
    await resizeImages()
})()