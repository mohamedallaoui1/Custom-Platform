import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { CheckCircle, AlertTriangle, ArrowLeft, Settings, BarChart3, Scale, Target, Leaf, Beaker, Zap, CheckSquare, XSquare, Download, FileSpreadsheet, FileText } from 'lucide-react'
import ExcelJS from 'exceljs'
import jsPDF from 'jspdf'
import html2pdf from 'html2pdf.js'
import OptimizeParameters from './OptimizeParameters'

const VerificationResults = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { verificationResult, formData } = location.state || {}
  const [activeTab, setActiveTab] = useState('overview')
  const [animationKey, setAnimationKey] = useState(0)

  // Reset animations when tab changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1)
  }, [activeTab])

  if (!verificationResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in">
          <h2 className="text-2xl font-bold mb-4 text-foreground">No verification results found</h2>
          <Button onClick={() => navigate('/npk-verification')} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Go back to verification
          </Button>
        </div>
      </div>
    )
  }

  const ProgressBar = ({ label, value, max, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false)
    const [animatedWidth, setAnimatedWidth] = useState(0)
    const absValue = Math.abs(value)
    const percentage = max > 0 ? Math.min((absValue / max) * 100, 100) : 0
    const isPositive = value >= 0
    
    useEffect(() => {
      // Reset animation when animationKey changes
      setIsVisible(false)
      setAnimatedWidth(0)
      
      const timer = setTimeout(() => {
        setIsVisible(true)
        // Small delay to ensure the element is rendered before animating
        setTimeout(() => setAnimatedWidth(percentage), 50)
      }, delay + 100)
      
      return () => clearTimeout(timer)
    }, [delay, animationKey, percentage])
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-foreground">{label}</span>
          <span className={`text-xs font-bold ${
            isPositive ? 'text-success' : 'text-destructive'
          }`}>
            {value.toFixed(2)} T
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1500 ease-out ${
              isPositive 
                ? 'bg-green-500' 
                : 'bg-red-500'
            }`}
            style={{
              width: `${animatedWidth}%`,
              opacity: isVisible ? 1 : 0
            }}
          />
        </div>
      </div>
    )
  }

  const MetricCard = ({ title, value, unit, icon: IconComponent, color = "default", delay = 0 }) => {
    const colorClasses = {
      default: "bg-card border-border",
      success: "bg-success/10 border-success/20",
      error: "bg-destructive/10 border-destructive/20"
    }
    
    return (
      <Card className={`p-3 ${colorClasses[color]} border transition-colors duration-200`}>
        <div className="flex items-center justify-between mb-2">
          <IconComponent className="icon-base text-muted-foreground" />
          <div className="text-right">
            <p className="text-base font-bold text-foreground">
              {parseFloat(value).toFixed(2)}
              <span className="text-xs text-muted-foreground ml-1">{unit}</span>
            </p>
          </div>
        </div>
        <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
      </Card>
    )
  }

  const YieldCard = ({ label, value, percentage, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false)
    const [animatedWidth, setAnimatedWidth] = useState(0)
    
    useEffect(() => {
      // Reset animation when animationKey changes
      setIsVisible(false)
      setAnimatedWidth(0)
      
      const timer = setTimeout(() => {
        setIsVisible(true)
        // Small delay to ensure the element is rendered before animating
        setTimeout(() => setAnimatedWidth(percentage), 50)
      }, delay + 100)
      
      return () => clearTimeout(timer)
    }, [delay, animationKey, percentage])
    
    return (
      <Card className={`p-3 border transition-all duration-200 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}>
        <div className="text-center mb-2">
          <p className="text-xs text-muted-foreground mb-1">%{label}</p>
          <p className="text-lg font-bold text-foreground">
            {value.toFixed(2)}
            <span className="text-xs text-muted-foreground">%</span>
          </p>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-success rounded-full transition-all duration-1500 ease-out"
            style={{
              width: `${animatedWidth}%`,
              opacity: isVisible ? 1 : 0
            }}
          />
        </div>
      </Card>
    )
  }

  const CircularProgress = ({ percentage, label, color, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false)
    const radius = 30
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference
    
    useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay)
      return () => clearTimeout(timer)
    }, [delay, animationKey])
    
    const colorClasses = {
      green: "stroke-success",
      blue: "stroke-primary",
      purple: "stroke-accent-foreground"
    }
    
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-muted"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={isVisible ? strokeDashoffset : circumference}
              className={`${colorClasses[color]} transition-all duration-1500 ease-out`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs font-bold text-foreground chart-text-animate ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
              {percentage.toFixed(1)}%
            </span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground text-center">{label}</span>
      </div>
    )
  }

  const [showOptimizeParams, setShowOptimizeParams] = useState(false)
  const [optimizeParameters, setOptimizeParameters] = useState(null)

  const handleOptimizeFormula = () => {
    setShowOptimizeParams(true)
  }

  const handleAdvancedParametersChange = (newParameters) => {
    setOptimizeParameters(newParameters)
  }

  const handleVerifyFormula = async () => {
    setShowOptimizeParams(false)
    
    try {
      const isDAP = formData.productionBase && formData.productionBase.includes('1.8')
      
      // Get default payload based on production base
      let payload = {
        RM: isDAP ? 1.8 : 1.0,
        K2O_KCL: 58.0,
        S_DAS: 24.24,
        N_DAS: 21.21,
        B_H3BO3: 17.6,
        Zn_ZnO: 76.0,
        Cu_CuO: 24.0,
        Mg_MgO: isDAP ? 48.0 : 60.0,
        Cao_Chaux: isDAP ? 70.0 : 0.0,
        rendement_P2O5: 98.5,
        rendement_N: isDAP ? 98 : 97,
        rendement_H2SO4: 98.5,
        rendement_K2O: 98,
        rendement_B2O3: 98,
        rendement_ballast: isDAP ? 98 : 100,
        rendement_Zn: 90,
        rendement_Cu: 90,
        min_range: 60,
        max_range: 100,
        pas: 5,
        P2O5_NPK: formData.P2O5,
        N_NPK: formData.N,
        K2O_NPK: formData.K2O,
        B_NPK: formData.B,
        Zn_NPK: formData.Zn,
        Cu_NPK: formData.Cu,
        Mg_NPK: formData.Mn,
        Cao_NPK: formData.CaO
      }
      
      if (isDAP) {
        payload.S_NPK = 0.0
      }
      
      // Override with optimize parameters if they exist
      if (optimizeParameters) {
        payload = {
          ...payload,
          ...optimizeParameters
        }
      }
      
      console.log('Verifying formula with parameters:', payload)
      // Here you would make the API call when backend is ready
      // For now, just log the parameters
      
    } catch (error) {
       console.error('Error verifying formula:', error)
     }
   }

   const handleExportExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('NPK Formula Results')
      
      // Set column widths
      worksheet.columns = [
        { width: 25 },
        { width: 15 },
        { width: 10 }
      ]
      
      // Title with theme colors
      const titleRow = worksheet.addRow(['NPK Formula Verification Results'])
      titleRow.getCell(1).font = { size: 18, bold: true, color: { argb: 'FF000000' } }
      worksheet.mergeCells('A1:C1')
      titleRow.getCell(1).alignment = { horizontal: 'center' }
      titleRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0FDF4' } }
      
      const subtitleRow = worksheet.addRow([`Formula: NPK ${formData?.N}-${formData?.P2O5}-${formData?.K2O}`])
      subtitleRow.getCell(1).font = { size: 14, bold: true, color: { argb: 'FF22C55E' } }
      worksheet.mergeCells('A2:C2')
      subtitleRow.getCell(1).alignment = { horizontal: 'center' }
      
      const dateRow = worksheet.addRow([`Generated on ${new Date().toLocaleDateString()}`])
      dateRow.getCell(1).font = { size: 10, color: { argb: 'FF6B7280' } }
      worksheet.mergeCells('A3:C3')
      dateRow.getCell(1).alignment = { horizontal: 'center' }
      
      worksheet.addRow([]) // Empty row
      
      // Formula Details Section
      const formulaHeaderRow = worksheet.addRow(['Formula Details'])
      formulaHeaderRow.getCell(1).font = { size: 14, bold: true, color: { argb: 'FF22C55E' } }
      worksheet.mergeCells(`A${formulaHeaderRow.number}:C${formulaHeaderRow.number}`)
      formulaHeaderRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0FDF4' } }
      
      const tableHeader = worksheet.addRow(['Parameter', 'Value', 'Unit'])
      tableHeader.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF22C55E' } }
        cell.alignment = { horizontal: 'center' }
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' }
        }
      })
      
      const formulaData = [
        ['Nitrogen (N)', formData?.N || 0, '%'],
        ['Phosphorus (P₂O₅)', formData?.P2O5 || 0, '%'],
        ['Potassium (K₂O)', formData?.K2O || 0, '%'],
        ['Boron (B)', formData?.B || 0, '%'],
        ['Zinc (Zn)', formData?.Zn || 0, '%'],
        ['Copper (Cu)', formData?.Cu || 0, '%'],
        ['Manganese (Mn)', formData?.Mn || 0, '%'],
        ['Calcium Oxide (CaO)', formData?.CaO || 0, '%']
      ]
      
      formulaData.forEach((rowData, index) => {
        const row = worksheet.addRow(rowData)
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
          if (index % 2 === 0) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } }
          }
          if (colNumber === 2) {
            cell.alignment = { horizontal: 'center' }
            cell.font = { bold: true }
          }
        })
      })
      
      worksheet.addRow([]) // Empty row
      
      // Verification Results Section
      const resultsHeaderRow = worksheet.addRow(['Verification Results'])
      resultsHeaderRow.getCell(1).font = { size: 14, bold: true, color: { argb: 'FF22C55E' } }
      worksheet.mergeCells(`A${resultsHeaderRow.number}:C${resultsHeaderRow.number}`)
      resultsHeaderRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0FDF4' } }
      
      const statusRow = worksheet.addRow(['Status', verificationResult.possible ? '✓ Possible' : '✗ Impossible', ''])
      statusRow.getCell(2).font = { 
        bold: true, 
        color: { argb: verificationResult.possible ? 'FF22C55E' : 'FFEF4444' } 
      }
      statusRow.getCell(1).font = { bold: true }
      
      const messageRow = worksheet.addRow(['Message', verificationResult.message, ''])
      messageRow.getCell(2).alignment = { wrapText: true }
      messageRow.getCell(1).font = { bold: true }
      
      worksheet.addRow([]) // Empty row
      
      // Material Balance Section
      if (verificationResult.mainDetails?.bilans) {
        const balanceHeaderRow = worksheet.addRow(['Material Balance (for 100 Tons of Product)'])
        balanceHeaderRow.getCell(1).font = { size: 14, bold: true, color: { argb: 'FF22C55E' } }
        worksheet.mergeCells(`A${balanceHeaderRow.number}:C${balanceHeaderRow.number}`)
        balanceHeaderRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0FDF4' } }
        
        const balanceTableHeader = worksheet.addRow(['Material', 'Balance', 'Unit'])
        balanceTableHeader.eachCell((cell) => {
          cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF22C55E' } }
          cell.alignment = { horizontal: 'center' }
          cell.border = {
            top: { style: 'medium' },
            left: { style: 'medium' },
            bottom: { style: 'medium' },
            right: { style: 'medium' }
          }
        })
        
        Object.entries(verificationResult.mainDetails.bilans).forEach(([key, value], index) => {
          const row = worksheet.addRow([key.replace('Bilan ', ''), parseFloat(value).toFixed(2), 'T'])
          row.eachCell((cell, colNumber) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
            if (index % 2 === 0) {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } }
            }
            if (colNumber === 2) {
              cell.alignment = { horizontal: 'center' }
              cell.font = { bold: true }
            }
          })
        })
      }
      
      // Expected Yields Section
      if (verificationResult.mainDetails?.titres) {
        worksheet.addRow([]) // Empty row
        
        const yieldsHeaderRow = worksheet.addRow(['Expected Yields (Titres Attendus)'])
        yieldsHeaderRow.getCell(1).font = { size: 14, bold: true, color: { argb: 'FF22C55E' } }
        worksheet.mergeCells(`A${yieldsHeaderRow.number}:C${yieldsHeaderRow.number}`)
        yieldsHeaderRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0FDF4' } }
        
        const yieldsTableHeader = worksheet.addRow(['Component', 'Yield', 'Unit'])
        yieldsTableHeader.eachCell((cell) => {
          cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF22C55E' } }
          cell.alignment = { horizontal: 'center' }
          cell.border = {
            top: { style: 'medium' },
            left: { style: 'medium' },
            bottom: { style: 'medium' },
            right: { style: 'medium' }
          }
        })
        
        Object.entries(verificationResult.mainDetails.titres).forEach(([key, value], index) => {
          const row = worksheet.addRow([key, parseFloat(value).toFixed(2), '%'])
          row.eachCell((cell, colNumber) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
            if (index % 2 === 0) {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } }
            }
            if (colNumber === 2) {
              cell.alignment = { horizontal: 'center' }
              cell.font = { bold: true }
            }
          })
        })
      }
      
      // Generate and download
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `NPK_Formula_${formData?.N}-${formData?.P2O5}-${formData?.K2O}_Results.xlsx`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (error) {
      console.error('Error exporting to Excel:', error)
    }
  }

   const handleExportPDF = async () => {
     try {
       // Detect current theme
       const isDarkMode = document.documentElement.classList.contains('dark') || 
                         localStorage.getItem('theme') === 'dark'
       
       // Theme-aware color scheme - professional and comfortable
         const colors = isDarkMode ? {
           background: 'hsl(0, 0%, 8%)',        // --background: 0 0% 8%
           foreground: 'hsl(0, 0%, 98%)',       // --foreground: 0 0% 98%
           card: 'hsl(0, 0%, 12%)',             // --card: 0 0% 12%
           cardForeground: 'hsl(0, 0%, 98%)',   // --card-foreground: 0 0% 98%
           primary: 'hsl(120, 60%, 60%)',       // Green for accents only
           primaryForeground: 'hsl(0, 0%, 8%)', // Dark background for contrast
           secondary: 'hsl(120, 10%, 18%)',     // --secondary: 120 10% 18%
           muted: 'hsl(120, 8%, 16%)',          // --muted: 120 8% 16%
           mutedForeground: 'hsl(0, 0%, 65%)',  // --muted-foreground: 0 0% 65%
           border: 'hsl(120, 10%, 20%)',        // --border: 120 10% 20%
           success: 'hsl(120, 60%, 60%)',       // --success: 120 60% 60%
           destructive: 'hsl(0, 60%, 50%)',     // --destructive: 0 60% 50%
           tableHeader: 'hsl(0, 0%, 15%)',      // Neutral dark header
           tableHeaderText: 'hsl(0, 0%, 90%)',  // Light text on dark header
           tableRow1: 'hsl(0, 0%, 12%)',        // Card color
           tableRow2: 'hsl(0, 0%, 10%)'         // Slightly darker alternate
         } : {
           background: 'hsl(0, 0%, 98%)',       // --background: 0 0% 98%
           foreground: 'hsl(0, 0%, 0%)',        // --foreground: 0 0% 0%
           card: 'hsl(0, 0%, 100%)',            // --card: 0 0% 100%
           cardForeground: 'hsl(0, 0%, 0%)',    // --card-foreground: 0 0% 0%
           primary: 'hsl(120, 60%, 50%)',       // Green for accents only
           primaryForeground: 'hsl(0, 0%, 100%)', // White text on green
           secondary: 'hsl(0, 0%, 96%)',        // Neutral light grey
           muted: 'hsl(0, 0%, 94%)',            // Neutral muted
           mutedForeground: 'hsl(0, 0%, 40%)',  // --muted-foreground: 0 0% 40%
           border: 'hsl(0, 0%, 85%)',           // Neutral border
           success: 'hsl(120, 60%, 50%)',       // --success: 120 60% 50%
           destructive: 'hsl(0, 70%, 55%)',     // --destructive: 0 70% 55%
           tableHeader: 'hsl(0, 0%, 20%)',      // Professional dark grey header
           tableHeaderText: 'hsl(0, 0%, 100%)', // White text on dark header
           tableRow1: 'hsl(0, 0%, 98%)',        // Very light grey
           tableRow2: 'hsl(0, 0%, 100%)'        // White background
         }
       
       // Create a temporary div with the content to convert
       const element = document.createElement('div')
       element.innerHTML = `
         <div style="font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 12px; color: ${colors.foreground}; background: ${colors.background}; line-height: 1.3; font-size: 12px;">
           <!-- Header Section -->
           <div style="text-align: center; margin-bottom: 15px; padding: 10px; background: ${colors.card}; border-radius: 8px; border: 2px solid ${colors.primary}; box-shadow: 0 2px 4px rgba(0, 0, 0, ${isDarkMode ? '0.3' : '0.1'});">
             <h1 style="color: ${colors.foreground}; font-size: 16px; margin: 0 0 5px 0; font-weight: 700;">NPK Formula Verification Results</h1>
             <div style="background: ${colors.primary}; color: ${colors.primaryForeground}; padding: 4px 12px; border-radius: 12px; display: inline-block; margin-bottom: 8px;">
               <span style="font-size: 14px; font-weight: 600;">NPK ${formData?.N}-${formData?.P2O5}-${formData?.K2O}</span>
             </div>
             <p style="color: ${colors.mutedForeground}; font-size: 11px; margin: 0;">Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
           </div>
           
           <!-- Formula Details Section -->
           <div style="margin-bottom: 15px;">
             <div style="background: ${colors.card}; padding: 6px 10px; border-radius: 6px 6px 0 0; border-left: 3px solid ${colors.primary}; border: 1px solid ${colors.border};">
               <h2 style="color: ${colors.primary}; font-size: 13px; margin: 0; font-weight: 600; display: flex; align-items: center;">
                 <span style="background: ${colors.primary}; color: ${colors.primaryForeground}; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; margin-right: 6px; line-height: 1; text-align: center;">1</span>
                 Formula Composition
               </h2>
             </div>
             <table style="width: 100%; border-collapse: collapse; border: 1px solid ${colors.border};">
               <thead>
                 <tr style="background: ${colors.tableHeader};">
                   <th style="padding: 6px; text-align: left; color: ${colors.tableHeaderText}; font-weight: 600; font-size: 10px;">Parameter</th>
                   <th style="padding: 6px; text-align: center; color: ${colors.tableHeaderText}; font-weight: 600; font-size: 10px;">Value</th>
                   <th style="padding: 6px; text-align: center; color: ${colors.tableHeaderText}; font-weight: 600; font-size: 10px;">Unit</th>
                 </tr>
               </thead>
               <tbody>
                 ${[
                   ['Nitrogen (N)', formData?.N || 0],
                   ['Phosphorus (P₂O₅)', formData?.P2O5 || 0],
                   ['Potassium (K₂O)', formData?.K2O || 0],
                   ['Boron (B)', formData?.B || 0],
                   ['Zinc (Zn)', formData?.Zn || 0],
                   ['Copper (Cu)', formData?.Cu || 0],
                   ['Manganese (Mn)', formData?.Mn || 0],
                   ['Calcium Oxide (CaO)', formData?.CaO || 0]
                 ].filter(([param, value]) => value > 0).map(([param, value], index) => 
                   `<tr style="background-color: ${index % 2 === 0 ? colors.tableRow1 : colors.tableRow2};">
                     <td style="padding: 4px 6px; border-bottom: 1px solid ${colors.border}; font-size: 10px; color: ${colors.foreground};">${param}</td>
                     <td style="padding: 4px 6px; text-align: center; font-weight: 600; color: ${colors.primary}; border-bottom: 1px solid ${colors.border}; font-size: 10px;">${value}</td>
                     <td style="padding: 4px 6px; text-align: center; border-bottom: 1px solid ${colors.border}; color: ${colors.mutedForeground}; font-size: 10px;">%</td>
                   </tr>`
                 ).join('')}
               </tbody>
             </table>
           </div>
           
           <!-- Verification Results Section -->
           <div style="margin-bottom: 15px;">
             <div style="background: ${colors.card}; padding: 6px 10px; border-radius: 6px 6px 0 0; border-left: 3px solid ${colors.primary}; border: 1px solid ${colors.border};">
                <h2 style="color: ${colors.primary}; font-size: 13px; margin: 0; font-weight: 600; display: flex; align-items: center;">
                  <span style="background: ${colors.primary}; color: ${colors.primaryForeground}; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; margin-right: 6px; line-height: 1; text-align: center;">2</span>
                  Verification Results
                </h2>
              </div>
             <div style="background: ${colors.card}; border: 2px solid ${verificationResult.possible ? colors.success : colors.destructive}; border-radius: 0 0 6px 6px; padding: 8px;">
                <div style="background: ${verificationResult.possible ? colors.success : colors.destructive}; color: ${verificationResult.possible ? colors.primaryForeground : '#ffffff'}; padding: 3px 6px; border-radius: 8px; font-weight: 600; font-size: 10px; display: inline-block; margin-bottom: 6px;">
                  ${verificationResult.possible ? '✓ POSSIBLE' : '✗ IMPOSSIBLE'}
                </div>
                <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 600; color: ${verificationResult.possible ? colors.success : colors.destructive};">
                  ${verificationResult.possible ? '✓ Formula is Possible' : '✗ Formula is Impossible'}
                </p>
                <div style="background: ${colors.secondary}; padding: 6px; border-radius: 4px; border-left: 2px solid ${verificationResult.possible ? colors.success : colors.destructive};">
                  <p style="margin: 0; font-size: 10px; line-height: 1.3; color: ${colors.foreground};">${verificationResult.message}</p>
                </div>
              </div>
           </div>
           
           ${verificationResult.mainDetails?.bilans ? `
           <!-- Material Balance Section -->
           <div style="margin-bottom: 15px;">
              <div style="background: ${colors.card}; padding: 6px 10px; border-radius: 6px 6px 0 0; border-left: 3px solid ${colors.primary}; border: 1px solid ${colors.border};">
                <h2 style="color: ${colors.primary}; font-size: 13px; margin: 0; font-weight: 600; display: flex; align-items: center;">
                  <span style="background: ${colors.primary}; color: ${colors.primaryForeground}; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; margin-right: 6px; line-height: 1; text-align: center;">3</span>
                  Material Balance (for 100T)
                </h2>
              </div>
             <table style="width: 100%; border-collapse: collapse; border: 1px solid ${colors.border};">
               <thead>
                 <tr style="background: ${colors.tableHeader};">
                   <th style="padding: 6px; text-align: left; color: ${colors.tableHeaderText}; font-weight: 600; font-size: 10px;">Material</th>
                   <th style="padding: 6px; text-align: center; color: ${colors.tableHeaderText}; font-weight: 600; font-size: 10px;">Balance</th>
                   <th style="padding: 6px; text-align: center; color: ${colors.tableHeaderText}; font-weight: 600; font-size: 10px;">Unit</th>
                 </tr>
               </thead>
               <tbody>
                 ${Object.entries(verificationResult.mainDetails.bilans).map(([key, value], index) => 
                   `<tr style="background-color: ${index % 2 === 0 ? colors.tableRow1 : colors.tableRow2};">
                     <td style="padding: 4px 6px; border-bottom: 1px solid ${colors.border}; font-size: 10px; color: ${colors.foreground};">${key.replace('Bilan ', '')}</td>
                     <td style="padding: 4px 6px; text-align: center; font-weight: 600; color: ${colors.primary}; border-bottom: 1px solid ${colors.border}; font-size: 10px;">${parseFloat(value).toFixed(2)}</td>
                     <td style="padding: 4px 6px; text-align: center; border-bottom: 1px solid ${colors.border}; color: ${colors.mutedForeground}; font-size: 10px;">T</td>
                   </tr>`
                 ).join('')}
               </tbody>
             </table>
           </div>
           ` : ''}
           
           ${verificationResult.mainDetails?.titres ? `
           <!-- Expected Yields Section -->
           <div style="margin-bottom: 15px;">
              <div style="background: ${colors.card}; padding: 6px 10px; border-radius: 6px 6px 0 0; border-left: 3px solid ${colors.primary}; border: 1px solid ${colors.border};">
                <h2 style="color: ${colors.primary}; font-size: 13px; margin: 0; font-weight: 600; display: flex; align-items: center;">
                  <span style="background: ${colors.primary}; color: ${colors.primaryForeground}; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; margin-right: 6px; line-height: 1; text-align: center;">${verificationResult.mainDetails?.bilans ? '4' : '3'}</span>
                  Expected Yields
                </h2>
              </div>
             <table style="width: 100%; border-collapse: collapse; border: 1px solid ${colors.border};">
               <thead>
                 <tr style="background: ${colors.tableHeader};">
                   <th style="padding: 6px; text-align: left; color: ${colors.tableHeaderText}; font-weight: 600; font-size: 10px;">Component</th>
                   <th style="padding: 6px; text-align: center; color: ${colors.tableHeaderText}; font-weight: 600; font-size: 10px;">Yield</th>
                   <th style="padding: 6px; text-align: center; color: ${colors.tableHeaderText}; font-weight: 600; font-size: 10px;">Unit</th>
                 </tr>
               </thead>
               <tbody>
                 ${Object.entries(verificationResult.mainDetails.titres).map(([key, value], index) => 
                   `<tr style="background-color: ${index % 2 === 0 ? colors.tableRow1 : colors.tableRow2};">
                     <td style="padding: 4px 6px; border-bottom: 1px solid ${colors.border}; font-size: 10px; color: ${colors.foreground};">${key}</td>
                     <td style="padding: 4px 6px; text-align: center; font-weight: 600; color: ${colors.primary}; border-bottom: 1px solid ${colors.border}; font-size: 10px;">${parseFloat(value).toFixed(2)}</td>
                     <td style="padding: 4px 6px; text-align: center; border-bottom: 1px solid ${colors.border}; color: ${colors.mutedForeground}; font-size: 10px;">%</td>
                   </tr>`
                 ).join('')}
               </tbody>
             </table>
           </div>
           ` : ''}
           
           <!-- Footer Section -->
           <div style="margin-top: 15px; padding: 8px; background: ${colors.secondary}; border-radius: 6px; border: 1px solid ${colors.border}; text-align: center;">
             <h3 style="color: ${colors.primary}; font-size: 11px; margin: 0 0 3px 0; font-weight: 600;">NPK Formula Verification System</h3>
             <p style="margin: 0; color: ${colors.mutedForeground}; font-size: 9px; line-height: 1.3;">
               Report generated automatically • Contact system administrator for support
             </p>
           </div>
         </div>
       `
       
       // Configure html2pdf options
       const options = {
         margin: [0.2, 0.2, 0.2, 0.2],
         filename: `NPK_Formula_${formData?.N}-${formData?.P2O5}-${formData?.K2O}_Results.pdf`,
         image: { type: 'jpeg', quality: 0.98 },
         html2canvas: { 
           scale: 1.2,
           useCORS: true,
           letterRendering: true,
           allowTaint: true
         },
         jsPDF: { 
           unit: 'in', 
           format: 'a4', 
           orientation: 'portrait',
           compress: true
         }
       }
       
       // Generate and download PDF
       await html2pdf().set(options).from(element).save()
       
     } catch (error) {
       console.error('Error exporting to PDF:', error)
     }
   }

  // Calculate maxBilan with better error handling
  const maxBilan = (() => {
    try {
      const bilanValues = Object.values(verificationResult.mainDetails.bilans || {})
      if (bilanValues.length === 0) return 1
      const maxValue = Math.max(...bilanValues.map(val => Math.abs(parseFloat(val) || 0)))
      return Math.max(maxValue, 1) // Ensure minimum value of 1
    } catch (error) {
      console.warn('Error calculating maxBilan:', error)
      return 1
    }
  })()

  return (
    <div className="min-h-screen bg-background py-4 px-4">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-slide-in {
          animation: slideIn 0.6s ease-out;
        }
        .chart-text-animate {
          transition: opacity 0.5s ease-out;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground mb-1">
                Formula Verification Results
              </h1>
              <p className="text-muted-foreground text-xs">
                Analysis for NPK {formData?.N}-{formData?.P2O5}-{formData?.K2O} formula
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  onClick={handleExportExcel}
                  className="gap-1 text-xs h-8 px-2"
                  title="Export to Excel"
                >
                  <FileSpreadsheet className="icon-xs" />
                  Excel
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleExportPDF}
                  className="gap-1 text-xs h-8 px-2"
                  title="Export to PDF"
                >
                  <FileText className="icon-xs" />
                  PDF
                </Button>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/npk-verification')}
                className="gap-2 text-xs h-8 px-3"
              >
                <ArrowLeft className="icon-xs" />
                Back
              </Button>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`mb-4 p-3 rounded-lg border-l-4 ${
          verificationResult.possible 
            ? 'bg-success/10 border-l-success'
            : 'bg-destructive/10 border-l-destructive'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`${
              verificationResult.possible ? 'text-success' : 'text-destructive'
            }`}>
              {verificationResult.possible ? 
                <CheckCircle className="icon-lg" /> : 
                <AlertTriangle className="icon-lg" />
              }
            </div>
            <div className="flex-1">
              <h2 className={`text-base font-bold mb-1 ${
                verificationResult.possible 
                  ? 'text-success' 
                  : 'text-destructive'
              }`}>
                {verificationResult.possible ? 'Formula is Possible' : 'Formula is Impossible'}
              </h2>
              <p className={`text-xs ${
                verificationResult.possible 
                  ? 'text-success/80' 
                  : 'text-destructive/80'
              }`}>
                {verificationResult.message}
              </p>
            </div>
            {!verificationResult.possible && (
              <Button 
                onClick={handleOptimizeFormula}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8 px-3 gap-2"
              >
                <Settings className="icon-xs" />
                Optimize
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3">
          <TabsList className="grid w-full grid-cols-3 h-9">
            <TabsTrigger value="overview" className="text-xs gap-1.5">
              <BarChart3 className="icon-xs" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="balance" className="text-xs gap-1.5">
              <Scale className="icon-xs" />
              Balance
            </TabsTrigger>
            <TabsTrigger value="yields" className="text-xs gap-1.5">
              <Target className="icon-xs" />
              Yields
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <MetricCard 
                title="Nitrogen (N)" 
                value={verificationResult.mainDetails.N} 
                unit="%" 
                icon={Leaf}
              />
              <MetricCard 
                title="Phosphorus (P₂O₅)" 
                value={verificationResult.mainDetails.P2O5} 
                unit="%" 
                icon={Beaker}
              />
              <MetricCard 
                title="Potassium (K₂O)" 
                value={formData?.K2O || 0} 
                unit="%" 
                icon={Zap}
              />
              <MetricCard 
                title="Ballast Balance" 
                value={verificationResult.mainDetails.bilans.Ballast.toFixed(2)} 
                unit="T" 
                icon={verificationResult.mainDetails.bilans.Ballast >= 0 ? CheckSquare : XSquare}
                color={verificationResult.mainDetails.bilans.Ballast >= 0 ? "success" : "error"}
              />
            </div>

            {/* NPK Composition Visualization */}
            <Card className="p-3">
              <h3 className="text-sm font-semibold mb-3 text-foreground">
                NPK Composition Analysis
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {(() => {
                  const nValue = parseFloat(verificationResult.mainDetails.N) || 0
                  const pValue = parseFloat(verificationResult.mainDetails.P2O5) || 0
                  const kValue = parseFloat(formData?.K2O || 0)
                  const total = nValue + pValue + kValue
                  
                  if (total === 0) {
                    return (
                      <div className="col-span-3 text-center text-muted-foreground text-sm">
                        No composition data available
                      </div>
                    )
                  }
                  
                  return (
                    <>
                      <CircularProgress 
                        percentage={(nValue / total) * 100}
                        label="Nitrogen (N)"
                        color="green"
                        delay={400}
                      />
                      <CircularProgress 
                        percentage={(pValue / total) * 100}
                        label="Phosphorus (P₂O₅)"
                        color="blue"
                        delay={500}
                      />
                      <CircularProgress 
                        percentage={(kValue / total) * 100}
                        label="Potassium (K₂O)"
                        color="purple"
                        delay={600}
                      />
                    </>
                  )
                })()}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="balance">
            <Card className="p-3">
              <h3 className="text-sm font-semibold mb-3 text-foreground">
                Material Balance for 100 Tons of Product
              </h3>
              <div className="space-y-3">
                {verificationResult.mainDetails.bilans ? 
                  Object.entries(verificationResult.mainDetails.bilans).map(([key, value], index) => {
                    const numericValue = parseFloat(value) || 0
                    return (
                      <ProgressBar 
                        key={`${key}-${animationKey}`}
                        label={`Bilan ${key}`}
                        value={numericValue}
                        max={maxBilan}
                        delay={index * 100}
                      />
                    )
                  }) : 
                  <div className="text-center text-muted-foreground text-sm">
                    No balance data available
                  </div>
                }
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="yields">
            <Card className="p-3">
              <h3 className="text-sm font-semibold mb-3 text-foreground">
                Expected Yields (Titres Attendus)
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {Object.entries(verificationResult.mainDetails.titres).map(([key, value], index) => {
                  const maxYield = Math.max(...Object.values(verificationResult.mainDetails.titres))
                  const percentage = maxYield > 0 ? (value / maxYield) * 100 : 0
                  
                  return (
                    <YieldCard 
                      key={`${key}-${animationKey}`}
                      label={key}
                      value={value}
                      percentage={percentage}
                      delay={index * 100}
                    />
                  )
                })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/npk-verification')}
            className="gap-2 text-xs h-8 px-3"
          >
            <ArrowLeft className="icon-xs" />
            New Verification
          </Button>
          <div className="flex gap-2">
            {!verificationResult.possible && (
              <Button 
                onClick={handleOptimizeFormula}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-xs h-8 px-3"
              >
                <Settings className="icon-xs" />
                Optimize Formula
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Optimize Parameters Dialog */}
      <OptimizeParameters 
        open={showOptimizeParams} 
        onOpenChange={setShowOptimizeParams}
        productionBase={formData?.productionBase || ""}
        onParametersChange={handleAdvancedParametersChange}
        advancedParameters={optimizeParameters}
      />
    </div>
  )
}

export default VerificationResults