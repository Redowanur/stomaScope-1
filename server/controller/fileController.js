const axios = require("axios")
const { getPublicId } = require("../handler/cloudinaryHelper")
const fileModel = require("../models/fileModel")
const createError = require("http-errors")
const cloudinary = require("../config/cloudinary")
const { successResponse } = require("../handler/responseHandler")
const { cloudTempFolder, cloudImageFolder, cloudVideoFolder } = require("../src/secret")

// handle upload file
const handleUploadFile = async (req, res, next) => {
    try {
        const { name, userId, type } = req.body
        let filePath = req.file?.path
        const newFile = { name, filePath, type: parseInt(type), uploader: userId }


        let resourceType = ""

        if (type === "0") {
            resourceType = "image"

        } else {
            resourceType = "video"
        }

        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: `${resourceType}`,
            folder: `${cloudTempFolder}`
        })
        filePath = response.secure_url


        // Send filePath to Python backend
        const pythonApiUrl = `http://127.0.0.1:8000/api/v1/files/${resourceType}`; // Replace with the actual URL of your Python backend
        const pythonResponse = await axios.post(pythonApiUrl, { filePath });


        if (!pythonResponse || !pythonResponse.data.uploaded_url) {
            throw Error("something went wrong...")
        }

        if (pythonResponse) {
            newFile.filePath = pythonResponse.data.uploaded_url;
            if (type === "0") {
                newFile.count = pythonResponse.data.count;
            }

            const publicId = await getPublicId(filePath)
            await cloudinary.uploader.destroy(`${cloudTempFolder}/${publicId}`, {
                resource_type: resourceType
            })
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

        if (type === "images") {
            const { result } = await cloudinary.uploader.destroy(`${cloudImageFolder}/${publicId}`, {
                resource_type: "image"
            })

            if (result !== "ok") {
                throw createError(400, "please try again")
            }
        } else {
            const { result } = await cloudinary.uploader.destroy(`${cloudVideoFolder}/${publicId}`, {
                resource_type: "video"
            })
            if (result !== "ok") {
                throw createError(400, "please try again")
            }
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