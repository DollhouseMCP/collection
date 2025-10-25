---
name: website-darkmode-injector
description: >-
  Instantly adds professional dark/light mode toggle to any website with CSS
  variables, localStorage persistence, and smooth transitions
author: mick
version: 1.0.0
created: '2025-09-04T21:39:03.396Z'
modified: '2025-09-04T21:39:03.396Z'
tags:
  - web-development
  - dark-mode
  - ui
  - css
  - javascript
dependencies: []
custom: {}
languages:
  - html
  - css
  - javascript
complexity: beginner
domains:
  - frontend
  - ui-ux
prerequisites:
  - basic-html
  - basic-css
parameters: []
examples: []
proficiency_level: 0
---
# Website Dark Mode InjectorA drop-in solution for adding professional dark/light mode toggle to any website. Provides CSS variables, local

Storage persistence, smooth transitions, and an elegant toggle button.

## Features

- Instant Integration: Single code block adds complete dark mode

- CSS Variables: Easy customization via CSS custom properties

- LocalStorage: Remembers user preference across sessions

- System Preference: Respects OS dark mode setting by default

- Smooth Transitions: Professional fade effects when switching

- Accessible: Keyboard navigation and ARIA labels

- No Dependencies: Pure vanilla Java

Script and CSS

## Quick Implementation

### Step 1: Add CSS Variables to Your HTML Headhtmlstyle  :root     / Light mode colors default /    --bg-primary: #ffffff    --bg-secondary: #f8f9fa    --bg-tertiary: #e9ecef    --text-primary: #212529    --text-secondary: #6c757d    --text-muted: #adb5bd    --border-color: #dee2e6    --shadow-sm: 0 1px 2px rgba0,0,0,0.05    --shadow-md: 0 4px 6px rgba0,0,0,0.1    --shadow-lg: 0 10px 15px rgba0,0,0,0.1    --link-color: #0066cc    --link-hover: #0052a3    --accent-primary: #007bff    --accent-secondary: #6c757d    --success-color: #28a745    --warning-color: #ffc107    --danger-color: #dc3545    --code-bg: #f4f4f4    --code-text: #e83e8c    [data-theme=dark]     / Dark mode colors /    --bg-primary: #1a1a1a    --bg-secondary: #2d2d2d    --bg-tertiary: #404040    --text-primary: #e4e4e4    --text-secondary: #b0b0b0    --text-muted: #808080    --border-color: #404040    --shadow-sm: 0 1px 2px rgba0,0,0,0.3    --shadow-md: 0 4px 6px rgba0,0,0,0.4    --shadow-lg: 0 10px 15px rgba0,0,0,0.5    --link-color: #66b3ff    --link-hover: #4da3ff    --accent-primary: #4da3ff    --accent-secondary: #808080    --success-color: #52c41a    --warning-color: #faad14    --danger-color: #ff4d4f    --code-bg: #2d2d2d    --code-text: #ff79c6    / Smooth transitions /       transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease    / Apply variables to body /  body     background-color: var--bg-primary    color: var--text-primary    / Common elements /  a     color: var--link-color    a:hover     color: var--link-hover    h1, h2, h3, h4, h5, h6     color: var--text-primary    code     background: var--code-bg    color: var--code-text    padding: 2px 6px    border-radius: 3px    / Theme toggle button styles /  .theme-toggle     position: fixed    top: 20px    right: 20px    z-index: 9999    background: var--bg-secondary    border: 2px solid var--border-color    border-radius: 50px    padding: 10px    cursor: pointer    display: flex    align-items: center    justify-content: center    width: 50px    height: 50px    box-shadow: var--shadow-md    transition: all 0.3s ease    .theme-toggle:hover     transform: scale1.1    box-shadow: var--shadow-lg    .theme-toggle:active     transform: scale0.95    .theme-toggle svg     width: 24px    height: 24px    fill: var--text-primary    transition: transform 0.3s ease    .theme-toggle:hover svg     transform: rotate20deg    / Hide inactive icon /  [data-theme=light] .moon-icon     display: block    [data-theme=light] .sun-icon     display: none    [data-theme=dark] .moon-icon     display: none    [data-theme=dark] .sun-icon     display: block  /style

### Step 2: Add the Toggle Button to Your Bodyhtml-

- Theme Toggle Button --button class=theme-toggle id=theme-toggle aria-label=Toggle dark mode  svg class=moon-icon xmlns=http://www.w3.org/2000/svg viewBox=0 0 24 24    path d=M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z/  /svg  svg class=sun-icon xmlns=http://www.w3.org/2000/svg view

Box=0 0 24 24    circle cx=12 cy=12 r=5/    line x1=12 y1=1 x2=12 y2=3/    line x1=12 y1=21 x2=12 y2=23/    line x1=4.22 y1=4.22 x2=5.64 y2=5.64/    line x1=18.36 y1=18.36 x2=19.78 y2=19.78/    line x1=1 y1=12 x2=3 y2=12/    line x1=21 y1=12 x2=23 y2=12/    line x1=4.22 y1=19.78 x2=5.64 y2=18.36/    line x1=18.36 y1=5.64 x2=19.78 y2=4.22/  /svg/button

