function loadGroups() {
    chrome.storage.local.get("tabGroups", (data) => {
        const groupsList = document.getElementById("groupsList");
        groupsList.innerHTML = "";

        const tabGroups = data.tabGroups || [];
        tabGroups.forEach((group, index) => {
            const listItem = document.createElement("li");
            listItem.className = "group-item";

            const groupHeader = document.createElement("div");
            groupHeader.className = "group-header";

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

            showTabs(listItem, group, index);
            listItem.addEventListener("click", () => showTabs(listItem, group, index));
        });
    });
}

function showTabs(parent, group, groupIndex) {
    if (group.showDetails === true) {
        group.showDetails = false;
        const tabs = document.createElement("ul");
        tabs.className = "tabs";

        group.tabs.forEach((tab, tabIndex) => {
            const tabItem = document.createElement("li");
            tabItem.className = "tab-item";

            const tabTitle = document.createElement("div");
            tabTitle.textContent = tab.title;
            tabTitle.className = "tab-title";

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => deleteTab(tabIndex, groupIndex));

            tabItem.appendChild(tabTitle);
            tabItem.appendChild(deleteButton);
            tabs.appendChild(tabItem);
        });

        parent.appendChild(tabs);
    } else {
        const tabs = parent.getElementsByClassName("tabs")[0];
        if (tabs) {
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

function deleteTab(tabIndex, groupIndex) {
    chrome.storage.local.get("tabGroups", (data) => {
        const tabGroups = data.tabGroups || [];
        if (tabGroups[groupIndex]) {
            tabGroups[groupIndex].tabs.splice(tabIndex, 1);
            chrome.storage.local.set({ tabGroups }, () => {
                loadGroups();
            });
        }
    });
}

// Load groups on page load
loadGroups();
