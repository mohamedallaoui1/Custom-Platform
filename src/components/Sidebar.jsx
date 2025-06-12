import { useState } from 'react'
import { Home, TestTubes, FileText, Database, BarChart, Menu, Sun, Moon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Link } from 'react-router-dom'
import { useTheme } from '@/components/ui/theme-provider'
import { darkModeClasses } from '@/lib/theme-config'
import ocpLogo from '../assets/ocp-green.svg'

const Sidebar = ({ isCollapsed, onCollapse }) => {
const { theme, setTheme } = useTheme()
const menuItems = [
{ icon: Home, label: 'Dashboard', path: '/', disabled: true },
{ icon: TestTubes, label: 'NPK Verification', path: '/npk-verification', disabled: false },
{ icon: FileText, label: 'Formulations', path: '/formulations', disabled: true },
{ icon: Database, label: 'Compounds Database', path: '/compounds', disabled: true },
{ icon: BarChart, label: 'Reports', path: '/reports', disabled: true }
]

return (
<aside
className={cn(
"group fixed left-0 top-0 z-30 flex h-screen flex-col border-r bg-card shadow-sm transition-all duration-300 border-border",
isCollapsed ? "w-16" : "w-64"
)}
>
<button
onClick={() => onCollapse(!isCollapsed)}
className={cn(
"absolute -right-3 top-6 z-40 flex h-6 w-6 items-center justify-center rounded-full border bg-card shadow-md transition-transform duration-300 hover:bg-accent border-border",
isCollapsed && "rotate-180"
)}
>
<Menu className="icon-xs text-muted-foreground" />
</button>
<div className="flex h-14 items-center border-b border-border px-4">
<div className="flex items-center gap-2">
<TestTubes className="icon-lg text-success" />
{!isCollapsed && <span className="font-semibold text-base text-foreground">Customization Platform</span>}
</div>
</div>

<nav className="flex-1 space-y-1 p-2">
{menuItems.map((item, index) => (
<Link
key={index}
to={item.path}
className={cn(
"flex w-full items-center gap-3 rounded-lg p-2.5 transition-all duration-300",
item.disabled ? "pointer-events-none cursor-not-allowed opacity-50 hover:bg-transparent text-muted-foreground" : "text-muted-foreground hover:bg-accent hover:text-success active:bg-accent/80",
!isCollapsed && "justify-start",
isCollapsed && "justify-center"
)}
>
<item.icon className={cn("icon-base transition-colors", !item.disabled && "group-hover:text-success")} />
{!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
</Link>
))}
</nav>

<div className="flex flex-col gap-2 border-t border-border p-4">
<button
onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
className={cn(
"flex items-center gap-2 rounded-lg p-2.5 text-muted-foreground hover:bg-accent hover:text-success transition-all duration-300",
!isCollapsed && "justify-start",
isCollapsed && "justify-center"
)}
>
{theme === 'dark' ? (
<Sun className="icon-base" />
) : (
<Moon className="icon-base" />
)}
{!isCollapsed && (
<span className="text-sm font-medium">
{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
</span>
)}
</button>
<div className={cn(
"flex items-center justify-center",
isCollapsed ? "h-16" : "h-20"
)}>
<img
src={ocpLogo}
alt="OCP Logo"
className={cn(
"transition-all duration-300",
isCollapsed ? "w-8" : "w-24"
)}
/>
</div>
</div>
</aside>
)
}

export default Sidebar