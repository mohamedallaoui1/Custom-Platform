import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { Card } from './ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { TestTubes, Settings, Zap, Loader2 } from 'lucide-react'
import AdvancedParameters from './AdvancedParameters'

const NPKVerification = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [formData, setFormData] = useState({
    N: 10.0,
    P2O5: 26.0,
    K2O: 26.0,
    B: 0.0,
    Zn: 0.0,
    Cu: 0.0,
    Mn: 0.0,
    CaO: 0.0,
    productionBase: "DAP RM NH₄H₂PO₄ : 1.8"
  })

  const [showAdvancedParams, setShowAdvancedParams] = useState(false)
  const [verificationResult, setVerificationResult] = useState(null)
  const [advancedParameters, setAdvancedParameters] = useState(null)
  const [optimizeParameters, setOptimizeParameters] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState('verify')

  const handleInputChange = (name, value) => {
    if (name === 'productionBase') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
      const isDAP = value.includes('1.8')
      setAdvancedParameters(getDefaultPayload(isDAP))
    } else {
      const parsedValue = value === '' || value === null || isNaN(parseFloat(value)) ? 0 : parseFloat(value)
      setFormData(prev => ({
        ...prev,
        [name]: Math.max(0, parsedValue)
      }))
    }
  }

  const handleAdvancedParametersChange = (params) => {
    if (mode === 'verify') {
      setAdvancedParameters(params)
    } else {
      setOptimizeParameters(params)
    }
  }

  const getDefaultPayload = (isDAP) => {
    if (isDAP) {
      // DAP RM=1.8 default values
      return {
        RM: 1.8,
        K2O_KCL: 58.0,
        S_DAS: 24.24,
        N_DAS: 21.21,
        B_H3BO3: 17.6,
        Zn_ZnO: 76.0,
        Cu_CuO: 24.0,
        Mg_MgO: 48.0,
        Cao_Chaux: 70.0,
        rendement_P2O5: 98.5,
        rendement_N: 98,
        rendement_H2SO4: 98.5,
        rendement_K2O: 98,
        rendement_B2O3: 98,
        rendement_ballast: 98,
        rendement_Zn: 90,
        rendement_Cu: 90,
        min_range: 60,
        max_range: 100,
        pas: 5
      }
    } else {
      // MAP RM=1 default values
      return {
        RM: 1.0,
        N_DAS: 21.21,
        K2O_KCL: 58.0,
        B_H3BO3: 17.6,
        S_DAS: 24.24,
        Zn_ZnO: 76.0,
        Cu_CuO: 24.0,
        Mg_MgO: 60.0,
        Cao_Chaux: 0.0,
        min_range: 60.0,
        max_range: 100.0,
        pas: 5.0,
        rendement_P2O5: 98.5,
        rendement_N: 97,
        rendement_H2SO4: 98.5,
        rendement_K2O: 98.0,
        rendement_B2O3: 98.0,
        rendement_ballast: 100.0,
        rendement_Zn: 90.0,
        rendement_Cu: 90
      }
    }
  }

  const handleVerify = async () => {
    setIsLoading(true)
    try {
      const isDAP = formData.productionBase.includes('1.8')
      
      // Get default payload based on production base
      let payload = getDefaultPayload(isDAP)
      
      // Override with form data
      payload = {
        ...payload,
        P2O5_NPK: formData.P2O5,
        N_NPK: formData.N,
        K2O_NPK: formData.K2O,
        B_NPK: formData.B,
        Zn_NPK: formData.Zn,
        Cu_NPK: formData.Cu,
        Mg_NPK: formData.Mn,
        Cao_NPK: formData.CaO
      }

      // Add S_NPK for DAP mode if needed
      if (isDAP) {
        payload.S_NPK = 0.0
      }
      
      // Override with advanced parameters if they exist
      if (advancedParameters) {
        payload = {
          ...payload,
          ...advancedParameters
        }
      }


      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      const verificationResult = {
        possible: data.bilans.Ballast >= 0,
        message: data.bilans.Ballast >= 0 
          ? `Balance of ballast: ${data.bilans.Ballast.toFixed(2)} T (positive ballast balance)`
          : `Balance of ballast: ${data.bilans.Ballast.toFixed(2)} T (negative ballast balance)`,
        mainDetails: {
          P2O5: data.pourcentage_P2O5_melange_final.toFixed(2),
          N: data.pourcentage_N_melange_final.toFixed(2),
          bilans: data.bilans,
          titres: data.titres_attendus
        },
        // Commenting out specific consumption and cadence as requested
        // specificConsumption: data.consommations_specifiques,
        // cadence: data.cadences
      }
      
      // Navigate to results page with the verification data
      navigate('/verification-results', {
        state: {
          verificationResult,
          formData
        }
      })
    } catch (error) {
      console.error('Error:', error)
      const verificationResult = {
        possible: false,
        message: `Error: ${error.message}`,
        mainDetails: null
      }
      
      // Navigate to results page even with error
      navigate('/verification-results', {
        state: {
          verificationResult,
          formData
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isDAP = formData.productionBase && formData.productionBase.includes('1.8')

  return (
    <div className="max-w-4xl mx-auto py-4 bg-background p-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold mb-1 text-foreground">NPK Formula Verification</h1>
        <p className="text-xs text-muted-foreground">
          Verify and balance your NPK formulations with precision
        </p>
      </div>

      <Card className="p-3 mb-4 bg-card border border-border">
        <div className="space-y-3">
          <div>
            <h2 className="text-success font-medium mb-2 text-sm">NPK Formula Entry</h2>
            <p className="text-xs text-muted-foreground mb-3">Enter the target percentages for your NPK formula</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="flex items-center gap-1 text-xs font-medium mb-1 text-foreground">
                  %N
                </label>
                <Input
                  type="number"
                  value={formData.N}
                  onChange={(e) => handleInputChange('N', parseFloat(e.target.value))}
                  className="bg-input border-border text-foreground focus:ring-ring h-8 text-xs"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs font-medium mb-1 text-foreground">
                  %P₂O₅
                </label>
                <Input
                  type="number"
                  value={formData.P2O5}
                  onChange={(e) => handleInputChange('P2O5', parseFloat(e.target.value))}
                  className="bg-input border-border text-foreground focus:ring-ring h-8 text-xs"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs font-medium mb-1 text-foreground">
                  %K₂O
                </label>
                <Input
                  type="number"
                  value={formData.K2O}
                  onChange={(e) => handleInputChange('K2O', parseFloat(e.target.value))}
                  className="bg-input border-border text-foreground focus:ring-ring h-8 text-xs"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs font-medium mb-1 text-foreground">
                  %B
                </label>
                <Input
                  type="number"
                  value={formData.B}
                  onChange={(e) => handleInputChange('B', parseFloat(e.target.value))}
                  className="bg-input border-border text-foreground focus:ring-ring h-8 text-xs"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs font-medium mb-1 text-foreground">
                  %Zn
                </label>
                <Input
                  type="number"
                  value={formData.Zn}
                  onChange={(e) => handleInputChange('Zn', parseFloat(e.target.value))}
                  className="bg-input border-border text-foreground focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed h-8 text-xs"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs font-medium mb-1 text-foreground">
                  %Cu
                </label>
                <Input
                  type="number"
                  value={formData.Cu}
                  onChange={(e) => handleInputChange('Cu', parseFloat(e.target.value))}
                  className="bg-input border-border text-foreground focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed h-8 text-xs"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs font-medium mb-1 text-foreground">
                  %Mg
                </label>
                <Input
                  type="number"
                  value={formData.Mn}
                  onChange={(e) => handleInputChange('Mn', parseFloat(e.target.value))}
                  className="bg-input border-border text-foreground focus:ring-ring h-8 text-xs"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs font-medium mb-1 text-foreground">
                  %CaO
                </label>
                <Input
                  type="number"
                  value={formData.CaO}
                  onChange={(e) => handleInputChange('CaO', parseFloat(e.target.value))}
                  disabled={!isDAP}
                  className="bg-input border-border text-foreground focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed h-8 text-xs"
                />
                {!isDAP && (
                  <p className="text-[10px] text-muted-foreground mt-1">CaO input is only available in DAP mode</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-foreground">Production Base</label>
            <select
              value={formData.productionBase}
              onChange={(e) => handleInputChange('productionBase', e.target.value)}
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-8"
            >
              <option value="DAP RM NH₄H₂PO₄ : 1.8">DAP RM NH₄H₂PO₄ : 1.8</option>
              <option value="MAP RM NH₄H₂PO₄ : 1">MAP RM NH₄H₂PO₄ : 1</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 border-border text-foreground hover:bg-accent h-8 px-3 text-xs" onClick={() => setShowAdvancedParams(true)}>
                <Settings className="icon-xs" />
                Advanced Parameters
              </Button>
              {/* <Button variant="outline" className="gap-2 border-border text-foreground hover:bg-accent" onClick={resetToDefault}>
                <span>↺</span>
                Reset to Default
              </Button> */}
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-3 text-xs gap-2"
              onClick={handleVerify}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="icon-xs animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <TestTubes className="icon-xs" />
                  Verify Formula
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Results will be displayed on a separate page */}

      <AdvancedParameters 
        open={showAdvancedParams} 
        onOpenChange={setShowAdvancedParams}
        productionBase={formData.productionBase}
        onParametersChange={handleAdvancedParametersChange}
          advancedParameters={advancedParameters}
        />
    </div>
  )
}

export default NPKVerification
