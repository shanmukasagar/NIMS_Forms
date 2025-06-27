import React from 'react';
import {formatDateandTime} from "./Funded_Config";

const inlineStyles = {
    field: { marginBottom: '18px',  },
    button: { padding: '10px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#4b1d77', color: '#ffffff', cursor: 'pointer', fontSize: '15px',
      fontWeight: 500   },
    previewImage: { width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }
};

const FUNDED_Form_Preview = ({formData, imagePreview, fields, isSubmitted}) => {
    return (
        <React.Fragment>
            {fields.map((field) => (
                <div key={field.name} style={inlineStyles.field}>
                    <strong>{field.label}:</strong>{' '}
                    {field.type === 'file' ? (
                        imagePreview ? <img src={imagePreview} alt="Preview" style={inlineStyles.previewImage} /> : 'No Image'
                    ) : (
                        <span>{formData?.[field.name] || 'N/A'}</span>
                    )}
                </div>
            ))}
            {
                isSubmitted && (
                    <React.Fragment>
                        <div  style={inlineStyles.field}>
                            <strong>Email:</strong>{' '}
                            <span>{ formData['email'] || 'N/A'}</span>
                        </div>
                        <div  style={inlineStyles.field}>
                            <strong>Submitted on:</strong>{' '}
                            <span>{formatDateandTime(formData['submitted_at'] || formData['created_at']) || 'N/A'}</span>
                        </div>
                    </React.Fragment>
                )
            }
        </React.Fragment>
    )
}

export default FUNDED_Form_Preview;
