document.getElementById("saveTabsButton").addEventListener("click", async () => {
  const groupName = prompt("Enter a name for this group:");
  if (!groupName) return;

  const tabs = await chrome.tabs.query({});
  const tabData = tabs.map(tab => ({ title: tab.title, url: tab.url }));

  chrome.storage.local.get("tabGroups", (data) => {
    const tabGroups = data.tabGroups || [];
    tabGroups.push({ name: groupName, tabs: tabData });
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
  
        const openButton = document.createElement("button");
        openButton.textContent = "Open";
        openButton.addEventListener("click", () => openGroup(group.tabs));
  
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteGroup(index));
  
        listItem.appendChild(groupName);
        listItem.appendChild(openButton);
        listItem.appendChild(deleteButton);
        groupsList.appendChild(listItem);
      });
    });
  }
  
  // Open all tabs in a group
  function openGroup(tabs) {
    tabs.forEach(tab => {
      chrome.tabs.create({ url: tab.url });
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