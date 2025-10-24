"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/hooks/useAuth"
import { Settings, User, Bell, Shield, Building, DollarSign, Globe } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  // Company Settings
  const [companySettings, setCompanySettings] = useState({
    name: "DJBC Duty Free",
    address: "Aéroport International de Ouagadougou",
    city: "Ouagadougou",
    country: "Burkina Faso",
    phone: "+226 XX XX XX XX",
    email: "contact@djbc-dutyfree.com",
    taxId: "IFU-XXXXXXXXXXX",
    currency: "XOF",
  })

  // Notification Settings
  const [notifications, setNotifications] = useState({
    lowStock: true,
    newSale: true,
    dailyReport: true,
    loyaltyExpiring: true,
    sommierAlert: true,
  })

  // Display Settings
  const [displaySettings, setDisplaySettings] = useState({
    language: "fr",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    currency: "XOF",
  })

  // Tax Settings
  const [taxSettings, setTaxSettings] = useState({
    defaultTaxRate: 18,
    taxIncluded: false,
    displayTax: true,
  })

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simuler la sauvegarde
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Paramètres de l'entreprise mis à jour")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    try {
      // Simuler la sauvegarde
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast.success("Paramètres de notifications mis à jour")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour")
    }
  }

  const handleSaveDisplay = async () => {
    try {
      // Simuler la sauvegarde
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast.success("Paramètres d'affichage mis à jour")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">Gérez les paramètres de l&apos;application</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="company">
            <Building className="mr-2 h-4 w-4" />
            Entreprise
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="display">
            <Globe className="mr-2 h-4 w-4" />
            Affichage
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations du compte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nom complet</Label>
                  <Input value={user?.fullName || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Nom d&apos;utilisateur</Label>
                  <Input value={user?.username || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Rôle</Label>
                  <Input value={user?.role || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="email@exemple.com" />
                </div>
                <Button className="w-full">Mettre à jour le profil</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Dernière connexion</p>
                  <p className="font-medium">{new Date().toLocaleString("fr-FR")}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Compte créé le</p>
                  <p className="font-medium">01/01/2025</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Sessions actives</p>
                  <p className="font-medium">1 appareil</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informations de l&apos;entreprise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveCompany} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nom de l&apos;entreprise</Label>
                    <Input
                      id="companyName"
                      value={companySettings.name}
                      onChange={(e) =>
                        setCompanySettings({ ...companySettings, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxId">IFU / Numéro fiscal</Label>
                    <Input
                      id="taxId"
                      value={companySettings.taxId}
                      onChange={(e) =>
                        setCompanySettings({ ...companySettings, taxId: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={companySettings.address}
                      onChange={(e) =>
                        setCompanySettings({ ...companySettings, address: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={companySettings.city}
                      onChange={(e) =>
                        setCompanySettings({ ...companySettings, city: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      value={companySettings.country}
                      onChange={(e) =>
                        setCompanySettings({ ...companySettings, country: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={companySettings.phone}
                      onChange={(e) =>
                        setCompanySettings({ ...companySettings, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={companySettings.email}
                      onChange={(e) =>
                        setCompanySettings({ ...companySettings, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Paramètres de taxation
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="defaultTaxRate">Taux de TVA par défaut (%)</Label>
                      <Input
                        id="defaultTaxRate"
                        type="number"
                        min="0"
                        max="100"
                        value={taxSettings.defaultTaxRate}
                        onChange={(e) =>
                          setTaxSettings({
                            ...taxSettings,
                            defaultTaxRate: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="taxIncluded">Prix TTC par défaut</Label>
                        <Switch
                          id="taxIncluded"
                          checked={taxSettings.taxIncluded}
                          onCheckedChange={(checked) =>
                            setTaxSettings({ ...taxSettings, taxIncluded: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="displayTax">Afficher la TVA sur les tickets</Label>
                        <Switch
                          id="displayTax"
                          checked={taxSettings.displayTax}
                          onCheckedChange={(checked) =>
                            setTaxSettings({ ...taxSettings, displayTax: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Préférences de notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Stock faible</p>
                    <p className="text-sm text-gray-500">
                      Recevoir des alertes quand le stock est faible
                    </p>
                  </div>
                  <Switch
                    checked={notifications.lowStock}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, lowStock: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Nouvelles ventes</p>
                    <p className="text-sm text-gray-500">
                      Notification pour chaque nouvelle vente
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newSale}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, newSale: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Rapport journalier</p>
                    <p className="text-sm text-gray-500">Recevoir un rapport à la fin de chaque journée</p>
                  </div>
                  <Switch
                    checked={notifications.dailyReport}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, dailyReport: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Cartes fidélité expirantes</p>
                    <p className="text-sm text-gray-500">
                      Alertes pour les cartes qui expirent bientôt
                    </p>
                  </div>
                  <Switch
                    checked={notifications.loyaltyExpiring}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, loyaltyExpiring: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Alertes sommiers</p>
                    <p className="text-sm text-gray-500">
                      Notifications pour les sommiers à apurer
                    </p>
                  </div>
                  <Switch
                    checked={notifications.sommierAlert}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, sommierAlert: checked })
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotifications} className="w-full">
                Enregistrer les préférences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Paramètres d&apos;affichage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Langue de l&apos;interface</Label>
                <select
                  id="language"
                  aria-label="Langue de l'interface"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={displaySettings.language}
                  onChange={(e) =>
                    setDisplaySettings({ ...displaySettings, language: e.target.value })
                  }
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Format de date</Label>
                <select
                  id="dateFormat"
                  aria-label="Format de date"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={displaySettings.dateFormat}
                  onChange={(e) =>
                    setDisplaySettings({ ...displaySettings, dateFormat: e.target.value })
                  }
                >
                  <option value="DD/MM/YYYY">JJ/MM/AAAA</option>
                  <option value="MM/DD/YYYY">MM/JJ/AAAA</option>
                  <option value="YYYY-MM-DD">AAAA-MM-JJ</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeFormat">Format d&apos;heure</Label>
                <select
                  id="timeFormat"
                  aria-label="Format d'heure"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={displaySettings.timeFormat}
                  onChange={(e) =>
                    setDisplaySettings({ ...displaySettings, timeFormat: e.target.value })
                  }
                >
                  <option value="24h">24 heures</option>
                  <option value="12h">12 heures (AM/PM)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Devise principale</Label>
                <select
                  id="currency"
                  aria-label="Devise principale"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={displaySettings.currency}
                  onChange={(e) =>
                    setDisplaySettings({ ...displaySettings, currency: e.target.value })
                  }
                >
                  <option value="XOF">XOF (Franc CFA)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="USD">USD (Dollar)</option>
                </select>
              </div>

              <Button onClick={handleSaveDisplay} className="w-full">
                Enregistrer les paramètres
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Changer le mot de passe
                </Button>
                <Button variant="outline" className="w-full">
                  Activer l&apos;authentification à deux facteurs
                </Button>
                <Button variant="outline" className="w-full">
                  Voir les sessions actives
                </Button>
                <Separator />
                <Button variant="destructive" className="w-full">
                  Se déconnecter de tous les appareils
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historique de sécurité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-900">Connexion réussie</p>
                    <p className="text-xs text-green-700">
                      Aujourd&apos;hui à {new Date().toLocaleTimeString("fr-FR")}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Navigateur: Chrome (Windows)</p>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Mot de passe modifié</p>
                    <p className="text-xs text-blue-700">Il y a 7 jours</p>
                    <p className="text-xs text-gray-600 mt-1">Par: {user?.username}</p>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-900">Tentative de connexion échouée</p>
                    <p className="text-xs text-yellow-700">Il y a 15 jours</p>
                    <p className="text-xs text-gray-600 mt-1">IP: 192.168.1.xxx</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}