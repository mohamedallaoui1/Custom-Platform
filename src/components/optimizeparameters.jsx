import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Slider } from './ui/slider'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Settings } from 'lucide-react'

const OptimizeParameters = ({ open, onOpenChange, productionBase, onParametersChange, advancedParameters }) => {
  const isMapMode = productionBase === "MAP RM NH₄H₂PO₄ : 1"

  const getDefaultParameters = (isMap) => ({
    N_DAS: { min: 0, max: 100, default: 21.21 },
    S_DAS: { min: 0, max: 100, default: 24.24 },
    B_H3BO3: { min: 0, max: 100, default: 17.6 },
    K2O_KCL: { min: 0, max: 100, default: 58.0 },
    Zn_ZnO: { min: 0, max: 100, default: 76.0 },
    Cu_CuO: { min: 0, max: 100, default: 24.0 },
    Mg_MgO: { min: 0, max: 100, default: isMap ? 60.0 : 48.0 },
    Cao_Chaux: { min: 0, max: 100, default: isMap ? 0.0 : 70.0 }
  })

  const [parameters, setParameters] = useState(getDefaultParameters(isMapMode))
  const [tempParameters, setTempParameters] = useState(getDefaultParameters(isMapMode))

  useEffect(() => {
    const defaultParams = getDefaultParameters(isMapMode)
    setParameters(defaultParams)
    setTempParameters(defaultParams)
  }, [isMapMode])

  useEffect(() => {
    if (advancedParameters !== null) {
      const newParams = {}
      Object.keys(getDefaultParameters(isMapMode)).forEach(key => {
        newParams[key] = {
          min: 0,
          max: 100,
          default: advancedParameters[key] || 0
        }
      })
      setParameters(newParams)
      setTempParameters(newParams)
    }
  }, [advancedParameters, isMapMode])

  useEffect(() => {
    if (open) {
      setTempParameters(parameters)
    }
  }, [open, parameters])

  const handleSave = () => {
    setParameters(tempParameters)
    const optimizationParams = {}
    Object.entries(tempParameters).forEach(([key, value]) => {
      optimizationParams[key] = {
        min: value.min,
        max: value.max
      }
    })
    onParametersChange(optimizationParams)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setTempParameters(parameters)
    onOpenChange(false)
  }

  const handleSliderChange = (name, values) => {
    setTempParameters(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        min: values[0],
        max: values[1]
      }
    }))
  }

  const handleInputChange = (name, type, value) => {
    const numValue = Math.min(Math.max(Number(value) || 0, 0), 100)
    setTempParameters(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        [type]: numValue
      }
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full bg-gradient-to-br from-card to-card/95 border border-border/50 text-foreground shadow-2xl backdrop-blur-sm">
        <DialogHeader className="pb-6 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-600 to-green-700 rounded-lg">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-foreground bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                Advanced Parameters
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                Fine-tune parameter ranges for optimal formula verification. Adjust minimum and maximum values using sliders or direct input.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[65vh] overflow-y-auto pr-4 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(tempParameters).map(([key, value]) => (
              <div key={key} className={`bg-gradient-to-br from-muted/30 to-muted/10 p-4 rounded-xl border border-border/30 transition-all duration-200 hover:shadow-md ${isMapMode && key === 'Cao_Chaux' ? 'opacity-50' : 'hover:border-green-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                    {key.replace('_', ' ')}
                  </label>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Min</span>
                      <Input
                        type="number"
                        value={value.min}
                        onChange={(e) => handleInputChange(key, 'min', e.target.value)}
                        className={`w-16 h-8 text-xs bg-background/80 border-border/50 text-foreground focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${isMapMode && key === 'Cao_Chaux' ? 'opacity-50 cursor-not-allowed' : 'hover:border-green-300'}`}
                        min={0}
                        max={100}
                        disabled={isMapMode && key === 'Cao_Chaux'}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Max</span>
                      <Input
                        type="number"
                        value={value.max}
                        onChange={(e) => handleInputChange(key, 'max', e.target.value)}
                        className={`w-16 h-8 text-xs bg-background/80 border-border/50 text-foreground focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${isMapMode && key === 'Cao_Chaux' ? 'opacity-50 cursor-not-allowed' : 'hover:border-green-300'}`}
                        min={0}
                        max={100}
                        disabled={isMapMode && key === 'Cao_Chaux'}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{value.min}%</span>
                    <span>{value.max}%</span>
                  </div>
                  <Slider
                    value={[value.min, value.max]}
                    max={100}
                    step={1}
                    onValueChange={(values) => handleSliderChange(key, values)}
                    className={`${isMapMode && key === 'Cao_Chaux' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isMapMode && key === 'Cao_Chaux'}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-border/30 bg-gradient-to-r from-muted/20 to-muted/10 -mx-6 px-6 rounded-b-xl">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Tip:</span> Use sliders for quick adjustments or input fields for precise values
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleCancel} 
              className="text-sm border-border/50 text-foreground hover:bg-accent/50 transition-all duration-200 shadow-sm hover:shadow-md backdrop-blur-sm"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="text-sm bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-all duration-200 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Settings className="w-4 h-4 mr-2" />
              Verify Formula
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OptimizeParameters