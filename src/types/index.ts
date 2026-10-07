export interface ProjectFileMap {
  [filePath: string]: string;
}

export interface UserSession {
  id: string;
  name?: string | null;
  email?: string | null;
  credits: number;
  role: string;
}

export interface ProjectData {
  id: string;
  title: string;
  description?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  versions?: {
    id: string;
    versionNumber: number;
    prompt: string;
    filesJson: string;
    createdAt: string | Date;
  }[];
}
