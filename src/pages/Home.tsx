import NavBar from "../NavBar.tsx"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

type Sound = {
    id: number
    title: string
    description: string
    image: string 
    audioUrl: string
  }

export default function Home() {
    const [soundList, setSoundList] = useState<Sound[]>([])
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)

    useEffect(() => {
      fetch("http://localhost:8000/sound_board/sounds/all")
      .then((res) => res.json())
      .then((data) => {
        const transformed = data.map((item: any) => ({
          id: item.id,
          title: item.sound_name,
          description: `Uploaded on ${new Date(item.upload_date).toLocaleDateString()}`,
          image: "/vite.svg", // You can replace this with an actual image path if needed
          audioUrl: `http://localhost:8000/sound_board/sounds/${item.id}`,
        }))
        setSoundList(transformed)
      })
      .catch(console.error)
  }, [])

  function playSound(url: string) {
    if (currentAudio) currentAudio.pause()
    const audio = new Audio(url)
    setCurrentAudio(audio)
    audio.play()
  }
  function deleteSound(id: number) {
    const updated = soundList.filter((sound) => sound.id !== id)
    setSoundList(updated)
    localStorage.setItem("soundList", JSON.stringify(updated))
  }
    return (
        <>
            <NavBar/>
            <div className="flex justify-center items-center py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {soundList.map((sound) => (
                    <Card key={sound.id} className="w-72 p-4 text-center">
                        <CardHeader>
                        <img src={sound.image} alt="Sound" className="w-20 h-20 mx-auto rounded-full object-cover" />
                        <CardTitle className="mt-2 text-xl">{sound.title}</CardTitle>
                        <CardDescription>{sound.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => playSound(sound.audioUrl)}>▶️ Play</Button>
                            <Button onClick={() => deleteSound(sound.id)}>Delete</Button>
                        </CardContent>
            </Card>
            ))}
            
            </div>
            </div>
        </>
    )
}
  