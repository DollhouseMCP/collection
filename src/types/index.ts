/**
 * Type definitions for DollhouseMCP Collection
 */

// Base metadata shared by all content types
export interface BaseMetadata {
  name: string;
  description: string;
  unique_id: string;
  author: string;
  category: 'creative' | 'educational' | 'gaming' | 'personal' | 'professional';
  version?: string;
  created_date?: string;
  updated_date?: string;
  tags?: string[];
  license?: string;
}

// Content-specific metadata extensions
export interface PersonaMetadata extends BaseMetadata {
  type: 'persona';
  triggers?: string[];
  age_rating?: 'all' | '13+' | '18+';
  content_flags?: string[];
  ai_generated?: boolean;
  generation_method?: 'human' | 'ChatGPT' | 'Claude' | 'hybrid';
  price?: string;
  revenue_split?: string;
}

export interface SkillMetadata extends BaseMetadata {
  type: 'skill';
  capabilities: string[];
  requirements?: string[];
  compatibility?: string[];
}

export interface AgentMetadata extends BaseMetadata {
  type: 'agent';
  capabilities: string[];
  tools_required?: string[];
  model_requirements?: string;
}

export interface PromptMetadata extends BaseMetadata {
  type: 'prompt';
  input_variables?: string[];
  output_format?: string;
  examples?: string[];
}

export interface TemplateMetadata extends BaseMetadata {
  type: 'template';
  format: string;
  variables?: string[];
  use_cases?: string[];
}

export interface ToolMetadata extends BaseMetadata {
  type: 'tool';
  mcp_version: string;
  parameters?: Record<string, any>;
  returns?: string;
}

export interface EnsembleMetadata extends BaseMetadata {
  type: 'ensemble';
  agents: string[];
  coordination_strategy?: string;
  use_cases?: string[];
}

// Union type for all content metadata
export type ContentMetadata = 
  | PersonaMetadata 
  | SkillMetadata 
  | AgentMetadata 
  | PromptMetadata 
  | TemplateMetadata 
  | ToolMetadata 
  | EnsembleMetadata;

// Validation types
export interface ValidationIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  details: string;
  line?: number | null;
  suggestion?: string;
}

export interface ValidationSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface ValidationResult {
  passed: boolean;
  summary: ValidationSummary;
  issues: ValidationIssue[];
  markdown: string;
}

// Collection configuration
export interface CollectionConfig {
  collection: {
    name: string;
    description: string;
    version: string;
    created_date: string;
    repository: string;
    main_project: string;
    website: string;
    license: string;
    maintainer: {
      name: string;
      email: string;
      github: string;
    };
  };
  content_types: Record<string, ContentTypeConfig>;
  categories: Record<string, CategoryConfig>;
  areas: Record<string, AreaConfig>;
  submission_process: {
    methods: string[];
    review_stages: string[];
    quality_standards: {
      required: string[];
      security: string[];
      quality: string[];
    };
  };
  api_endpoints: Record<string, string>;
  tools_integration: {
    mcp_commands: string[];
  };
  licensing: {
    platform_license: string;
    content_license: string;
    commercial_use: string;
    attribution_required: boolean;
    revenue_sharing: {
      free_content: string;
      premium_split: string;
    };
  };
  stats: {
    total_items: number;
    content_types: number;
    categories: number;
    contributors: number;
    last_updated: string;
  };
}

export interface ContentTypeConfig {
  name: string;
  description: string;
  path: string;
  icon: string;
  categories: string[];
}

export interface CategoryConfig {
  name: string;
  description: string;
  icon: string;
  keywords: string[];
}

export interface AreaConfig {
  name: string;
  description: string;
  access: 'public' | 'premium';
}

// Content item structure
export interface ContentItem<T extends ContentMetadata = ContentMetadata> {
  metadata: T;
  content: string;
  filePath: string;
  area: 'library' | 'showcase' | 'catalog';
}