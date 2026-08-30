"use client"

import * as React from "react"
import { useAuthStore } from "../../../../store/auth.store"
import { usersService } from "../../../../services/auth/users.service"
import { Camera, Save, Loader2, X, User, CheckCircle2, XCircle } from "lucide-react"
import { toast } from 'sonner'
import { getCroppedImg } from '../../../../lib/cropImage'
import { ChangePasswordForm } from '../../../../components/auth/change-password-form'
import Cropper from 'react-easy-crop'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  
  const [formData, setFormData] = React.useState({
    name: '',
    username: '',
    mobile: '',
    bio: ''
  })
  
  const [isSaving, setIsSaving] = React.useState(false)
  const [successMsg, setSuccessMsg] = React.useState('')
  const [errorMsg, setErrorMsg] = React.useState('')

  const [usernameStatus, setUsernameStatus] = React.useState<'idle' | 'checking' | 'available' | 'taken'>('idle')

  // Crop states
  const [imageSrc, setImageSrc] = React.useState<string | null>(null)
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null)
  const [isUploading, setIsUploading] = React.useState(false)
  
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        mobile: user.mobile || '',
        bio: user.bio || ''
      })
    }
  }, [user])

  React.useEffect(() => {
    if (!formData.username) {
      setUsernameStatus('idle');
      return;
    }
    // Don't check if it's identical to the currently saved username
    if (user && formData.username === user.username) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const { available } = await usersService.checkUsername(formData.username);
        setUsernameStatus(available ? 'available' : 'taken');
      } catch (err) {
        setUsernameStatus('idle');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSuccessMsg('')
    setErrorMsg('')
    try {
      const res = await usersService.updateProfile(formData)
      updateUser(res.user)
      setSuccessMsg('Profile updated successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.addEventListener('load', () => setImageSrc(reader.result?.toString() || null))
      reader.readAsDataURL(file)
    }
    // reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onCropComplete = React.useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleUploadImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    setIsUploading(true)
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
      const res = await usersService.updateProfilePicture(croppedImage)
      updateUser(res.user)
      setImageSrc(null) // close modal
      setSuccessMsg('Profile picture updated!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setErrorMsg('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  if (!user) return null

  return (
    <div className="flex-1 overflow-y-auto stylish-scrollbar-dark px-8 pb-8 pt-[104px] h-full bg-[#131417]">
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-white/90">Profile Settings</h1>
          <p className="text-white/40 mt-1">Manage your personal information and profile picture.</p>
        </div>

        {/* Success/Error Alerts */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-sm font-medium">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Avatar Section */}
          <div className="md:col-span-1">
            <div className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-6 flex flex-col items-center text-center">
              <div className="relative group mb-6">
                <div className="h-32 w-32 rounded-full overflow-hidden bg-[#131417] border-2 border-white/5 flex items-center justify-center">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-white/20" />
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 h-10 w-10 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full flex items-center justify-center shadow-lg transition-colors border-2 border-[#1C1E24]"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={onFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <h3 className="text-sm font-medium text-white mb-1">Profile Picture</h3>
              <p className="text-xs text-white/40">Must be JPEG, PNG, or GIF and cannot exceed 5MB.</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="md:col-span-2">
            <div className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/60">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[#131417] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#3B82F6] transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/60 flex items-center justify-between">
                      <span>Username</span>
                      {usernameStatus === 'checking' && <Loader2 className="h-3 w-3 animate-spin text-white/40" />}
                      {usernameStatus === 'available' && <span className="text-[#22C55E] flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Available</span>}
                      {usernameStatus === 'taken' && <span className="text-[#EF4444] flex items-center gap-1"><XCircle className="h-3 w-3" /> Taken</span>}
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full bg-[#131417] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none transition-colors ${
                          usernameStatus === 'taken' ? 'border-[#EF4444] focus:border-[#EF4444]' : 
                          usernameStatus === 'available' ? 'border-[#22C55E] focus:border-[#22C55E]' : 
                          'border-white/10 focus:border-[#3B82F6]'
                        }`}
                        placeholder="@johndoe"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/60">Email Address (Read Only)</label>
                    <input 
                      type="email" 
                      value={user.email}
                      disabled
                      className="w-full bg-[#131417]/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white/50 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/60">Mobile Number</label>
                    <input 
                      type="text" 
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full bg-[#131417] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#3B82F6] transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60">Bio</label>
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-[#131417] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#3B82F6] transition-colors resize-none stylish-scrollbar-dark"
                    placeholder="Write a few sentences about yourself..."
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-white/[0.04]">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <ChangePasswordForm />
        </div>
      </div>

      {/* Crop Modal */}
      {imageSrc && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1C1E24] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Crop Profile Picture</h3>
              <button onClick={() => setImageSrc(null)} className="text-white/40 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="relative h-80 w-full bg-[#131417]">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="p-4 border-t border-white/10 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs text-white/40">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => {
                    setZoom(Number(e.target.value))
                  }}
                  className="flex-1 accent-[#3B82F6]"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setImageSrc(null)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUploadImage}
                  disabled={isUploading}
                  className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Apply & Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
