import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { Input } from './ui/input'
import { Button } from './ui/button'

const AdvancedParameters = ({ open, onOpenChange, productionBase, onParametersChange, advancedParameters }) => {
  const isMapMode = productionBase === "MAP RM NH₄H₂PO₄ : 1"

  const getDefaultParameters = (isMap) => ({
    // Compounds
    N_DAS: 21.21,
    S_DAS: 24.24,
    B_H3BO3: 17.6,
    K2O_KCL: 58.0,
    Zn_ZnO: 76.0,
    Cu_CuO: 24.0,
    Mg_MgO: isMap ? 60.0 : 48.0,
    Cao_Chaux: isMap ? 0.0 : 70.0,

    // Expected Yields
    rendement_P2O5: 98.5,
    rendement_N: isMap ? 97 : 98.0,
    rendement_H2SO4: 98.5,
    rendement_K2O: 98.0,
    rendement_B2O3: 98.0,
    rendement_ballast: 100.0,
    rendement_Zn: 90,
    rendement_Cu: 90,

    // Consumption Parameters
    min_range: 60.0,
    max_range: 100.0,
    pas: 5.0
  })

  const [activeTab, setActiveTab] = useState('compounds')
  const [parameters, setParameters] = useState(getDefaultParameters(isMapMode))
  const [tempParameters, setTempParameters] = useState(getDefaultParameters(isMapMode))

  useEffect(() => {
    const defaultParams = getDefaultParameters(isMapMode)
    setParameters(defaultParams)
    setTempParameters(defaultParams)
  }, [isMapMode])

  useEffect(() => {
    if (advancedParameters !== null) {
      setParameters(advancedParameters)
      setTempParameters(advancedParameters)
    }
  }, [advancedParameters])

  useEffect(() => {
    if (open) {
      setTempParameters(parameters)
    }
  }, [open, parameters])

  const handleSave = () => {
    setParameters(tempParameters)
    onParametersChange(tempParameters)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setTempParameters(parameters)
    onOpenChange(false)
  }

  const handleInputChange = (name, value) => {
    let parsedValue = value === '' || value === null || isNaN(parseFloat(value)) ? 0 : parseFloat(value)
    
    // Ensure cadence steps (pas) has a minimum value of 1, all other values minimum 0
    if (name === 'min_range') {
      parsedValue = Math.max(0, Math.min(parsedValue, tempParameters.max_range));
    }
    
    if (name === 'max_range') {
      parsedValue = Math.max(tempParameters.min_range, Math.min(parsedValue, 100));
    }
    

    if (name === 'pas') {
      parsedValue = Math.max(1, parsedValue)
    } else {
      parsedValue = Math.max(0, parsedValue)
    }
    const newParameters = {
      ...tempParameters,
      [name]: parsedValue
    }
    setTempParameters(newParameters)
  }

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-foreground">Advanced Parameters</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Configure compounds, expected yields, and consumption parameters
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="compounds">Compounds</TabsTrigger>
            <TabsTrigger value="expected-yields">Expected Yields</TabsTrigger>
            <TabsTrigger value="consumption-parameters">Cadence Parameters</TabsTrigger>
          </TabsList>

          <TabsContent value="compounds" className="space-y-4 mt-4 text-foreground">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">%N DAS</label>
                <Input 
                  type="number" 
                  value={tempParameters.N_DAS}
                  onChange={(e) => handleInputChange('N_DAS', e.target.value)}
                  className="bg-input border-border text-foreground focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">%S DAS</label>
                <Input 
                  type="number" 
                  value={tempParameters.S_DAS}
                  onChange={(e) => handleInputChange('S_DAS', e.target.value)}
                  className="bg-input border-border text-foreground focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">%B H₃BO₃</label>
                <Input 
                  type="number" 
                  value={tempParameters.B_H3BO3}
                  onChange={(e) => handleInputChange('B_H3BO3', e.target.value)}
                  className="bg-input border-border text-foreground focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">%K₂O KCL</label>
                <Input 
                  type="number" 
                  value={tempParameters.K2O_KCL}
                  onChange={(e) => handleInputChange('K2O_KCL', e.target.value)}
                  className="bg-input border-border text-foreground focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">%Zn ZnO</label>
                <Input 
                  type="number" 
                  value={tempParameters.Zn_ZnO}
                  onChange={(e) => handleInputChange('Zn_ZnO', e.target.value)}
                  className="bg-input border-border text-foreground focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">%Cu CuO</label>
                <Input 
                  type="number" 
                  value={tempParameters.Cu_CuO}
                  onChange={(e) => handleInputChange('Cu_CuO', e.target.value)}
                  className="bg-input border-border text-foreground focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">%Mg MgO</label>
                <Input 
                  type="number" 
                  value={tempParameters.Mg_MgO}
                  onChange={(e) => handleInputChange('Mg_MgO', e.target.value)}
                  className="bg-input border-border text-foreground focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">%CaO Chaux</label>
                <Input 
                  type="number" 
                  value={tempParameters.Cao_Chaux}
                  onChange={(e) => handleInputChange('Cao_Chaux', e.target.value)}
                  disabled={isMapMode}
                  className="bg-input border-border text-foreground focus:ring-ring disabled:opacity-50"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="expected-yields" className="space-y-4 mt-4 text-foreground">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">%P₂O₅</label>
                <Input 
                  type="number" 
                  value={tempParameters.rendement_P2O5}
                  onChange={(e) => handleInputChange('rendement_P2O5', e.target.value)}
                  className="bg-input border-border text-foreground focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">%N</label>
                <Input 
                  type="number" 
                  value={tempParameters.rendement_N}
                  onChange={(e) => handleInputChange('rendement_N', e.target.value)}
                  className="bg-input border-border text-foreground focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">%H₂SO₄</label>
                <Input 
                  type="number" 
                  value={tempParameters.rendement_H2SO4}
                  onChange={(e) => handleInputChange('rendement_H2SO4', e.target.value)}
                  className="bg-input border-border text-foreground focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">%K₂O</label>
                <Input 
                  type="number" 
                  value={tempParameters.rendement_K2O}
                  onChange={(e) => handleInputChange('rendement_K2O', e.target.value)}
                  className="bg-input border-border text-foreground focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">%B₂O₃</label>
                <Input 
                  type="number" 
                  value={tempParameters.rendement_B2O3}
                  onChange={(e) => handleInputChange('rendement_B2O3', e.target.value)}
                  className="bg-input border-border text-foreground focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">%Ballast</label>
                <Input 
                  type="number" 
                  value={tempParameters.rendement_ballast}
                  onChange={(e) => handleInputChange('rendement_ballast', e.target.value)}
                  className="bg-input border-border text-foreground focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">%Zn</label>
                <Input 
                  type="number" 
                  value={tempParameters.rendement_Zn}
                  onChange={(e) => handleInputChange('rendement_Zn', e.target.value)}
                  disabled={!isMapMode}
                  className="bg-input border-border text-foreground focus:ring-ring disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">%Cu</label>
                <Input 
                  type="number" 
                  value={tempParameters.rendement_Cu}
                  onChange={(e) => handleInputChange('rendement_Cu', e.target.value)}
                  disabled={!isMapMode}
                  className="bg-input border-border text-foreground focus:ring-ring disabled:opacity-50"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="consumption-parameters" className="space-y-4 mt-4 text-foreground">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Min Range</label>
                <Input 
                  type="number" 
                  value={tempParameters.min_range}
                  onChange={(e) => handleInputChange('min_range', e.target.value)}
                  step="1"
                  min="0"
                  className="bg-input border-border text-foreground focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Max Range</label>
                <Input 
                  type="number" 
                  value={tempParameters.max_range}
                  onChange={(e) => handleInputChange('max_range', e.target.value)}
                  step="1"
                  min="0"
                  className="bg-input border-border text-foreground focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Cadence Steps</label>
                <Input 
                  type="number" 
                  min="1"
                  value={tempParameters.pas}
                  onChange={(e) => handleInputChange('pas', e.target.value)}
                  className="bg-input border-border text-foreground focus:ring-ring"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" className="border-border text-foreground hover:bg-accent transition-all duration-200" onClick={handleCancel}>
            Cancel
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 ease-in-out transform hover:scale-105" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AdvancedParameters