---
name: dollhouse-config-ui
description: >-
  Interactive UI for viewing and managing Dollhouse MCP configuration settings
  with organized sections, descriptions, and easy editing
author: mickdarling
version: 1.0.1
created: '2025-10-18T18:39:52.957Z'
modified: '2025-10-18T18:39:52.957Z'
tags: []
dependencies:
  - 'dollhousemcp:dollhouse_config'
custom: {}
triggers: []
languages: []
complexity: intermediate
domains:
  - configuration
  - ui
  - settings
prerequisites: []
parameters: []
examples: []
proficiency_level: 0
---
# Dollhouse Configuration UI Skill

## Overview

This skill creates an interactive, user-friendly interface for viewing and editing Dollhouse MCP configuration settings. Instead of raw YAML, it presents settings in an organized, cate

gorized format with descriptions, validation, and easy editing.

## Capabilities

### Display

- Organized sections

- Settings grouped by cate

gory User, Git

Hub, Sync, etc.

- Clear descriptions

- Each setting includes explanation of what it does

- Current values

- Shows whats currently configured

- Visual indicators

- Icons and colors for different setting types

- Collapsible sections

- Expand/collapse cate

gories for easier navigation

### Editing

- Interactive controls

- Toggle switches for booleans, input fields for text/numbers

- Inline editing

- Click to edit directly in the interface

- Validation

- Checks values before saving

- Confirmation

- Shows what will change before applying

- Undo support

- Can revert changes if needed

### Presentation Formats

1. React Artifact

- Full interactive web UI recommended

2. HTML Report

- Static view with edit links

3. Structured Text

- Clean terminal-style display

## Code Exemplars

### Method 1: React Interactive UI Recommended

pythonfrom pdf2image import convert_from_pathimport base64from io import BytesIOdef create_config_ui_react:
  Create an interactive React-based configuration UI.    This generates a React artifact that shows all settings with inline editing.            # First, get the current configuration    config = get_dollhouse_config        # Generate React component code    react_code = import React,  useState  from reactimport  Settings, User, Github, Database, Eye, Package, CheckCircle, XCircle  from lucide-reactconst DollhouseConfigUI =  =   const [config, setConfig] = useState + json.dumpsconfig +   const [editMode, setEditMode] = useState  const [pendingChanges, setPendingChanges] = useState  const sections =     user:
  icon: User,      title: User Settings,      description: Your personal information and identity settings,      settings:
  username:
  label: Username,          description: Your Dollhouse username,          type: text,          required: true        ,        email:
  label: Email,          description: Optional email for notifications,          type: email,          required: false        ,        display_name:
  label: Display Name,          description: Name shown in UI defaults to username,          type: text,          required: false                  ,    github:
  icon: Github,      title: GitHub Integration,      description: GitHub portfolio and authentication settings,      settings:
  portfolio.repository_name:
  label: Portfolio Repository,          description: Name of your GitHub portfolio repository,          type: text,          default: dollhouse-portfolio        ,        portfolio.auto_create:
  label: Auto-Create Repository,          description: Automatically create portfolio repo if missing,          type: boolean        ,        auth.use_oauth:
  label: Use OAuth,          description: Use OAuth for GitHub authentication,          type: boolean                  ,    sync:
  icon: Database,      title: Synchronization,      description: Control how elements sync with GitHub,      settings:
  enabled:
  label: Sync Enabled,          description: Master switch for sync functionality,          type: boolean        ,        individual.require_confirmation:
  label: Require Confirmation,          description: Ask before syncing individual elements,          type: boolean        ,        individual.show_diff_before_sync:
  label: Show Diff,          description: Display changes before syncing,          type: boolean        ,        individual.track_versions:
  label: Track Versions,          description: Keep version history of synced elements,          type: boolean        ,        individual.keep_history:
  label: History Depth,          description: Number of versions to keep,          type: number,          min: 1,          max: 100        ,        bulk.upload_enabled:
  label: Bulk Upload,          description: Allow uploading multiple elements at once,          type: boolean        ,        bulk.download_enabled:
  label: Bulk Download,          description: Allow downloading multiple elements at once,          type: boolean                  ,    display:
  icon: Eye,      title: Display  UI,      description: Control how information is displayed,      settings:
  persona_indicators.enabled:
  label: Persona Indicators,          description: Show active persona indicators,          type: boolean        ,        persona_indicators.style:
  label: Indicator Style,          description: Visual style for persona indicators,          type: select,          options: [minimal, full, compact, none]        ,        persona_indicators.include_emoji:
  label: Include Emoji,          description: Show emoji in persona indicators,          type: boolean        ,        verbose_logging:
  label: Verbose Logging,          description: Show detailed debug information,          type: boolean        ,        show_progress:
  label: Show Progress,          description: Display progress indicators for operations,          type: boolean                  ,    elements:
  icon: Package,      title: Elements  Indexing,      description: Enhanced index and element management settings,      settings:
  enhanced_index.enabled:
  label: Enhanced Index,          description: Enable advanced search and relation

