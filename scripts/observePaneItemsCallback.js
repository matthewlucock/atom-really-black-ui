const checkboxClass = "input-checkbox";
const toggleClass = "input-toggle";

module.exports = function(paneItem) {
    // Ensure that all checkboxes have Atom's checkbox class so that they are
    // styled.
    const checkboxes = paneItem.element.querySelectorAll(
        "input[type=\"checkbox\"]"
    );

    for (const checkbox of checkboxes) {
        if (
                !checkbox.classList.contains(checkboxClass)
                && !checkbox.classList.contains(toggleClass)
        ) {
            checkbox.classList.add(checkboxClass);
        }
    }
};
