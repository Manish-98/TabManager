const deleteIconUrl = chrome.runtime.getURL('icons/delete-red.png');
const openIconUrl = chrome.runtime.getURL('icons/open-blue.png');
const tabsIconUrl = chrome.runtime.getURL('icons/tabs-blue.png');

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
            groupNameInput.className = "group-name";
            groupNameInput.type = "text";
            groupNameInput.value = group.name;
            groupNameInput.addEventListener("change", () => renameGroup(index, groupNameInput.value));

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
                showTabs(listItem, tabGroups, index)
            });

            const groupActions = document.createElement("div");
            groupActions.className = "group-actions";
            groupActions.appendChild(deleteIcon);
            groupActions.appendChild(tabIcon);

            groupHeader.appendChild(groupNameInput);
            groupHeader.appendChild(groupActions);
            listItem.appendChild(groupHeader);
            groupsList.appendChild(listItem);

            showTabs(listItem, tabGroups, index);
        });
    });
}

function showTabs(parent, groups, groupIndex) {
    if (groups[groupIndex].showDetails === true) {
        const tabs = document.createElement("ul");
        tabs.className = "tabs";

        groups[groupIndex].tabs.forEach((tab, tabIndex) => {
            const tabItem = document.createElement("li");
            tabItem.className = "tab-item";

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

            tabItem.appendChild(tabTitle);
            tabItem.appendChild(tabActions);
            tabs.appendChild(tabItem);
        });

        parent.appendChild(tabs);
    } else {
        const tabs = parent.getElementsByClassName("tabs")[0];
        if (tabs) {
            parent.removeChild(tabs);
        }
    }

    chrome.storage.local.set({ tabGroups: groups });
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
