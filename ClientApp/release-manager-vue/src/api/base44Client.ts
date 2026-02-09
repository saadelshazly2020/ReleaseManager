import axios from 'axios';
import type { AxiosInstance } from 'axios';

const API_BASE_URL = '/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface EntityClient<T> {
  list: (sort?: string) => Promise<T[]>;
  get: (id: string) => Promise<T>;
  create: (entityData: Partial<T>) => Promise<T>;
  update: (id: string, entityData: Partial<T>) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

const createEntityClient = <T>(entityName: string): EntityClient<T> => ({
  list: async (sort = '-created_date'): Promise<T[]> => {
    const { data } = await api.get<T[]>(`/${entityName}`);
    return data;
  },

  get: async (id: string): Promise<T> => {
    const { data } = await api.get<T>(`/${entityName}/${id}`);
    return data;
  },

  create: async (entityData: Partial<T>): Promise<T> => {
    const { data } = await api.post<T>(`/${entityName}`, entityData);
    return data;
  },

  update: async (id: string, entityData: Partial<T>): Promise<void> => {
    await api.put(`/${entityName}/${id}`, entityData);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/${entityName}/${id}`);
  },
});

// Entity Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  code?: string;
  status: 'active' | 'on_hold' | 'completed' | 'archived';
  teamId?: string;
  team?: Team;
  createdDate: string;
  updatedDate: string;
  createdBy?: string;
  releases?: Release[];
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  lead?: string;
  membersCount: number;
  color?: string;
  createdDate: string;
  updatedDate: string;
  createdBy?: string;
  projects?: Project[];
  releases?: Release[];
}

export interface Release {
  id: string;
  name: string;
  version: string;
  description?: string;
  status: 'planning' | 'in_progress' | 'testing' | 'ready_for_deploy' | 'deployed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  projectId?: string;
  teamId?: string;
  scheduledDate?: string;
  deployedDate?: string;
  releaseNotes?: string;
  createdDate: string;
  updatedDate: string;
  createdBy?: string;
  project?: Project;
  team?: Team;
  releaseItems?: ReleaseItem[];
}

export interface ReleaseItem {
  id: string;
  title: string;
  description?: string;
  type: 'feature' | 'bug_fix' | 'improvement' | 'breaking_change' | 'security' | 'documentation';
  status: 'pending' | 'in_progress' | 'completed';
  releaseId?: string;
  ticketNumber?: string;
  assignedTo?: string;
  createdDate: string;
  updatedDate: string;
  createdBy?: string;
  release?: Release;
}

// Main API client
export const base44 = {
  entities: {
    Release: createEntityClient<Release>('releases'),
    Project: createEntityClient<Project>('projects'),
    Team: createEntityClient<Team>('teams'),
    ReleaseItem: createEntityClient<ReleaseItem>('releaseitems'),
  },
};

export default base44;
