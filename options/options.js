const deleteIconUrl = chrome.runtime.getURL('icons/delete-red.png');
const openIconUrl = chrome.runtime.getURL('icons/open-blue.png');
const tabsIconUrl = chrome.runtime.getURL('icons/tabs-blue.png');

document.getElementById("searchInput").addEventListener("input", (event) => {
    chrome.storage.local.get("tabGroups", (data) => {
        const tabGroups = data.tabGroups || [];
        const searchValue = event.target.value.toLowerCase();
        const filteredGroups = tabGroups.filter(group => group.name.toLowerCase().includes(searchValue));
        loadGroups(filteredGroups);
    });
});

function loadGroups(tabGroups) {
    const groupsList = document.getElementById("groupsList");
    groupsList.innerHTML = "";

    tabGroups.forEach((group, index) => {
        const listItem = document.createElement("li");
        listItem.className = "group-item";

        const groupHeader = document.createElement("div");
        groupHeader.className = "group-header";

        const groupNameInput = document.createElement("input");
        groupNameInput.className = "group-name";
        groupNameInput.type = "text";
        groupNameInput.value = group.name;
        groupNameInput.addEventListener("change", () => renameGroup(index, groupNameInput.value));

        const groupDetails = document.createElement("div");
        groupDetails.className = "group-details";
        groupDetails.textContent = `${group.tabs.length} tabs`;

        const deleteIcon = document.createElement("img");
        deleteIcon.src = deleteIconUrl;
        deleteIcon.alt = "Delete";
        deleteIcon.className = "icon";
        deleteIcon.addEventListener("click", () => deleteGroup(index));

        const tabIcon = document.createElement("img");
        tabIcon.src = tabsIconUrl;
        tabIcon.alt = "Show Tabs";
        tabIcon.className = "icon";
        tabIcon.addEventListener("click", () => {
            tabGroups[index].showDetails = !tabGroups[index].showDetails;
            chrome.storage.local.set({ tabGroups }, () => showTabs(listItem, tabGroups, index));
        });

        const groupActions = document.createElement("div");
        groupActions.className = "group-actions";
        groupActions.appendChild(deleteIcon);
        groupActions.appendChild(tabIcon);

        groupHeader.appendChild(groupNameInput);
        groupHeader.appendChild(groupDetails);
        groupHeader.appendChild(groupActions);
        listItem.appendChild(groupHeader);
        groupsList.appendChild(listItem);
        showTabs(listItem, tabGroups, index);
    });

    if (tabGroups.length === 0) {
        const emptyMessage = document.createElement("div");
        emptyMessage.id = "empty-message";
        emptyMessage.textContent = "No groups saved yet!";
        groupsList.appendChild(emptyMessage);
    }
}

function showTabs(parent, groups, groupIndex) {
    if (groups[groupIndex].showDetails === true) {
        const tabs = document.createElement("ul");
        tabs.className = "tabs";

        groups[groupIndex].tabs.forEach((tab, tabIndex) => {
            const groupName = tab.groupInfo.groupName;

            const tabItem = document.createElement("li");
            tabItem.className = "tab-item";

            const tabGroup = document.createElement("div");
            tabGroup.className = "tab-group";
            tabGroup.textContent = groupName;
            tabGroup.style.backgroundColor = tab.groupInfo.groupColor;

            const tabInfo = document.createElement("div");
            tabInfo.className = "tab-info";

            const tabTitle = document.createElement("div");
            tabTitle.textContent = tab.title;
            tabTitle.className = "tab-title";

            const deleteIcon = document.createElement("img");
            deleteIcon.src = deleteIconUrl;
            deleteIcon.alt = "Delete";
            deleteIcon.className = "icon";
            deleteIcon.addEventListener("click", () => deleteTab(tabIndex, groupIndex));

            const openIcon = document.createElement("img");
            openIcon.src = openIconUrl;
            openIcon.alt = "Open";
            openIcon.className = "icon";
            openIcon.addEventListener("click", () => chrome.tabs.create({ url: tab.url }));

            const tabActions = document.createElement("div");
            tabActions.className = "tab-actions";
            tabActions.appendChild(deleteIcon);
            tabActions.appendChild(openIcon);

            tabInfo.appendChild(tabTitle);
            tabInfo.appendChild(tabActions);
            if (groupName !== 0) tabItem.appendChild(tabGroup);
            tabItem.appendChild(tabInfo);
            tabs.appendChild(tabItem);
        });

        parent.appendChild(tabs);
    } else {
        const tabs = parent.getElementsByClassName("tabs")[0];
        if (tabs) {
            parent.removeChild(tabs);
        }
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
            loadGroups(tabGroups);
        });
    });
}

function deleteTab(tabIndex, groupIndex) {
    chrome.storage.local.get("tabGroups", (data) => {
        const tabGroups = data.tabGroups || [];
        if (tabGroups[groupIndex]) {
            tabGroups[groupIndex].tabs.splice(tabIndex, 1);
            chrome.storage.local.set({ tabGroups }, () => {
                loadGroups(tabGroups);
            });
        }
    });
}

// Load groups on page load
chrome.storage.local.get("tabGroups", (data) => loadGroups(data.tabGroups || []));
