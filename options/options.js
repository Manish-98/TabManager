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

            showTabs(listItem, group);
            listItem.addEventListener("click", () => showTabs(listItem, group));
        });
    });
}

function showTabs(parent, group) {
    if (group.showDetails === true) {
        group.showDetails = false;
        const tabs = document.createElement("ul");
        tabs.className = "tabs";

        group.tabs.forEach(tab => {
            const tabItem = document.createElement("li");
            tabItem.className = "tab-item";

            const tabTitle = document.createElement("div");
            tabTitle.textContent = tab.title;
            tabTitle.className = "tab-title";

            const tabLink = document.createElement("div");
            tabLink.textContent = tab.url;
            tabLink.className = "tab-link";

            tabItem.appendChild(tabTitle);
            tabItem.appendChild(tabLink);
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

// Load groups on page load
loadGroups();