ship features,          type: boolean        ,        enhanced_index.limits.maxTriggersPerElement:
  label: Max Triggers,          description: Maximum trigger words per element,          type: number,          min: 10,          max: 200        ,        enhanced_index.limits.maxKeywordsToCheck:
  label: Max Keywords,          description: Maximum keywords to check in searches,          type: number,          min: 50,          max: 500        ,        enhanced_index.telemetry.enabled:
  label: Telemetry,          description: Enable anonymous usage metrics,          type: boolean        ,        enhanced_index.telemetry.sampleRate:
  label: Sample Rate,          description: Percentage of operations to sample 0.1 = 10%,          type: number,          min: 0,          max: 1,          step: 0.1                      const getNestedValue = obj, path =     return path.split..reducecurr, key = curr.[key], obj    const setNestedValue = obj, path, value =     const keys = path.split.    const lastKey = keys.pop    const target = keys.reducecurr, key =       if curr[key] curr[key] =       return curr[key]    , obj    target[lastKey] = value    const handleEdit = section, setting =     setEditMode ...editMode, [section.setting]: true     const handleChange = section, setting, value =     const fullPath = section.setting    setPendingChanges ...pendingChanges, [fullPath]: value     const handleSave = section, setting =     const fullPath = section.setting    const value = pendingChanges[fullPath]        // Here you would call the dollhouse_config tool    console.logSaving fullPath = value        // Update local state    const newConfig =  ...config     setNestedValuenewConfig, fullPath, value    setConfignewConfig        // Clear edit mode    const newEditMode =  ...editMode     delete newEditMode[fullPath]    setEditModenewEditMode        const newPending =  ...pendingChanges     delete newPending[fullPath]    setPendingChangesnewPending    const handleCancel = section, setting =     const fullPath = section.setting    const newEditMode =  ...editMode     delete newEditMode[fullPath]    setEditModenewEditMode        const newPending =  ...pendingChanges     delete newPending[fullPath]    setPendingChangesnewPending    const renderValue = section, settingKey, settingConfig =     const fullPath = section.settingKey    const currentValue = getNestedValueconfig, fullPath    const isEditing = editMode[fullPath]    const pendingValue = pendingChanges[fullPath]    if isEditing       return         div className=flex items-center gap-2          settingConfig.type === boolean              input              type=checkbox              checked=pendingValue  currentValue              onChange=e = handleChangesection, settingKey, e.target.checked              className=w-4 h-4            /           : settingConfig.type === select              select              value=pendingValue  currentValue              onChange=e = handleChangesection, settingKey, e.target.value              className=px-2 py-1 border rounded                          settingConfig.options.mapopt =                 option key=opt value=optopt/option                          /select           : settingConfig.type === number              input              type=number              value=pendingValue  currentValue              onChange=e = handleChangesection, settingKey, parseFloate.target.value              min=settingConfig.min              max=settingConfig.max              step=settingConfig.step  1              className=px-2 py-1 border rounded w-24            /           :
  input              type=settingConfig.type              value=pendingValue  currentValue                onChange=e = handleChangesection, settingKey, e.target.value              placeholder=settingConfig.default              className=px-2 py-1 border rounded flex-1            /                    button            onClick= = handleSavesection, settingKey            className=px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600                      Save          /button          button            onClick= = handleCancelsection, settingKey            class

Name=px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600                      Cancel          /button
