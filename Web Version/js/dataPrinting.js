const outputDiv = document.body.querySelector("#output");

function displayData(item, nameToDisplay = "Object") {
    let outputHTML = `<div class=item info><h3>${nameToDisplay}</h3>`;

    let itemType = 'PIXI.Container';
    if (item instanceof PIXI.Graphics) itemType = 'PIXI.Graphics'
    if (item instanceof PIXI.Sprite) itemType = 'PIXI.Sprite'
    outputHTML += `<h4>Type: ${itemType}</h4>`;

    outputHTML += `<h4>Parent</h4>`;
    if (item.parent)
        outputHTML += `<p class=info>${item.parent.label}</p>`;

    outputHTML += `<h4>Children</h4>`;
    if (item.children) {
        outputHTML += "<p class=info>";
        item.children.forEach(child => {
            outputHTML += `${child.label}, `;
        });
        outputHTML += "</p>";
    }

    outputHTML += `<h4>Local Position</h4>`;
    outputHTML += `<p class=info>(${item.position.x}, ${item.position.y})</p>`;

    outputHTML += `<h4>Global Position</h4>`;
    outputHTML += `<p class=info>(${item.getGlobalPosition().x}, ${item.getGlobalPosition().y})</p>`;

    outputHTML += `<h4>Size</h4>`;
    outputHTML += `<p class=info>Height: ${item.height} | Width: ${item.width}</p>`;

    outputHTML += `<h4>Pivot</h4>`;
    outputHTML += `<p class=info>(${item.pivot.x}, ${item.pivot.y})</p>`;

    outputHTML += `<h4>Rotation</h4>`;
    outputHTML += `<p class=info>${item.rotation} radians | ${item.angle} degrees</p>`;

    outputHTML += `<h4>Scale</h4>`;
    outputHTML += `<p class=info>X: ${item.scale.x} | Y: ${item.scale.y}</p>`;

    outputHTML += `<h4>Local Bounds</h4>`;
    outputHTML += `<p class=info>X: ${item.getLocalBounds().x} | Y: ${item.getLocalBounds().y}</p>`;
    outputHTML += `<p class=info>Height: ${item.getLocalBounds().height} | Width: ${item.getLocalBounds().width}</p>`;
    outputHTML += `<p class=info>Top: ${item.getLocalBounds().top} | Right: ${item.getLocalBounds().right} | Bottom: ${item.getLocalBounds().bottom} | Left: ${item.getLocalBounds().left}</p>`;

    outputHTML += `<h4>Global Bounds</h4>`;
    outputHTML += `<p class=info>X: ${item.getBounds().x} | Y: ${item.getBounds().y}</p>`;
    outputHTML += `<p class=info>Height: ${item.getBounds().height} | Width: ${item.getBounds().width}</p>`;

    if (item.boundsArea) {
        outputHTML += `<h4>boundsArea (Rectangle)</4>`;
        outputHTML += `<p class=info>X: ${item.boundsArea.x} | Y: ${item.boundsArea.y}</p>`;
        outputHTML += `<p class=info>Height: ${item.boundsArea.height} | Width: ${item.boundsArea.width}</p>`;
    }

    if (itemType == 'PIXI.Graphics') {
        if (item.bounds) {
            outputHTML += `<h4>bounds (Rectangle)</4>`;
            outputHTML += `<p class=info>X: ${item.bounds.x} | Y: ${graphic.bounds.y}</p>`;
            outputHTML += `<p class=info>Height: ${item.bounds.height} | Width: ${item.bounds.width}</p>`;
            outputHTML += `<p class=info>Top: ${item.bounds.top} | Right: ${item.bounds.right} | Bottom: ${item.bounds.bottom} | Left: ${item.bounds.left}</p>`;
        }
    }

    if (itemType == 'PIXI.Sprite') {
        if (item.anchor) {
            outputHTML += `<h4>Anchor</4>`;
            outputHTML += `<p class=info>X: ${item.anchor.x} | Y: ${graphic.anchor.y}</p>`;
        }
    }

    // outputHTML += `<h4>Parent</h4>`;
    // outputHTML += `<p class=info>${2}</p>`;
    outputHTML += `</div>`;
    outputDiv.innerHTML += outputHTML;
}

