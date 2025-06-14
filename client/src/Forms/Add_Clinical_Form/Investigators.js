import React, { useEffect } from 'react';
import { Box, TextField, Typography, Grid } from '@mui/material';

const Investigators = ({ researchers, setResearchers }) => {
  const fieldNames = ['name', 'designation', 'qualification', 'department', 'email', 'contact'];

  const normalizeType = (researcher) => researcher.type || researcher.role || '';

  // Ensure at least 1 principal, 1 guide, 2 co-investigators
  useEffect(() => {
    const counts = {
      principal: 0,
      guide: 0,
      'co-investigator': 0,
    };

    researchers.forEach((r) => {
      const role = normalizeType(r);
      if (counts[role] !== undefined) counts[role]++;
    });

    const updatedResearchers = [...researchers];

    if (counts.principal === 0) {
      updatedResearchers.push({ type: 'principal' });
    }
    if (counts.guide === 0) {
      updatedResearchers.push({ type: 'guide' });
    }
    while (counts['co-investigator'] < 2) {
      updatedResearchers.push({ type: 'co-investigator' });
      counts['co-investigator']++;
    }

    if (updatedResearchers.length !== researchers.length) {
      setResearchers(updatedResearchers);
    }
  }, [researchers, setResearchers]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updated = [...researchers];
    updated[index][name] = value;
    setResearchers(updated);
  };

  const getLabel = (type) => {
    if (type === 'principal') return 'Principal Investigator';
    if (type === 'guide') return 'Guide';
    return 'Co-Investigator';
  };

  const getGroupedResearchers = (groupType) =>
    researchers
      .map((item, index) => ({
        ...item,
        _index: index,
        normalizedType: normalizeType(item),
      }))
      .filter(item => item.normalizedType === groupType);

  return (
    <Box>
      {['principal', 'guide', 'co-investigator'].map((type) => (
        <Box key={type} sx={{ mb: 3 }}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>{getLabel(type)}</Typography>
          <Grid container spacing={2}>
            {getGroupedResearchers(type).map((inv) =>
              fieldNames.map((field, fieldIdx) => (
                <Grid item xs={12} md={4} key={`${type}-${inv._index}-${fieldIdx}`}>
                  <TextField
                    fullWidth
                    required={normalizeType(inv) === 'principal'}
                    variant="outlined"
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    value={inv[field] || ''}
                    onChange={(e) => handleChange(e, inv._index)}
                  />
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default React.memo(Investigators);
