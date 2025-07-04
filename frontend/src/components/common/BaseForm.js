// frontend/src/components/common/BaseForm.js
import React, { useState } from 'react';
import './BaseForm.css';

const BaseForm = ({ 
  fields, 
  initialValues = {}, 
  onSubmit, 
  submitLabel = "Submit",
  loading = false,
  errors = {}
}) => {
  const [formData, setFormData] = useState(initialValues);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] || '',
      onChange: (e) => handleChange(field.name, e.target.value),
      required: field.required,
      disabled: loading
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={field.rows || 3}
            placeholder={field.placeholder}
          />
        );
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select {field.label}</option>
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'file':
        return (
          <input
            type="file"
            {...commonProps}
            accept={field.accept}
            multiple={field.multiple}
            onChange={(e) => handleChange(field.name, e.target.files)}
          />
        );
      default:
        return (
          <input
            type={field.type || 'text'}
            {...commonProps}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="base-form">
      {fields.map((field) => (
        <div key={field.name} className="form-group">
          <label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="required">*</span>}
          </label>
          {renderField(field)}
          {errors[field.name] && (
            <span className="error-message">{errors[field.name]}</span>
          )}
        </div>
      ))}
      <button type="submit" disabled={loading} className="submit-button">
        {loading ? 'Submitting...' : submitLabel}
      </button>
    </form>
  );
};

export default BaseForm;
