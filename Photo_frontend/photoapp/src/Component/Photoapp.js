import React, { useState, useEffect } from "react";

const PhotoManagement = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [personData, setPersonData] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);

  // API base URL
  const API_URL = "https://localhost:44332/api/PhotoApplication";

  // Helper function to convert base64 string to image URL
  const base64ToImageUrl = (base64String) => {
    if (!base64String || base64String.length === 0) return null;
    try {
      // Check if it's already a data URL
      if (base64String.startsWith('data:')) {
        return base64String;
      }
      
      // If it's just the base64 string without the data URL prefix, add it
      return `data:image/jpeg;base64,${base64String}`;
    } catch (error) {
      console.error('Error converting base64 to image:', error);
      return null;
    }
  };

  // Handle file upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear uploaded image
  const clearUploadedImage = () => {
    setUploadedImage(null);
    // Reset the file input
    const fileInput = document.getElementById('imageUpload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Spinner component
  const Spinner = () => (
    <div style={{ 
      border: '4px solid #f3f3f3', 
      borderTop: '4px solid #3498db', 
      borderRadius: '50%', 
      width: '40px', 
      height: '40px', 
      animation: 'spin 2s linear infinite',
      margin: '0 auto'
    }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  // Alert component
  const Alert = ({ variant, children }) => (
    <div style={{
      padding: '12px 16px',
      marginBottom: '16px',
      border: '1px solid transparent',
      borderRadius: '4px',
      backgroundColor: variant === 'danger' ? '#f8d7da' : '#d4edda',
      borderColor: variant === 'danger' ? '#f5c6cb' : '#c3e6cb',
      color: variant === 'danger' ? '#721c24' : '#155724'
    }}>
      {children}
    </div>
  );

  useEffect(() => {
    fetchPersonData();
  }, []);

  const fetchPersonData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/Person`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.isSuccess) {
        const persons = data.person || [];
        setPersonData(persons);
        console.log("Persons loaded:", persons);
      } else {
        throw new Error(data?.message || "Failed to retrieve person data");
      }
    } catch (err) {
      console.error("Error fetching person data:", err);
      setError(`Error fetching person data: ${err.message}`);
      setPersonData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div>
        {/* Image Upload Section */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>Upload Image for All Rows</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{
                padding: '8px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                backgroundColor: 'white'
              }}
            />
            
            {uploadedImage && (
              <>
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  style={{
                    width: '200px',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    border: '2px solid #28a745'
                  }}
                />
                <button
                  onClick={clearUploadedImage}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Clear Image
                </button>
              </>
            )}
          </div>
          
          {uploadedImage && (
            <p style={{ margin: '10px 0 0 0', color: '#28a745', fontSize: '14px' }}>
              ✓ This image will appear in all UP_Photo columns below
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <Spinner />
            <p>Loading person data...</p>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #dee2e6' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Photo</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left', backgroundColor: '#e3f2fd' }}>
                  UP_Photo (Uploaded)
                </th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>TIN Info</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Name</th>
              </tr>
            </thead>
            <tbody>
              {personData && personData.length > 0 ? (
                personData.map((person, index) => {
                  // Use the base64 string directly from attach_file
                  const originalImageUrl = person.attach_file ? base64ToImageUrl(person.attach_file) : null;

                  return (
                    <tr key={index}>
                      {/* Original Photo Column */}
                      <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                        {originalImageUrl ? (
                          <img 
                            src={originalImageUrl} 
                            alt="Person" 
                            style={{ 
                              width: '200px', 
                              height: '200px', 
                              objectFit: 'cover', 
                              borderRadius: '4px',
                              border: '1px solid #ccc'
                            }}
                            onError={(e) => {
                              console.error('Image failed to load:', person.attach_file?.substring(0, 50));
                              e.target.style.display = 'none';
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully for:', person.attach_Name);
                            }}
                          />
                        ) : (
                          <div style={{ 
                            width: '200px', 
                            height: '200px', 
                            backgroundColor: '#f8f9fa', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            fontSize: '12px',
                            color: '#6c757d'
                          }}>
                            No Image
                          </div>
                        )}
                      </td>
                      
                      {/* Uploaded Photo Column */}
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', backgroundColor: '#f8fbff' }}>
                        {uploadedImage ? (
                          <img 
                            src={uploadedImage} 
                            alt="Uploaded" 
                            style={{ 
                              width: '200px', 
                              height: '200px', 
                              objectFit: 'cover', 
                              borderRadius: '4px',
                              border: '2px solid #28a745'
                            }}
                          />
                        ) : (
                          <div style={{ 
                            width: '200px', 
                            height: '200px', 
                            backgroundColor: '#f8f9fa', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            borderRadius: '4px',
                            border: '1px dashed #ccc',
                            fontSize: '10px',
                            color: '#6c757d',
                            textAlign: 'center'
                          }}>
                            Upload Above
                          </div>
                        )}
                      </td>
                      
                      <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{person.tiN_Info || "N/A"}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{person.attach_Name || "N/A"}</td>
                    </tr>
                  );
                })
              ) : !isLoading ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{ textAlign: 'center', padding: '20px', border: '1px solid #dee2e6' }}
                  >
                    No person data found
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        {personData && personData.length > 0 && (
          <div style={{ 
            backgroundColor: '#e9ecef', 
            padding: '15px', 
            borderRadius: '4px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            Total persons: {personData.length}
            {uploadedImage && (
              <span style={{ color: '#28a745', marginLeft: '20px' }}>
                • Uploaded image applied to all rows
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoManagement;