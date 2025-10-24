"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plane, Scan, X } from "lucide-react"
import { toast } from "sonner"

interface PassengerInfo {
  firstName: string
  lastName: string
  airline: string
  flightNumber: string
  destination: string
  boardingTime: string
}

interface BoardingPassScannerProps {
  onPassengerScanned: (passenger: PassengerInfo) => void
}

export function BoardingPassScanner({ onPassengerScanned }: BoardingPassScannerProps) {
  const [open, setOpen] = useState(false)
  const [scanData, setScanData] = useState("")

  const handleScan = () => {
    // Simulation de scan de carte d'embarquement
    // Format attendu: LASTNAME/FIRSTNAME|AIRLINE|FLIGHTNUMBER|DESTINATION|BOARDINGTIME
    // Exemple: TRAORE/AMADOU|AIR BURKINA|BF101|CDG|14:30
    
    if (!scanData.trim()) {
      toast.error("Veuillez scanner ou saisir les données")
      return
    }

    try {
      const parts = scanData.split("|")
      
      if (parts.length < 5) {
        throw new Error("Format invalide")
      }

      const [name, airline, flightNumber, destination, boardingTime] = parts
      const [lastName, firstName] = name.split("/")

      const passenger: PassengerInfo = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        airline: airline.trim(),
        flightNumber: flightNumber.trim(),
        destination: destination.trim(),
        boardingTime: boardingTime.trim(),
      }

      onPassengerScanned(passenger)
      toast.success(`Passager scanné : ${passenger.firstName} ${passenger.lastName}`)
      setOpen(false)
      setScanData("")
    } catch (error) {
      toast.error("Format de carte d'embarquement invalide")
    }
  }

  const handleQuickTest = () => {
    // Test rapide avec données fictives
    const testPassenger: PassengerInfo = {
      firstName: "AMADOU",
      lastName: "TRAORE",
      airline: "AIR BURKINA",
      flightNumber: "BF101",
      destination: "CDG",
      boardingTime: "14:30",
    }
    
    onPassengerScanned(testPassenger)
    toast.success(`Test : ${testPassenger.firstName} ${testPassenger.lastName}`)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plane className="mr-2 h-4 w-4" />
          Scanner carte d&apos;embarquement
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Scanner Carte d&apos;Embarquement
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900 font-medium mb-2">
              Format attendu :
            </p>
            <code className="text-xs text-blue-800 block font-mono">
              NOM/PRENOM|COMPAGNIE|VOL|DESTINATION|HEURE
            </code>
            <p className="text-xs text-blue-700 mt-2">
              Exemple : TRAORE/AMADOU|AIR BURKINA|BF101|CDG|14:30
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scanData">Données de la carte</Label>
            <Input
              id="scanData"
              placeholder="Scanner ou saisir manuellement..."
              value={scanData}
              onChange={(e) => setScanData(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleScan} className="flex-1">
              <Scan className="mr-2 h-4 w-4" />
              Scanner
            </Button>
            <Button onClick={handleQuickTest} variant="outline" className="flex-1">
              Test rapide
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 text-center">
              💡 En production, connectez un lecteur de code-barres pour scanner automatiquement
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}