import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { createDataset, renameDataset, deleteDataset } from '@/redux/slices/invoicesSlice';
import { setActiveDatasetName } from '@/redux/slices/uiSlice';
import { selectDatasetNames } from '@/redux/selectors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Assuming Select is available

const DatasetManager: React.FC = () => {
  const dispatch = useDispatch();
  const datasetNames = useSelector(selectDatasetNames);
  const activeDatasetName = useSelector((state: RootState) => state.ui.activeDatasetName);

  const [newDatasetName, setNewDatasetName] = useState('');
  // State for more advanced operations (optional for now)
  // const [renamingDataset, setRenamingDataset] = useState<string | null>(null);
  // const [newName, setNewName] = useState('');

  useEffect(() => {
    // If no dataset is active and datasets exist, activate the first one.
    if (!activeDatasetName && datasetNames.length > 0) {
      dispatch(setActiveDatasetName(datasetNames[0]));
    }
    // If no datasets exist, ensure activeDatasetName is null (it should be already by uiSlice initial state)
    if (datasetNames.length === 0 && activeDatasetName !== null) {
        dispatch(setActiveDatasetName(null));
    }
  }, [datasetNames, activeDatasetName, dispatch]);

  const handleCreateDataset = () => {
    if (newDatasetName.trim() && !datasetNames.includes(newDatasetName.trim())) {
      dispatch(createDataset(newDatasetName.trim()));
      dispatch(setActiveDatasetName(newDatasetName.trim()));
      setNewDatasetName('');
    } else if (datasetNames.includes(newDatasetName.trim())) {
      // Handle error: dataset name already exists
      alert('Dataset name already exists.');
    }
  };

  const handleSelectDataset = (name: string) => {
    dispatch(setActiveDatasetName(name));
  };

  // Optional: Rename and Delete handlers
  // const handleRenameDataset = (oldName: string) => {
  //   if (newName.trim() && oldName !== newName.trim() && !datasetNames.includes(newName.trim())) {
  //     dispatch(renameDataset({ oldName, newName: newName.trim() }));
  //     if (activeDatasetName === oldName) {
  //       dispatch(setActiveDatasetName(newName.trim()));
  //     }
  //     setRenamingDataset(null);
  //     setNewName('');
  //   } else {
  //     alert('Invalid new name or name already exists.');
  //   }
  // };

  // const handleDeleteDataset = (name: string) => {
  //   if (window.confirm(`Are you sure you want to delete dataset "${name}"? This action cannot be undone.`)) {
  //     dispatch(deleteDataset(name));
  //     if (activeDatasetName === name) {
  //       dispatch(setActiveDatasetName(datasetNames.length > 1 ? datasetNames.filter(dn => dn !== name)[0] : null));
  //     }
  //   }
  // };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Manage Datasets</h3>
        <div className="flex space-x-2">
          <Input
            type="text"
            value={newDatasetName}
            onChange={(e) => setNewDatasetName(e.target.value)}
            placeholder="New dataset name"
            className="flex-grow"
          />
          <Button onClick={handleCreateDataset}>Create</Button>
        </div>
      </div>

      {datasetNames.length > 0 ? (
        <div>
          <label htmlFor="dataset-select" className="block text-sm font-medium text-gray-700 mb-1">
            Active Dataset
          </label>
          <Select value={activeDatasetName || ''} onValueChange={handleSelectDataset}>
            <SelectTrigger id="dataset-select">
              <SelectValue placeholder="Select a dataset" />
            </SelectTrigger>
            <SelectContent>
              {datasetNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                  {/* Optional: Add rename/delete buttons here or in a separate management list */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No datasets available. Please create one.</p>
      )}

      {/* Optional: More detailed list for rename/delete actions */}
      {/* {datasetNames.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-semibold mb-2">Existing Datasets:</h4>
          <ul className="space-y-2">
            {datasetNames.map(name => (
              <li key={name} className="flex justify-between items-center p-2 border rounded">
                {renamingDataset === name ? (
                  <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="New name"/>
                ) : name}
                <div className="space-x-2">
                  {renamingDataset === name ? (
                    <Button size="sm" onClick={() => handleRenameDataset(name)}>Save</Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => { setRenamingDataset(name); setNewName(name); }}>Rename</Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteDataset(name)}>Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default DatasetManager;
