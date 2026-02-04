import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { contactsAPI } from '../services/api';
import ContactModal from '../components/ContactModal';
import './Dashboard.css';

const Dashboard = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterFavorite, setFilterFavorite] = useState(false);
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');

    const { logout, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadTags();
    }, []);

    useEffect(() => {
        loadContacts();
    }, [searchTerm, currentPage, filterFavorite, selectedTag]);

    const loadTags = async () => {
        try {
            const response = await contactsAPI.getTags();
            setAvailableTags(response.data.tags || []);
        } catch (error) {
            console.error('Failed to load tags:', error);
        }
    };

    const loadContacts = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 10,
            };

            if (searchTerm) {
                params.search = searchTerm;
            }

            if (filterFavorite) {
                params.favorite = 'true';
            }

            if (selectedTag) {
                params.tag = selectedTag;
            }

            const response = await contactsAPI.getAll(params);
            setContacts(response.data.contacts);
            setTotalPages(response.data.pagination.totalPages);
        } catch (error) {
            console.error('Failed to load contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleAddContact = () => {
        setSelectedContact(null);
        setShowModal(true);
    };

    const handleEditContact = (contact) => {
        setSelectedContact(contact);
        setShowModal(true);
    };

    const handleDeleteContact = async (id) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            try {
                await contactsAPI.delete(id);
                loadContacts();
                loadTags(); // Refresh tags after deletion
            } catch (error) {
                console.error('Failed to delete contact:', error);
                alert('Failed to delete contact');
            }
        }
    };

    const handleToggleFavorite = async (id) => {
        try {
            await contactsAPI.toggleFavorite(id);
            loadContacts();
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    };

    const handleModalClose = (shouldRefresh) => {
        setShowModal(false);
        setSelectedContact(null);
        if (shouldRefresh) {
            loadContacts();
            loadTags(); // Refresh tags after adding/editing
        }
    };

    const handleTagSelect = (tag) => {
        if (selectedTag === tag) {
            setSelectedTag(''); // Deselect if clicking the same tag
        } else {
            setSelectedTag(tag);
        }
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSelectedTag('');
        setFilterFavorite(false);
        setSearchTerm('');
        setCurrentPage(1);
    };

    const parseTags = (tagsString) => {
        if (!tagsString) return [];
        return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="dashboard-logo">
                    <span className="logo-icon">📇</span>
                    <span className="logo-text">ContactManager</span>
                </div>

                <div className="dashboard-actions">
                    <input
                        type="text"
                        placeholder="Search contacts"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="search-input"
                    />

                    <button onClick={handleLogout} className="logout-button">
                        <span className="logout-icon">Logout</span>
                    </button>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="content-header">
                    <h1 className="page-title">Dashboard</h1>
                    <button onClick={handleAddContact} className="add-button">
                        Add New Contact
                    </button>
                </div>

                <div className="filter-section">
                    <div className="filter-row">
                        <label className="filter-checkbox">
                            <input
                                type="checkbox"
                                checked={filterFavorite}
                                onChange={(e) => {
                                    setFilterFavorite(e.target.checked);
                                    setCurrentPage(1);
                                }}
                            />
                            <span>Show favorites only</span>
                        </label>

                        {(selectedTag || filterFavorite || searchTerm) && (
                            <button onClick={clearFilters} className="clear-filters-btn">
                                Clear all filters
                            </button>
                        )}
                    </div>

                    {availableTags.length > 0 && (
                        <div className="tags-filter-section">
                            <div className="tags-filter-label">Filter by tag:</div>
                            <div className="tags-filter-list">
                                {availableTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => handleTagSelect(tag)}
                                        className={`tag-filter-button ${selectedTag === tag ? 'active' : ''}`}
                                    >
                                        {tag}
                                        {selectedTag === tag && ' ✕'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="loading">Loading contacts...</div>
                ) : contacts.length === 0 ? (
                    <div className="empty-state">
                        <p>No contacts found</p>
                        {(selectedTag || filterFavorite || searchTerm) ? (
                            <button onClick={clearFilters} className="add-button-secondary">
                                Clear filters
                            </button>
                        ) : (
                            <button onClick={handleAddContact} className="add-button-secondary">
                                Add your first contact
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="contacts-table-container">
                            <table className="contacts-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Tags</th>
                                        <th>Favorite</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts.map((contact) => (
                                        <tr key={contact.id}>
                                            <td>
                                                <div className="contact-name-cell">
                                                    {contact.name}
                                                    {contact.company && (
                                                        <span className="contact-company">{contact.company}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>{contact.phone}</td>
                                            <td>
                                                <a href={`mailto:${contact.email}`} className="email-link">
                                                    {contact.email}
                                                </a>
                                            </td>
                                            <td>
                                                <div className="contact-tags">
                                                    {parseTags(contact.tags).length > 0 ? (
                                                        parseTags(contact.tags).map((tag, index) => (
                                                            <span key={index} className="contact-tag">
                                                                {tag}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="no-tags">-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleToggleFavorite(contact.id)}
                                                    className="favorite-button"
                                                >
                                                    {contact.is_favorite ? '⭐' : '☆'}
                                                </button>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        onClick={() => handleEditContact(contact)}
                                                        className="edit-button"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteContact(contact.id)}
                                                        className="delete-button"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="pagination-button"
                                >
                                    Previous
                                </button>
                                <span className="pagination-info">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="pagination-button"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        <div className="contacts-count">
                            Showing {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
                            {selectedTag && ` with tag "${selectedTag}"`}
                            {filterFavorite && ' (favorites)'}
                        </div>
                    </>
                )}
            </div>

            {showModal && (
                <ContactModal
                    contact={selectedContact}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
};

export default Dashboard;
