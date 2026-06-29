import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiUpload } from 'react-icons/fi'
import { changeProfilePicture } from '../../../../services/operations/SettingAPI'

const ChangeProfilePicture = () => {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [previewSrc, setPreviewSrc] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setPreviewSrc(reader.result)
    reader.readAsDataURL(file)
  }

  const handleUpload = () => {
    try {
      if (!selectedFile) return
      setLoading(true)
      const formData = new FormData()
      formData.append("displayPicture", selectedFile)
      dispatch(changeProfilePicture(token, formData)).then(() => {
        setLoading(false)
      })
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  const initials =
    (user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '')

  return (
    <div className="flex items-center gap-x-6 rounded-md bg-richblack-800 p-6 mb-8">
      {/* Avatar */}
      <div className="relative">
        {previewSrc || user?.image ? (
          <img
            src={previewSrc || user?.image}
            alt="profile"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {initials.toUpperCase()}
          </div>
        )}
      </div>

      {/* Controls */}
      <div>
        <p className="text-richblack-5 font-semibold mb-3">
          Change Profile Picture
        </p>
        <div className="flex gap-x-3">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-richblack-700 text-richblack-200 text-sm font-medium hover:bg-richblack-600 transition-colors cursor-pointer"
          >
            Select
          </button>
          <button
            onClick={handleUpload}
            disabled={loading || !selectedFile}
            className="flex items-center gap-x-2 px-4 py-2 rounded-md bg-yellow-50 text-black text-sm font-semibold hover:bg-yellow-100 transition-colors cursor-pointer"
          >
            {loading ? "Uploading..." : "Upload"} <FiUpload />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChangeProfilePicture