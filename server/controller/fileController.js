const { getPublicId } = require("../handler/cloudinaryHelper")
const fileModel = require("../models/fileModel")
const createError = require("http-errors")
const cloudinary = require("../config/cloudinary")
const { successResponse } = require("../handler/responseHandler")
const { processImage } = require("../handler/processImage")
const { processVideo } = require("../handler/processVideo")

// handle upload file
const handleUploadFile = async (req, res, next) => {
    try {
        const { name, userId, type } = req.body
        const filePath = req.file?.path
        const newFile = { name, filePath, type: parseInt(type), uploader: userId }

        let folder = ""
        let resourceType = ""

        if (type === "0") {
            const output = await processImage(filePath)
            newFile.count = parseInt(output)
            folder = "images"
            resourceType = "image"

        } else {
            await processVideo(filePath)
            folder = "videos"
            resourceType = "video"
        }

        if (filePath) {
            const response = await cloudinary.uploader.upload(filePath, {
                resource_type: `${resourceType}`,
                folder: `stomaScope/${folder}`
            })
            newFile.filePath = response.secure_url
        }

        const file = await fileModel.create(newFile)
        return successResponse(res, {
            statusCode: 200,
            message: "file uploaded successfully",
            payload: { file }
        })
    } catch (error) {
        next(error)
    }
}

// delete file
const handleDeleteFile = async (req, res, next) => {
    try {
        const { userId } = req.body
        const { type, id } = req.params

        const existingFile = await fileModel.findById(id)

        if (!existingFile) {
            throw createError(404, "invalid file id")
        }

        if (userId !== existingFile.uploader.toString()) {
            throw createError(401, "unauthorize")
        }

        const publicId = await getPublicId(existingFile.filePath)
        let folder = ""
        let resourceType = ""

        if (type === "images") {
            folder = "images"
            resourceType = "image"
        } else {
            folder = "videos"
            resourceType = "video"
        }

        const { result } = await cloudinary.uploader.destroy(`stomaScope/${folder}/${publicId}`, {
            resource_type: resourceType
        })

        if (result !== "ok") {
            throw createError(400, "please try again")
        }

        await fileModel.findByIdAndDelete(id)

        return successResponse(res, {
            statusCode: 200,
            message: "file deleted successfully"
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    handleUploadFile,
    handleDeleteFile
}