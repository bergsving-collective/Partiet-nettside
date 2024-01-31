document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.querySelector("button[data-func='save']");
    const visJsonButton = document.querySelector("button[data-func='vis-json']");

    saveButton.addEventListener("click", function () {
        const content = document.querySelector(".editor").innerHTML;
        localStorage.setItem("wysiwyg", content);

        const savedIndicator = document.createElement("span");
        savedIndicator.classList.add("saved");
        savedIndicator.innerHTML = '<i class="fa fa-check"></i>';

        document.querySelector(".editor").appendChild(savedIndicator);

        setTimeout(function () {
            savedIndicator.style.opacity = 0;
            savedIndicator.addEventListener("transitionend", function () {
                savedIndicator.remove();
            }, { once: true });
        }, 1000);
    });


    if (typeof Storage !== "undefined") {
        const storedContent = localStorage.getItem("wysiwyg");
        if (storedContent) {
            document.querySelector(".editor").innerHTML = storedContent;
        }

        document.querySelector(".editor").addEventListener("keypress", function () {
            const savedIndicator = document.querySelector(".editor .saved");
            if (savedIndicator) {
                savedIndicator.remove();
            }
        });
    }


    visJsonButton.addEventListener("click", function () {
        const id = Math.floor(10000000 + Math.random() * 90000000).toString();

        const title = document.querySelector(".title-input").value;
        const subtitle = document.querySelector(".subtitle-input").value;
        const image = document.querySelector(".image-input").value;
        const imageCredit = document.querySelector(".image-credits-input").value;
        const imageDescription = document.querySelector(".image-description-input").value;
        const content = document.querySelector(".editor").innerHTML;

        const article = {
            id: id,
            title: title,
            subtitle: subtitle,
            image: image,
            imageCredit: imageCredit,
            imageDescription: imageDescription,
            datetime: new Date().toISOString(),
            content: content,
        };

        const json = JSON.stringify(article, null, 2);

        // Create a Blob with the JSON data
        const blob = new Blob([json], { type: "application/json" });

        // Create a temporary anchor element
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${id}.json`;
        a.click();

        // Clean up
        URL.revokeObjectURL(a.href);
    });

    function execCommand(command, value = null) {
        document.execCommand(command, false, value);
    }

    const toolbarButtons = document.querySelectorAll(".toolbar button");
    toolbarButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const func = button.getAttribute("data-func");
            execCommand(func);
        });
    });

    const formatSelect = document.querySelector(".customSelect select");
    formatSelect.addEventListener("change", function () {
        const func = formatSelect.getAttribute("data-func");
        const value = formatSelect.options[formatSelect.selectedIndex].value;
        execCommand(func, value);
    });

    // Event handler for input event on the editor
    document.querySelector(".editor").addEventListener("input", function () {
        updateFormatSelector();
    });

    // Event handlers for mouseup and keyup events on the editor
    const editor = document.querySelector(".editor");
    editor.addEventListener("mouseup", function () {
        updateFormatSelector();
    });
    editor.addEventListener("keyup", function () {
        updateFormatSelector();
    });

    // Function to update the format selector based on the current selection
    function updateFormatSelector() {
        const formatSelect = document.querySelector(".customSelect select");
        const selectedFormat = document.queryCommandValue("formatBlock");
        formatSelect.value = selectedFormat;
    }

    // Handle the paste event
    editor.addEventListener("paste", function (event) {
        event.preventDefault(); // Prevent the default paste behavior

        // Get the pasted text
        const clipboardData = event.clipboardData || window.clipboardData;
        const pastedText = clipboardData.getData("text/plain");

        // Insert the pasted text as plain text
        insertPlainText(pastedText);
    });

    // Function to insert plain text into the editor
    function insertPlainText(text) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
    }

});