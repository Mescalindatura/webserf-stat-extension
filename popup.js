let activeTabsData = [];

// Function to update the activeTabsData with the current active tabs
async function updateActiveTabsData() {
    const activeTabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    activeTabsData = activeTabs.map(tab => {
        console.log("active tab id: ", tab.id);
        // const title = tab.title.split('-')[0].trim();
        // const hostname = new URL(tab.url).hostname;
        const title = tab.id;
        const hostname=tab.status;
        return { title, hostname };
    });

    //todo: put datetime to the record for future analytics
//    chrome.storage.local.set({ activeTabsData });
}

// Query and update activeTabsData on initialization
await updateActiveTabsData();

// Sort activeTabsData
const collator = new Intl.Collator();
activeTabsData.sort((a, b) => collator.compare(a.title, b.title));

// Render tabs list
const template = document.getElementById('li_template');
const elements = new Set();
for (const tab of activeTabsData) {
    const element = template.content.firstElementChild.cloneNode(true);

    element.querySelector('.title').textContent = tab.title;
    element.querySelector('.pathname').textContent = tab.hostname; // Use tab.hostname instead of tab.pathname
    element.querySelector('a').addEventListener('click', async () => {
        // Since we are using activeTabsData, we don't need to update tabs or windows
    });

    elements.add(element);
}

function displayAnalytics() {
    // Retrieve activeTabsData from local storage
    chrome.storage.local.get(['activeTabsData'], result => {
        const storedData = result.activeTabsData || [];
        console.log("Analytics:", storedData);
    });
}

document.querySelector('ul').append(...elements);

// Code for analytics button
const button = document.querySelector('button');
button.addEventListener('click', async () => {
    await updateActiveTabsData();
    displayAnalytics();
});


