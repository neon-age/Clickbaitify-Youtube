

/*
// Saves options to chrome.storage
const saveOptions = () => {
  const color = document.getElementById('color').value;
  const likesColor = document.getElementById('like').checked;

  chrome.storage.sync.set(
    { favoriteColor: color, likesColor: likesColor },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    }
  );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get(
    { favoriteColor: 'red', likesColor: true },
    (items) => {
      document.getElementById('color').value = items.favoriteColor;
      document.getElementById('like').checked = items.likesColor;
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
*/

//document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('clear').addEventListener('click', () =>
{
    imagesArray.length = 0;
    chrome.storage.local.set({ imagesArray });
});


const pickerOpts = {
  types: [
    {
      description: "Images",
      accept: {
        "image/*": [".png", ".gif", ".jpeg", ".jpg"],
      },
    },
  ],
  excludeAcceptAllOption: true,
  multiple: true,
};

/*
function Refresh()
{

}

async function getFile() {
    let filesHandle =  await window.showOpenFilePicker(pickerOpts);

  // run code with our fileHandle
    let output = document.getElementById("listing");
     for (const file of event.target.files) {
      let item = document.createElement("li");
      item.textContent = file.webkitRelativePath;
      output.appendChild(item);
    }
}*/

class ImageData
{
    fileName;
    dataURL;
}

var imagesArray = [];

const filepicker = document.getElementById("filepicker");

filepicker.addEventListener("change", handleFiles, false);
RefreshFoldersList();

async function handleFiles() 
{
    const fileList = Array.from(this.files);
    
    for (let i = 0; i < fileList.length; i++)
    {
        let index = i;
        await new Promise((resolve, reject) =>
        {
            const file = fileList[index];
            const reader = new FileReader();
            
            reader.onload = () => 
            {
                let imageData = new ImageData();
                imageData.dataURL = reader.result;
                imageData.fileName = file.name;
                imagesArray.push(imageData);
                resolve();
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    chrome.storage.local.set({ imagesArray });
    RefreshFoldersList();
}

async function RefreshFoldersList()
{
    const listing = document.getElementById("listing");
    while(listing.firstChild){
        listing.removeChild(listing.firstChild);
    }
    await new Promise((resolve, reject) =>
    {
        const imagesData = chrome.storage.local.get("imagesArray", (items) => 
        {
            imagesArray = items.imagesArray;
            if (imagesArray == undefined)
                imagesArray = [];
            resolve();
        });
    });
    
    for (let i = 0; i < imagesArray.length; i++)
    {
        let image = imagesArray[i];
        let img = document.createElement("img");
        img.src = image.dataURL;
        listing.appendChild(img);
        //console.error(image.dataURL);
    }
}




/*
    for (let i = 0; i < fileList.length; i++)
    {
        const file = fileList[i];
        
        let imageData = new ImageData();
        reader.onload = () =>
        {
            imageData.dataURL = reader.result;
        };
        await reader.readAsDataURL(file);
        
        imageData.fileName = file.name;
        imagesArray.push(imageData.dataURL);
    }*/
