function displayContainerData(container, nameToDisplay = "Container Object") {
    let outputHTML = `<div class=info><h3>${nameToDisplay}</h3>`;

    outputHTML += `<h4>Parent</h4>`;
    if (container.parent)
        outputHTML += `<p class=info>${container.parent.label}</p>`;

    outputHTML += `<h4>Children</h4>`;
    if (container.children) {
        outputHTML += "<p class=info>";
        container.children.forEach(child => {
            outputHTML += `${child.label}, `;
        });
        outputHTML += "</p>";
    }

    if (container.boundsArea) {
        outputHTML += `<h4>boundsArea (Rectangle)</4>`;
        outputHTML += `<p class=info>X: ${container.boundsArea.x} | Y: ${container.boundsArea.y}</p>`;
        outputHTML += `<p class=info>Height: ${container.boundsArea.height} | Width: ${container.boundsArea.width}</p>`;
    }

    outputHTML += `<h4>Pivot</h4>`;
    outputHTML += `<p class=info>(${container.pivot.x}, ${container.pivot.y})</p>`;

    outputHTML += `<h4>Rotation</h4>`;
    outputHTML += `<p class=info>${container.rotation} radians | ${container.angle} degrees</p>`;

    outputHTML += `<h4>.scale</h4>`;
    outputHTML += `<p class=info>X: ${container.scale.x} | Y: ${container.scale.y}</p>`;

    outputHTML += `<h4>Size</h4>`;
    outputHTML += `<p class=info>Height: ${container.height} | Width: ${container.width}</p>`;

    outputHTML += `<h4>Local Position</h4>`;
    outputHTML += `<p class=info>(${container.position.x}, ${container.position.y})</p>`;

    outputHTML += `<h4>Global Position</h4>`;
    outputHTML += `<p class=info>(${container.getGlobalPosition().x}, ${container.getGlobalPosition().y})</p>`;

    outputHTML += `<h4>Local Bounds</h4>`;
    outputHTML += `<p class=info>X: ${container.getLocalBounds().x} | Y: ${container.getLocalBounds().y}</p>`;
    outputHTML += `<p class=info>Height: ${container.getLocalBounds().height} | Width: ${container.getLocalBounds().width}</p>`;
    outputHTML += `<p class=info>Top: ${container.getLocalBounds().top} | Right: ${container.getLocalBounds().right} | Bottom: ${container.getLocalBounds().bottom} | Left: ${container.getLocalBounds().left}</p>`;

    // outputHTML += `<h4>Parent</h4>`;
    // outputHTML += `<p class=info>${2}</p>`;
    outputHTML += `</div>`;
    outputDiv.innerHTML += outputHTML;
}

function displayGraphicsData(graphic, nameToDisplay = "Graphics Object") {
    let outputHTML = `<div class= box info><h3>${nameToDisplay}</h3>`;

    outputHTML += `<h4>Parent</h4>`;
    if (graphic.parent)
        outputHTML += `<p class=info>${graphic.parent.label}</p>`;

    outputHTML += `<h4>Children</h4>`;
    if (graphic.children) {
        outputHTML += "<p class=info>";
        graphic.children.forEach(child => {
            outputHTML += `${child.label}, `;
        });
        outputHTML += "</p>";
    }

    if (graphic.bounds) {
        outputHTML += `<h4>bounds (Rectangle)</4>`;
        outputHTML += `<p class=info>X: ${graphic.bounds.x} | Y: ${graphic.bounds.y}</p>`;
        outputHTML += `<p class=info>Height: ${graphic.bounds.height} | Width: ${graphic.bounds.width}</p>`;
        outputHTML += `<p class=info>Top: ${graphic.bounds.top} | Right: ${graphic.bounds.right} | Bottom: ${graphic.bounds.bottom} | Left: ${graphic.bounds.left}</p>`;
    }

    outputHTML += `<h4>Pivot</h4>`;
    outputHTML += `<p class=info>(${graphic.pivot.x}, ${graphic.pivot.y})</p>`;

    outputHTML += `<h4>Rotation</h4>`;
    outputHTML += `<p class=info>${graphic.rotation} radians | ${graphic.angle} degrees</p>`;

    outputHTML += `<h4>.scale</h4>`;
    outputHTML += `<p class=info>X: ${graphic.scale.x} | Y: ${graphic.scale.y}</p>`;

    outputHTML += `<h4>Size</h4>`;
    outputHTML += `<p class=info>Height: ${graphic.height} | Width: ${graphic.width}</p>`;

    outputHTML += `<h4>Local Position</h4>`;
    outputHTML += `<p class=info>(${graphic.position.x}, ${graphic.position.y})</p>`;

    outputHTML += `<h4>Global Position</h4>`;
    outputHTML += `<p class=info>(${graphic.getGlobalPosition().x}, ${graphic.getGlobalPosition().y})</p>`;

    outputHTML += `<h4>Local Bounds</h4>`;
    outputHTML += `<p class=info>X: ${graphic.getLocalBounds().x} | Y: ${graphic.getLocalBounds().y}</p>`;
    outputHTML += `<p class=info>Height: ${graphic.getLocalBounds().height} | Width: ${graphic.getLocalBounds().width}</p>`;
    outputHTML += `<p class=info>Top: ${graphic.getLocalBounds().top} | Right: ${graphic.getLocalBounds().right} | Bottom: ${graphic.getLocalBounds().bottom} | Left: ${graphic.getLocalBounds().left}</p>`;


    outputHTML += `</div>`;
    outputDiv.innerHTML += outputHTML;
}