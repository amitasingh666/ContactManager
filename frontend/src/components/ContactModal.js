import React, { useState, useEffect } from 'react';
import { contactsAPI } from '../services/api';
import './ContactModal.css';

const ContactModal = ({ contact, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        company: '',
        tags: '',
        notes: '',
        is_favorite: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [availableTags, setAvailableTags] = useState([]);
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);

    useEffect(() => {
        loadTags();
        if (contact) {
            setFormData({
                name: contact.name || '',
                phone: contact.phone || '',
                email: contact.email || '',
                company: contact.company || '',
                tags: contact.tags || '',
                notes: contact.notes || '',
                is_favorite: contact.is_favorite || false,
            });
        }
    }, [contact]);

    const loadTags = async () => {
        try {
            const response = await contactsAPI.getTags();
            setAvailableTags(response.data.tags || []);
        } catch (error) {
            console.error('Failed to load tags:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleTagClick = (tag) => {
        const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];
        if (!currentTags.includes(tag)) {
            const newTags = [...currentTags, tag].join(', ');
            setFormData({ ...formData, tags: newTags });
        }
        setShowTagSuggestions(false);
    };

    const removeTag = (tagToRemove) => {
        const currentTags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
        const newTags = currentTags.filter(t => t !== tagToRemove).join(', ');
        setFormData({ ...formData, tags: newTags });
    };

    const getCurrentTags = () => {
        return formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];
    };

    const getUnusedTags = () => {
        const currentTags = getCurrentTags();
        return availableTags.filter(tag => !currentTags.includes(tag));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.name || !formData.phone || !formData.email) {
            setError('Name, phone, and email are required');
            return;
        }

        setLoading(true);

        try {
            if (contact) {
                await contactsAPI.update(contact.id, formData);
            } else {
                await contactsAPI.create(formData);
            }
            onClose(true); // Close and refresh
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save contact');
        } finally {
            setLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <button onClick={() => onClose(false)} className="back-button">
                        ← Back to Dashboard
                    </button>
                    <h2 className="modal-title">Contact Details</h2>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter name"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone *</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="company">Company</label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Enter company (optional)"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">
                            Tags / Groups
                            <span className="label-hint">Organize your contacts with tags</span>
                        </label>

                        {getCurrentTags().length > 0 && (
                            <div className="selected-tags">
                                {getCurrentTags().map((tag, index) => (
                                    <span key={index} className="selected-tag">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="remove-tag-btn"
                                            disabled={loading}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            onFocus={() => setShowTagSuggestions(true)}
                            placeholder="Enter tags (comma-separated) e.g., work, client, friend"
                            disabled={loading}
                        />

                        {showTagSuggestions && getUnusedTags().length > 0 && (
                            <div className="tag-suggestions">
                                <div className="tag-suggestions-label">Suggested tags:</div>
                                <div className="tag-suggestions-list">
                                    {getUnusedTags().map((tag, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleTagClick(tag)}
                                            className="tag-suggestion-btn"
                                            disabled={loading}
                                        >
                                            + {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="tag-examples">
                            <small>Examples: work, client, family, friend, important, vip</small>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="notes">Notes</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Enter notes (optional)"
                            rows="4"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group-checkbox">
                        <label>
                            <input
                                type="checkbox"
                                name="is_favorite"
                                checked={formData.is_favorite}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <span>⭐ Mark as favorite</span>
                        </label>
                    </div>

                    {error && <div className="form-error">{error}</div>}

                    <div className="form-actions">
                        {contact && (
                            <button
                                type="button"
                                onClick={async () => {
                                    if (window.confirm('Are you sure you want to delete this contact?')) {
                                        try {
                                            await contactsAPI.delete(contact.id);
                                            onClose(true);
                                        } catch (err) {
                                            setError('Failed to delete contact');
                                        }
                                    }
                                }}
                                className="delete-btn"
                                disabled={loading}
                            >
                                Delete
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="cancel-btn"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="save-btn"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactModal;
