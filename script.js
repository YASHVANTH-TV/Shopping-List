document.getElementById("link-form").addEventListener("submit", function(e) {
    e.preventDefault();

    prompt("What product is it ?");

    const linkInput = document.getElementById("link-input");
    const url = linkInput.value;

    fetch(`https://api.linkpreview.net/?key=173d2e46689d24105f5162d2a4bdc04b&q=${encodeURIComponent(url)}`)
        .then(response => response.json())
        .then(data => {
            addLinkToContainer(data);
            saveLinkToLocalStorage(data);
            linkInput.value = '';
        })
        .catch(err => console.error('Error fetching link preview:', err));
})

function addLinkToContainer(data) {
    const linkContainer = document.getElementById("link-container");
    const linkCard = document.createElement("div");
    linkCard.className = "link-card";
    linkCard.setAttribute("data-url",data.url);

    const img = document.createElement('img');
    img.src = data.image || 'https://via.placeholder.com/100';
    img.alt = 'Link Image';

    const content = document.createElement('div');
    content.className = 'link-content';
    content.innerHTML = `
        <a href="${data.url}" target="_blank">
            <div class="link-title">${data.title}</div>
        </a>
        <div class="link-description">${data.description || 'No description available.'}</div>
    `;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.innerText = "Remove";
    removeBtn.addEventListener("click", function() {
        removeLink(linkCard, data.url);
    });

    linkCard.appendChild(img);
    linkCard.appendChild(content);
    linkCard.appendChild(removeBtn);
    linkContainer.appendChild(linkCard);
}

function removeLink(linkCard, url) {
    linkCard.remove();
}

function saveLinkToLocalStorage(data) {
    let savedLinks = JSON.parse(localStorage.getItem('savedLinks')) || [];
    savedLinks.push(data);
    localStorage.setItem('savedLinks', JSON.stringify(savedLinks));
}

function removeLinkFromLocalStorage(url) {
    let savedLinks = JSON.parse(localStorage.getItem('savedLinks')) || [];
    savedLinks = savedLinks.filter(link => link.url !== url);
    localStorage.setItem('savedLinks', JSON.stringify(savedLinks));
}

function loadLinksFromLocalStorage() {
    let savedLinks = JSON.parse(localStorage.getItem('savedLinks')) || [];
    savedLinks.forEach(link => addLinkToContainer(link));
}

document.addEventListener('DOMContentLoaded', loadLinksFromLocalStorage);