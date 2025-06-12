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
      <DialogContent className="max-w-3xl w-full bg-card border border-border text-foreground shadow-lg">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-green-600" />
            <div>
              <DialogTitle className="text-lg font-semibold text-foreground">
                Optimize Parameters
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Adjust parameter ranges for formula optimization
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[50vh] overflow-y-auto pr-2 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Object.entries(tempParameters).map(([key, value]) => (
              <div key={key} className={`bg-muted/20 p-3 rounded-lg border border-border transition-all duration-200 ${isMapMode && key === 'Cao_Chaux' ? 'opacity-50' : 'hover:border-green-300'}`}>
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

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
          <Button 
            variant="outline" 
            onClick={handleCancel} 
            className="text-sm"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="text-sm bg-green-600 hover:bg-green-700 text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            Verify Formula
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OptimizeParameters