document.addEventListener('DOMContentLoaded', async () => {
    const folderInput = document.getElementById('folder');
    const fileInput = document.getElementById('file');
    const statusMessage = document.getElementById('statusMessage');
    const folderSelect = document.getElementById('folderSelect');
    const allFoldersDiv = document.getElementById('allFolder');
    const userId = JSON.parse(localStorage.getItem('user'));

    if(!userId){
        window.location.href = 'login.html';
    }

    const createFolderBtn = document.getElementById('createFolderBtn');
    const uploadFileBtn = document.getElementById('uploadFileBtn');

    await getAllFolder();

    createFolderBtn.addEventListener('click', async () => {
        const folderName = folderInput.value.trim();
        if (!folderName) {
            showStatusMessage('Folder name is required!', 'error');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/folder/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: folderName, userId }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to create folder');

            showStatusMessage('Folder created successfully!', 'success');
            folderInput.value = ''; 
            getAllFolder();
        } catch (error) {
            showStatusMessage(error.message, 'error');
        }
    });

    // Event: Upload file
    uploadFileBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        const folderId = folderSelect.value;

        if (!file || !folderId) {
            showStatusMessage('File and folder selection are required!', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);
        formData.append('folderId', folderId);

        try {
            const response = await fetch(`http://localhost:8080/api/file/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to upload file');

            showStatusMessage('File uploaded successfully!', 'success');
            fileInput.value = ''; 
            getAllFolder();
        } catch (error) {
            showStatusMessage(error.message, 'error');
        }
    });


    document.addEventListener('click', async (e) => {
        const trashIcon = e.target.closest('.trash-icon');

        if (trashIcon) {
            const folderId = trashIcon.dataset.folderId;
            if (!folderId) {
                showStatusMessage('Folder ID not found. Unable to delete folder.', 'error');
                return;
            }

            const confirmDelete = confirm("Are you sure you want to delete this folder?");
            if (!confirmDelete) {
                return;
            }

            await deleteFolder(folderId, userId);
        }
    });


    document.addEventListener('click', async (e) => {
        const deleteFileIcon = e.target.closest('.delete-file-icon');

        if (deleteFileIcon) {
            const fileId = deleteFileIcon.dataset.fileId;
            const folderId = deleteFileIcon.dataset.folderId;
            if (!fileId || !folderId) {
                showStatusMessage('File ID or Folder ID not found. Unable to delete file.', 'error');
                return;
            }

            const confirmDelete = confirm("Are you sure you want to delete this file?");
            if (!confirmDelete) {
                return;
            }

            await deleteFile(fileId, folderId, userId);
        }
    });

    async function deleteFolder(folderId, userId) {
        try {
            const response = await fetch(`http://localhost:8080/api/folder/delete/${folderId}/${userId}`, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete folder');
            }

            showStatusMessage('Folder deleted successfully!', 'success');
            getAllFolder(); 
        } catch (error) {
            showStatusMessage(`Error: ${error.message}`, 'error');
        }
    }

    async function deleteFile(fileId, folderId, userId) {
        try {
            const response = await fetch(`http://localhost:8080/api/file/delete/${fileId}/${folderId}/${userId}`, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete file');
            }

            showStatusMessage('File deleted successfully!', 'success');
            getAllFolder(); 
        } catch (error) {
            showStatusMessage(`Error: ${error.message}`, 'error');
        }
    }

    async function getAllFolder() {
        try {
            const response = await fetch(`http://localhost:8080/api/folder/folders/${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch folders');

            if (Array.isArray(data.data)) {
                folderSelect.innerHTML = '<option value="">Select a folder</option>'; // Reset options
                data.data.forEach(folder => {
                    const option = document.createElement('option');
                    option.value = folder.id;
                    option.textContent = folder.name;
                    folderSelect.appendChild(option);
                });


                allFoldersDiv.innerHTML = data.data.map(folder => `
                    <div class="folder-item" data-folder-id="${folder.id}">
                        <div class="folder-header">
                            <span>${folder.name}</span>
                            <span class="icon trash-icon" data-folder-id="${folder.id}">
                                <ion-icon name="trash-outline"></ion-icon>
                            </span>
                        </div>
                        <div class="folder-details">
                            <p>Created: ${new Date(folder.createdAt).toLocaleString()}</p>
                            ${folder.files.length > 0 ? `
                                <ul class="files-list">
                                    ${folder.files.map(file => `
                                        <li class="file-item">
                                            <p>${file.filename}</p>
                                            <p>Size: ${file.size} bytes</p>
                                            <span class="icon delete-file-icon" data-file-id="${file.id}" data-folder-id="${folder.id}">
                                                <ion-icon name="trash-outline"></ion-icon>
                                            </span>
                                        </li>
                                    `).join('')}
                                </ul>
                            ` : '<p class="no-files">No files in this folder</p>'}
                        </div>
                    </div>
                `).join('');
            } else {
                allFoldersDiv.innerHTML = '<p class="no-folders">No folders found</p>';
            }
        } catch (error) {
            showStatusMessage(error.message, 'error');
        }
    }


    function showStatusMessage(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = type;
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = '';
        }, 3000);
    }
});
