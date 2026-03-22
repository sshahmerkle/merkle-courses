import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const resourcesFile = path.join(process.cwd(), 'content', 'resources.json');

interface ResourceEntry {
  id: string;
  name: string;
  description: string;
  url: string;
  type: string;
  category: string;
}

function readResources(): ResourceEntry[] {
  if (!fs.existsSync(resourcesFile)) return [];
  try {
    return JSON.parse(fs.readFileSync(resourcesFile, 'utf-8'));
  } catch {
    return [];
  }
}

function writeResources(data: ResourceEntry[]): void {
  const dir = path.dirname(resourcesFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(resourcesFile, JSON.stringify(data, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.json(readResources());
  }

  if (req.method === 'POST') {
    const { name, description, url, type, category } = req.body;
    if (!name || !url) return res.status(400).json({ error: 'name and url are required' });

    const resources = readResources();
    const newResource: ResourceEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      description: description || '',
      url,
      type: type || 'link',
      category: category || '',
    };
    resources.push(newResource);
    writeResources(resources);
    return res.status(201).json(newResource);
  }

  if (req.method === 'PUT') {
    const { id } = req.query as { id: string };
    if (!id) return res.status(400).json({ error: 'id is required' });

    const resources = readResources();
    const idx = resources.findIndex((r) => r.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Resource not found' });

    resources[idx] = { ...resources[idx], ...req.body, id };
    writeResources(resources);
    return res.json(resources[idx]);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query as { id: string };
    if (!id) return res.status(400).json({ error: 'id is required' });

    const resources = readResources();
    const filtered = resources.filter((r) => r.id !== id);
    if (filtered.length === resources.length) return res.status(404).json({ error: 'Resource not found' });

    writeResources(filtered);
    return res.json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
