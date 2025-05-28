import React, { useState, useEffect, useRef } from 'react';
import {
  Grid, Typography, IconButton, Paper, Box, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import PreviewPopup from "../Forms/Add_Clinical_Form/Clinical_Preview";
import axiosInstance from "../components/AxiosInstance";
import { formatDateTime } from "../data/Clinical_CheckList";

const ISRC_Member = () => {
  const [data, setData] = useState([]);
  const fetchOnce = useRef(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [submittedComments, setSubmittedComments] = useState([]);
  const commonTextStyle = { fontSize: "18px" };

  const handleView = (item) => {
    setSelectedData(item);
    setOpenPreview(true);
  };

  const handleCommentClick = (item) => {
    setSelectedData(item);
    setComment('');
    setStatus('');
    setCommentDialogOpen(true);
  };

  const handleCommentSubmit = () => {
    if (!comment || !status) {
        alert("Please enter a comment and select status");
        return;
    }
    setSubmittedComments((prev) => [...prev, { id: selectedData?.id, comment, status, }]);
    setCommentDialogOpen(false);
  };

  const fetchData = async () => {
    if (fetchOnce.current) return;
    try {
      fetchOnce.current = true;
      const response = await axiosInstance.get("/api/clinical/list");
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err.message);
      alert("Error occurred while fetching data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      <Typography sx={{ fontSize: "25px", fontWeight: 500 }}>Clinical Trial List</Typography>

      <Box>
        {/* Header */}
        <Grid container spacing={2} sx={{ backgroundColor: '#4b1d77', color: 'white', p: 2, borderRadius: "5px 5px 0 0" }}>
          <Grid item size={2}><Typography sx={commonTextStyle}>Study Title</Typography></Grid>
          <Grid item size={2}><Typography sx={commonTextStyle}>Submission Date</Typography></Grid>
          <Grid item size={2}><Typography sx={commonTextStyle}>Principal Investigator</Typography></Grid>
          <Grid item size={2}><Typography sx={commonTextStyle}>Department</Typography></Grid>
          <Grid item size={2}><Typography sx={commonTextStyle}>Status</Typography></Grid>
          <Grid item size={1}><Typography sx={commonTextStyle}>View</Typography></Grid>
          <Grid item size={1}><Typography sx={commonTextStyle}>Comment</Typography></Grid>
        </Grid>

        {/* Data Rows */}
        {data.length > 0 ? (
          data.map((item) => (
            <Paper key={item?.id} elevation={2}>
              <Grid container spacing={2} alignItems="center" sx={{ p: 1.2, border: "0.5px solid #e3dddd" }}>
                <Grid item size={2}><Typography sx={commonTextStyle}>{item?.administration?.study_title}</Typography></Grid>
                <Grid item size={2}><Typography sx={commonTextStyle}>{formatDateTime(item?.administration?.submission_date)}</Typography></Grid>
                <Grid item size={2}><Typography sx={commonTextStyle}>{item?.administration?.name}</Typography></Grid>
                <Grid item size={2}><Typography sx={commonTextStyle}>{item?.administration?.department}</Typography></Grid>
                <Grid item size={2}><Typography sx={commonTextStyle}>{"under review"}</Typography></Grid>
                <Grid item size={1}>
                  <IconButton onClick={() => handleView(item)}>
                    <VisibilityIcon sx={{ color: "rebeccapurple" }} />
                  </IconButton>
                </Grid>
                <Grid item size={1}>
                  <IconButton onClick={() => handleCommentClick(item)}>
                    <CommentIcon sx={{ color: "green" }} />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))
        ) : (
          <Typography sx={{ ...commonTextStyle, fontWeight: 600, textAlign: "center", py: 2 }}>
            Data does not exist for the user
          </Typography>
        )}

        {/* Preview Popup */}
        {selectedData?.administration && (
          <PreviewPopup
            open={openPreview}
            onClose={() => setOpenPreview(false)}
            formData={{
              administration: selectedData.administration,
              researchers: selectedData.researchers,
              participants: selectedData.participants,
              benefits: selectedData.benefits,
              paymentState: selectedData.paymentState,
              storage: selectedData.storage,
              additional: selectedData.additional,
              checkListData: selectedData.checkListData,
            }}
          />
        )}

        {/* Comment Dialog */}
        <Dialog open={commentDialogOpen} onClose={() => setCommentDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Comment" multiline rows={4} value={comment} onChange={(e) => setComment(e.target.value)}
              fullWidth
            />
            <RadioGroup row value={status} onChange={(e) => setStatus(e.target.value)}>
              <FormControlLabel value="approved" control={<Radio />} label="Approved" />
              <FormControlLabel value="rejected" control={<Radio />} label="Rejected" />
              <FormControlLabel value="review" control={<Radio />} label="Review" />
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCommentDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCommentSubmit}>Send</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default React.memo(ISRC_Member);
