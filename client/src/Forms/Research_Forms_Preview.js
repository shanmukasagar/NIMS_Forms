import React from 'react';

const inlineStyles = {
    field: { marginBottom: '18px' },
    button: { padding: '10px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#4b1d77', color: '#ffffff', cursor: 'pointer', fontSize: '15px',
      fontWeight: 500   },
    previewImage: { width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }
};

const Research_Forms_Preview = () => {
    return (
        <React.Fragment>
            {fields.map((field) => (
                <div key={field.name} style={inlineStyles.field}>
                    <strong>{field.label}:</strong>{' '}
                    {field.type === 'file' ? ( imagePreview ? <img src={imagePreview} alt="Preview" style={inlineStyles.previewImage} /> : 'No Image' ) : 
                    ( <span>{formData[field.name] || 'N/A'}</span> )}
                </div>
            ))}
            <div style = {{ display : "flex", justifyContent : "center", gap : "60px"}}>
                <button onClick={handleEdit} style={{ ...inlineStyles.button, backgroundColor: '#6c757d' }}>Edit</button>
                <button onClick={handleSubmit} style={inlineStyles.button}>Submit</button>
            </div>
        </React.Fragment>
    )
}

export default Research_Forms_Preview