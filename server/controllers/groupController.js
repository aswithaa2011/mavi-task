import { supabase } from '../config/supabase.js';

// GET /api/groups — list all groups
export const getGroups = async (req, res) => {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
};

// POST /api/groups — create a new group
export const createGroup = async (req, res) => {
  const { name, icon, summary } = req.body;

  if (!name || !summary) {
    return res.status(400).json({ message: 'name and summary are required.' });
  }

  const { data, error } = await supabase
    .from('groups')
    .insert([{ name, icon, summary }])
    .select()
    .single();

  if (error) return res.status(500).json({ message: error.message });
  res.status(201).json(data);
};

// DELETE /api/groups/:id — delete a group
export const deleteGroup = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('groups')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: 'Group deleted.' });
};
