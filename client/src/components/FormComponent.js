import React, { useState } from 'react';
import axiosInstance from "../components/AxiosInstance";

const inlineStyles = {
  container: { borderRadius: '8px', width: '100%', maxWidth: '800px' },
  field: { marginBottom: '18px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
  input: { padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' },
  radioGroup: { display: 'flex', gap: '15px' },
  textarea: { padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' },
  button: { margin: '10px 5px', padding: '10px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#007BFF', color: '#fff', cursor: 'pointer' },
  previewImage: { width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }
};

const FormComponent = ({ formTitle, fields, formName }) => {
  const initialState = fields.reduce((acc, field) => {
    acc[field.name] = field.type === 'file' ? null : '';
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialState);
  const [previewMode, setPreviewMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({ ...formData, [name]: type === 'file' ? files[0] : value });
    if (type === 'file') setImagePreview(URL.createObjectURL(files[0]));
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setPreviewMode(true);
  };

  const handleEdit = () => setPreviewMode(false);

  const handleSubmit = async () => {
    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => formPayload.append(key, value));

    try {
      await axiosInstance.post('/api/niec/forms', formPayload, {
        params: { tableName: formName },
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Form submitted successfully!');
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Form submission failed!');
    }
  };

  return (
    <div style={inlineStyles.container}>
      <h2>{formTitle}</h2>
      {!previewMode ? (
        <form onSubmit={handlePreview}>
          {fields.map((field) => (
            <div key={field.name} style={inlineStyles.field}>
              <label style={inlineStyles.label}>{field.label}</label>
              {field.type === 'text' ? (
                <input type="text" name={field.name} value={formData[field.name]} onChange={handleChange} style={inlineStyles.input} required={field.required} />
              ) : field.type === 'select' ? (
                <select name={field.name} value={formData[field.name]} onChange={handleChange} style={inlineStyles.input} required={field.required}>
                  <option value="">Select</option>
                  {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : field.type === 'radio' ? (
                <div style={inlineStyles.radioGroup}>
                  {['Yes', 'No', 'N/A'].map((opt) => (
                    <label key={opt}>
                      <input type="radio" name={field.name} value={opt} checked={formData[field.name] === opt} onChange={handleChange} required={field.required} /> {opt}
                    </label>
                  ))}
                </div>
              ) : field.type === 'textarea' ? (
                <textarea name={field.name} value={formData[field.name]} onChange={handleChange} rows="4" style={inlineStyles.textarea} required={field.required} />
              ) : field.type === 'file' ? (
                <>
                  <input type="file" name={field.name} onChange={handleChange} required={field.required} />
                  {imagePreview && <img src={imagePreview} alt="Preview" style={inlineStyles.previewImage} />}
                </>
              ) : field.type === 'date' ? (
                <input type="date" name={field.name} value={formData[field.name]} onChange={handleChange} style={inlineStyles.input} required={field.required} />
              ) : null}
            </div>
          ))}
          <button type="submit" style={inlineStyles.button}>Preview</button>
        </form>
      ) : (
        <>
          {fields.map((field) => (
            <div key={field.name} style={inlineStyles.field}>
              <strong>{field.label}:</strong>{' '}
              {field.type === 'file' ? (
                imagePreview ? <img src={imagePreview} alt="Preview" style={inlineStyles.previewImage} /> : 'No Image'
              ) : (
                <span>{formData[field.name] || 'N/A'}</span>
              )}
            </div>
          ))}
          <button onClick={handleEdit} style={{ ...inlineStyles.button, backgroundColor: '#6c757d' }}>Edit</button>
          <button onClick={handleSubmit} style={inlineStyles.button}>Submit</button>
        </>
      )}
    </div>
  );
};

export default FormComponent;
