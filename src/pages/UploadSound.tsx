import { useState } from "react"
import NavBar from "../NavBar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router"

export default function UploadSound() {
  const [soundName, setSoundName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [audio, setAudio] = useState<File | null>(null)

  const navigate = useNavigate()

  async function handleUpload() {
    if (!soundName || !description || !image || !audio) {
      alert("Please fill in all fields")
      return
    }

    const formData = new FormData()
    formData.append("user_id", "test_user") // You can replace with dynamic user later
    formData.append("sound_name", soundName)
    formData.append("sound", audio)

    try {
      const response = await fetch("http://localhost:8000/sound_board/sounds", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Upload failed")
      }

      const result = await response.json()
      console.log("Upload success:", result)
      navigate("/home")
    } catch (error) {
      alert("Error: " + error)
    }
  }

  return (
    <>
      <NavBar />
      <div className="max-w-xl mx-auto mt-10 space-y-6 p-4">
        <h2 className="text-2xl font-bold">Upload a Sound</h2>

        <div>
          <Label>Sound Name</Label>
          <Input value={soundName} onChange={(e) => setSoundName(e.target.value)} />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <Label>Picture (jpg/png)</Label>
          <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        </div>

        <div>
          <Label>Sound File (mp3)</Label>
          <Input type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files?.[0] || null)} />
        </div>

        <Button onClick={handleUpload}>Upload</Button>
      </div>
    </>
  )
}
