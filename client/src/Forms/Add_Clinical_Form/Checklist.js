import React, { useCallback , useEffect} from 'react';
import { Grid, Typography, IconButton, Tooltip } from '@mui/material';

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// ✅ Memoized Row Component
const ChecklistRow = React.memo(({ item, index, isEdit, handleFileChange }) => (
  <Grid container spacing={2} alignItems="center">
    <Grid item size={7}>
      <Typography> {`${index + 1}. ${item.label}`} {item.required && <span style={{ color: 'red' }}> *</span>} </Typography>
    </Grid>
    <Grid item size={3}>
      <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, index)} required = {isEdit ? false : item.required}
        style={{ padding: '6px 16px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#f5f5f5' }} />
      {item.file ? (
        <Tooltip title="View uploaded PDF">
          <IconButton onClick={() => { const fileURL = URL.createObjectURL(item.file); window.open(fileURL, '_blank'); 
            window.open(fileURL, '_blank'); }} sx={{ ml: 1 }} >
            <PictureAsPdfIcon color="error" />
          </IconButton>
        </Tooltip>
      ) : item.file_name && (
            <Tooltip title="View uploaded PDF">
              <IconButton
                onClick={() => window.open(`http://localhost:4000/media/clinical/checklist/${item.file_name}`, "_blank")}
              >
                <PictureAsPdfIcon color="error" />
              </IconButton>
            </Tooltip>
        )}
    </Grid>
  </Grid>
));

// ✅ Main Checklist Component
const Checklist = ({ consentData, setCheckListData, checkListData, isEdit }) => {

  useEffect(() => {
    if(isEdit) {
      const updatedCheckListData = checkListData.map(item => ({
          ...item,
          required: item.file_name !== null,
        }));

      setCheckListData(updatedCheckListData);
    }

  }, [isEdit])

  const handleFileChange = useCallback(
  (e, index) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      e.target.value = null; // Reset the file input
      return;
    }

    setCheckListData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], file };
      return updated;
    });
  },
  [setCheckListData]
);


  return (
    <>
      {checkListData.map((item, index) => (
        <ChecklistRow key={item.id} item={item} index={index} isEdit = {isEdit} handleFileChange={handleFileChange} />
      ))}
    </>
  );
};

export default React.memo(Checklist);
