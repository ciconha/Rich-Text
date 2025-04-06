const initializer = () => {

    const optionsButtons = document.querySelectorAll(".option-button");
    const advanceOptionButton = document.querySelectorAll(".adv-option-button");
    const fontName = document.getElementById("fontName");
    const fontSizeRef = document.getElementById("font-size");
    const writingArea = document.getElementById("text-input");
    const forceColor = document.getElementById("forceColor");
    const backColor = document.getElementById("backColor");
    const alignButtons = document.querySelectorAll(".align");
    const spacingButtons = document.querySelectorAll(".spacing");
    const formatButtons = document.querySelectorAll(".format");
    const scriptButtons = document.querySelectorAll(".script");


    const fontList = ["Arial", "Verdana", "Georgia", "Courier New", "cursive"];


    Highlighter(alignButtons, true);
    Highlighter(spacingButtons, true);
    Highlighter(formatButtons, false);
    Highlighter(scriptButtons, true);


    fontList.forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.innerHTML = value;
        if (fontName) fontName.appendChild(option);
    });


    if (fontName) {
        fontName.addEventListener("change", () => {
            document.execCommand("fontName", false, fontName.value);
        });
    }


    if (fontSizeRef) {
        for (let i = 1; i <= 7; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.innerHTML = `Tamanho ${i}`;
            fontSizeRef.appendChild(option);
        }
        fontSizeRef.addEventListener("change", () => {
            document.execCommand("fontSize", false, fontSizeRef.value);
        });
    }

    optionsButtons.forEach((button) => {
        button.addEventListener("click", () => {
            modifyText(button.id, false, null);
        });
    });


    advanceOptionButton.forEach((button) => {
        button.addEventListener("change", () => {
            modifyText(button.id, false, button.value);
        });
    });
};


const modifyText = (command, defaultUI, value) => {
    document.execCommand(command, defaultUI, value);
};


const Highlighter = (className, needsRemoval) => {
    className.forEach((button) => {
        button.addEventListener("click", () => {
            if (needsRemoval) {
                let alreadyActive = false;

                if (button.classList.contains("active")) {
                    alreadyActive = true;
                }

                HighlighterRemover(className);
                if (!alreadyActive) {
                    button.classList.add("active");
                }
            } else {
                button.classList.toggle("active");
            }
        });
    });
};


const HighlighterRemover = (className) => {
    className.forEach((button) => {
        button.classList.remove("active");
    });
};


document.addEventListener("DOMContentLoaded", initializer);



const observer = new MutationObserver((mutationsList, observer) => {
    mutationsList.forEach((mutation) => {
        console.log(`Mudança detectada: ${mutation.type}`);
        if (mutation.type === "childList") {
            console.log("Um nó foi inserido ou removido no editor de texto.");
        } else if (mutation.type === "attributes") {
            console.log(`O atributo ${mutation.attributeName} foi modificado.`);
        }
    });
});


const targetNode = document.getElementById("text-input");


const config = { attributes: true, childList: true, subtree: true };

observer.observe(targetNode, config);



document.addEventListener("DOMContentLoaded", () => {
    const writingArea = document.getElementById("text-input");
    const insertImageButton = document.getElementById("insertImageButton");
    const saveToFileButton = document.getElementById("saveToFileButton");
    const imageControls = document.getElementById("imageControls");

    let currentImage = null;


    const setupImageInsertion = () => {
        const imageInput = document.createElement("input");
        imageInput.type = "file";
        imageInput.accept = "image/*";

        insertImageButton.addEventListener("click", () => {
            imageInput.click();
        });

        imageInput.addEventListener("change", () => {
            const file = imageInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement("img");
                    img.src = e.target.result;
                    img.style.maxWidth = "100%";
                    img.style.marginTop = "10px";
                    img.classList.add("editable-image");
                    writingArea.appendChild(img);

                    currentImage = img;
                    showImageControls();
                };
                reader.readAsDataURL(file);
            }
        });
    };


    const showImageControls = () => {
        if (currentImage) {
            imageControls.style.display = "flex";

            const imageWidth = document.getElementById("imageWidth");
            const imageHeight = document.getElementById("imageHeight");
            const imageAlignment = document.getElementById("imageAlignment");


            imageWidth.addEventListener("input", () => {
                currentImage.style.width = `${imageWidth.value}px`;
            });


            imageHeight.addEventListener("input", () => {
                currentImage.style.height = `${imageHeight.value}px`;
            });


            imageAlignment.addEventListener("change", () => {
                const alignment = imageAlignment.value;
                currentImage.style.display = "block";
                currentImage.style.marginLeft = alignment === "center" ? "auto" : alignment === "left" ? "0" : "auto";
                currentImage.style.marginRight = alignment === "center" ? "auto" : alignment === "right" ? "0" : "auto";
            });
        }
    };


    const setupFileSaving = () => {
        saveToFileButton.addEventListener("click", () => {
            const text = writingArea.innerHTML;
            const blob = new Blob([text], { type: "text/html" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "notas.html";
            a.click();
            URL.revokeObjectURL(url);
        });
    };


    setupImageInsertion();
    setupFileSaving();
});
