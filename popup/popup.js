const deleteIconUrl = chrome.runtime.getURL("icons/delete-red.png");
const openIconUrl = chrome.runtime.getURL("icons/open-blue.png");

const settings = document.getElementById("settingsIcon")
settings.src = chrome.runtime.getURL("icons/settings.png");
settings.addEventListener("click", () => {
  chrome.tabs.create({ url: "options/options.html" });
});

document.getElementById("saveTabsButton").addEventListener("click", async () => {
  const groupName = prompt("Enter a name for this group:");
  if (!groupName) return;

  const tabs = await chrome.tabs.query({});
  const tabData = tabs.map(tab => ({ title: tab.title, url: tab.url }));

  chrome.storage.local.get("tabGroups", (data) => {
    const tabGroups = data.tabGroups || [];
    tabGroups.push({ name: groupName, tabs: tabData, showDetails: false });
    chrome.storage.local.set({ tabGroups }, () => {
      alert("Group saved!");
      loadGroups();
    });
  });
});

function loadGroups() {
  chrome.storage.local.get("tabGroups", (data) => {
    const groupsList = document.getElementById("groupsList");
    groupsList.innerHTML = ""; // Clear existing list

    const tabGroups = data.tabGroups || [];
    tabGroups.forEach((group, index) => {
      const listItem = document.createElement("li");

      const groupName = document.createElement("span");
      groupName.textContent = group.name;

      const openIcon = document.createElement("img");
      openIcon.src = openIconUrl;
      openIcon.addEventListener("click", () => openGroup(group.tabs));

      const deleteIcon = document.createElement("img");
      deleteIcon.src = deleteIconUrl;
      deleteIcon.addEventListener("click", () => deleteGroup(index));

      const actionButtons = document.createElement("div");
      actionButtons.className = "action-buttons";
      actionButtons.appendChild(deleteIcon);
      actionButtons.appendChild(openIcon);

      listItem.appendChild(groupName);
      listItem.appendChild(actionButtons);
      groupsList.appendChild(listItem);
    });
  });
}

// Open all tabs in a group
async function openGroup(tabs) {
  const openTabs = await chrome.tabs.query({});

  tabs.forEach(tab => {
    if (!openTabs.some(openTab => openTab.url === tab.url)) {
      chrome.tabs.create({ url: tab.url });
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

// Load groups on popup open
loadGroups();