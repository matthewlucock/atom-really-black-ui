const checkboxClass = "input-checkbox";

const observePaneItemsCallback = function(paneItem) {
    const checkboxes = paneItem.element.querySelectorAll(
        "input[type=\"checkbox\"]"
    );

    for (const checkbox of checkboxes) {
        if (!checkbox.classList.contains(checkboxClass)) {
            checkbox.classList.add(checkboxClass);
        }
    }
}

const activate = function() {
    atom.workspace.observePaneItems(observePaneItemsCallback);
};

module.exports = {
    activate
};
