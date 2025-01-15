function loadGroups() {
    chrome.storage.local.get("tabGroups", (data) => {
        const groupsList = document.getElementById("groupsList");
        groupsList.innerHTML = "";

        const tabGroups = data.tabGroups || [];
        tabGroups.forEach((group, index) => {
            const listItem = document.createElement("li");
            const groupHeader = document.createElement("div");

            const groupNameInput = document.createElement("input");
            groupNameInput.type = "text";
            groupNameInput.value = group.name;
            groupNameInput.addEventListener("change", () => renameGroup(index, groupNameInput.value));

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => deleteGroup(index));

            groupHeader.appendChild(groupNameInput);
            groupHeader.appendChild(deleteButton);
            listItem.appendChild(groupHeader);
            groupsList.appendChild(listItem);

            handleGroupClick(listItem, group);
            listItem.addEventListener("click", () => handleGroupClick(listItem, group));
        });
    });
}

function handleGroupClick(parent, group) {    
    if(group.showDetails === true) {
        group.showDetails = false;
        const tabs = document.createElement("ul");
        tabs.className = "tabs";
        
        group.tabs.forEach(tab => {
            const tabItem = document.createElement("li");
            tabItem.textContent = tab.title;
            tabs.appendChild(tabItem);
        });

        parent.appendChild(tabs);
    } else {
        const tabs = parent.getElementsByClassName("tabs")[0];
        if(tabs) {
            parent.removeChild(tabs);
        }
        group.showDetails = true;
    }
}

// Rename a group
function renameGroup(index, newName) {
    chrome.storage.local.get("tabGroups", (data) => {
        const tabGroups = data.tabGroups || [];
        if (tabGroups[index]) {
            tabGroups[index].name = newName;
            chrome.storage.local.set({ tabGroups }, () => {
                console.log("Group renamed successfully");
            });
        }
    });
}

// Delete a group
function deleteGroup(index) {
    chrome.storage.local.get("tabGroups", (data) => {
        const tabGroups = data.tabGroups || [];
        tabGroups.splice(index, 1);
        chrome.storage.local.set({ tabGroups }, () => {
            loadGroups(); // Refresh the list
        });
    });
}

// Load groups on page load
loadGroups();