### Step 3: Add JavaScript Before Closing Body Taghtmlscript  // Dark Mode Toggle Script  function     // Get users theme preference    function getThemePreference       const savedTheme = localStorage.getItemtheme      if savedTheme         return savedTheme            // Check system preference      if window.matchMedia  window.matchMediaprefers-color-scheme: dark.matches         return dark            return light        // Apply theme    function applyThemetheme       document.documentElement.setAttributedata-theme, theme      localStorage.setItemtheme, theme        // Initialize theme    const currentTheme = getThemePreference    applyThemecurrentTheme    // Toggle theme    const toggleButton = document.getElementByIdtheme-toggle    if toggleButton       toggleButton.addEventListenerclick, function         const current = document.documentElement.getAttributedata-theme        const next = current === dark  light : dark        applyThemenext              // Listen for system theme changes    if window.matchMedia       window.matchMediaprefers-color-scheme: dark.addEventListenerchange, e =         if localStorage.getItemtheme           apply

Themee.matches  dark : light                    /script

## Alternative: Floating Toggle Position

Replace the .theme-toggle CSS with this for a bottom-right position:css.theme-toggle   position: fixed  bottom: 20px  right: 20px  / rest of styles remain the same /

## Alternative: Inline Toggle in Header

For a toggle thats part of your navigation:htmlnav  -

- Your nav items -

-  button class=theme-toggle-inline id=theme-toggle aria-label=Toggle dark mode    span class=theme-icon🌙/span  /button/navstyle  .theme-toggle-inline     background: transparent    border: none    font-size: 24px    cursor: pointer    padding: 5px 10px    transition: transform 0.3s ease    .theme-toggle-inline:hover     transform: scale1.2    [data-theme=light] .theme-icon::after     content: 🌙    [data-theme=dark] .theme-icon::after     content: ☀️  /style

## Complete One-File ExamplehtmlDOCTYPE htmlhtml lang=enhead  meta charset=UTF-8  meta name=viewport content=width=device-width, initial-scale=1.0  titleDark Mode Example/title  style    :root       --bg-primary: #ffffff      --text-primary: #212529      --accent: #007bff        [data-theme=dark]       --bg-primary: #1a1a1a      --text-primary: #e4e4e4      --accent: #4da3ff               transition: background-color 0.3s ease, color 0.3s ease        body       background: var--bg-primary      color: var--text-primary      font-family: system-ui, -apple-system, sans-serif      margin: 0      padding: 40px      min-height: 100vh        h1       color: var--accent        .theme-toggle       position: fixed      top: 20px      right: 20px      background: var--accent      color: white      border: none      border-radius: 25px      padding: 10px 20px      cursor: pointer      font-size: 16px        .theme-toggle:hover       opacity: 0.8      /style/headbody  button class=theme-toggle id=theme-toggle    span data-theme-text🌙 Dark/span  /button  h1Hello, Dark Mode/h1  pThis page automatically switches between light and dark themes./p  script    function       const getTheme =  = localStorage.getItemtheme          window.matchMediaprefers-color-scheme: dark.matches  dark : light            const setTheme = theme =         document.documentElement.setAttributedata-theme, theme        localStorage.setItemtheme, theme        const btn = document.querySelector[data-theme-text]        if btn btn.textContent = theme === dark  ☀️ Light : 🌙 Dark            setThemegetTheme      document.getElementByIdtheme-toggle.addEventListenerclick,  =         const current = document.documentElement.getAttributedata-theme        set

Themecurrent === dark  light : dark            /script/body/html

## Usage Tips

1. Customize Colors: Adjust the CSS variables to match your brand

2. Add More Variables: Extend with variables for spacing, fonts, etc.

3. Component Styling: Use the variables throughout your CSS:
  css   .card      background: var--bg-secondary     border: 1px solid var--border-color     color: var--text-primary

4. Prevent Fla

sh: Add this to prevent fla

sh of wrong theme:
  html   script     // Add this in head before any CSS     document.documentElement.setAttributedata-theme,        localStorage.get

Itemtheme  light   /script   #

# Framework Integration

### React Componentjsxconst ThemeToggle =  =   const [theme, setTheme] = useStatelocalStorage.getItemtheme  light    useEffect =     document.documentElement.setAttributedata-theme, theme    localStorage.setItemtheme, theme  , [theme]  return     button onClick= = set

Themetheme === dark  light : dark      theme === dark  ☀️ : 🌙    /button  #

## Vue Componentvuetemplate  button @click=toggleTheme     theme === dark  ☀️ : 🌙   /button/templatescriptexport default   data     return       theme: localStorage.getItemtheme  light      ,  mounted     this.applyTheme  ,  methods:
  toggleTheme       this.theme = this.theme === dark  light : dark      this.applyTheme    ,    applyTheme       document.documentElement.setAttributedata-theme, this.theme      localStorage.set

Itemtheme, this.theme      /script

## Best Practices

1. Test Contrast: Ensure text is readable in both modes WCAG AA minimum

2. Images: Consider using CSS filters for images in dark mode:
  css   [data-theme=dark] img      opacity: 0.8     filter: brightness0.8

3. Shadows: Adjust shadows for dark mode darker backgrounds need different shadows

4. Transitions: Keep transitions under 300ms for snappy feel

5. Accessibility: Always include ARIA labels and keyboard support

This skill provides everything needed to add professional dark/light mode to any website with just a copy-paste
